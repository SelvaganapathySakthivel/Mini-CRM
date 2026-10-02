import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  MenuItem,
  Menu,
  Avatar,
  Chip,
  Alert,
} from '@mui/material';
import {
  IconPlus,
  IconRefresh,
  IconEdit,
  IconTrash,
  IconBuilding,
  IconChevronDown,
} from '@tabler/icons-react';
import { toast } from 'react-toastify';
import leadService from '../services/leadService';
import companyService from '../services/companyService';
import authService from '../services/authService';
import LeadDialog from '../components/LeadDialog';
import CRMTable from '../components/crm/CRMTable';
import CRMDialog from '../components/crm/CRMDialog';
import CustomTextField from '@core/components/mui/TextField';
import CustomAutocomplete from '@core/components/mui/Autocomplete';

const STATUS_FILTERS = ['All', 'New', 'Contacted', 'Lost'];
const LEAD_STATUSES = ['New', 'Contacted', 'Lost'];

const getStatusColor = (status) => {
  switch (status) {
    case 'New':
      return 'primary';
    case 'Contacted':
      return 'success';
    case 'Lost':
      return 'secondary';
    default:
      return 'secondary';
  }
};

const LeadsPage = () => {
  // Leads data state
  const [leads, setLeads] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Loading & Error states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Dropdown reference data
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);

  // Create / Edit Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create' | 'edit'
  const [selectedLead, setSelectedLead] = useState(null);

  // Delete Confirmation Modal State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Status quick-change menu state
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const [selectedLeadForStatus, setSelectedLeadForStatus] = useState(null);

  // Selection
  const [selectedRows, setSelectedRows] = useState([]);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fetch reference lists (companies & users)
  const fetchReferences = useCallback(async () => {
    try {
      const [compData, userData] = await Promise.allSettled([
        companyService.getCompanies(),
        authService.getUsers(),
      ]);

      if (isMountedRef.current) {
        if (compData.status === 'fulfilled' && compData.value?.companies) {
          setCompanies(compData.value.companies);
        }
        if (userData.status === 'fulfilled' && userData.value?.users) {
          setUsers(userData.value.users);
        }
      }
    } catch {
      // Fallback silently
    }
  }, []);

  // Fetch leads list from backend
  const fetchLeads = useCallback(async (isBackgroundRefresh = false) => {
    if (isBackgroundRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      const data = await leadService.getLeads({
        page: page + 1,
        limit,
        search: search.trim(),
        status: statusFilter,
      });

      if (isMountedRef.current) {
        setLeads(data.leads || []);
        setTotalLeads(data.totalLeads || 0);
      }
    } catch (err) {
      if (isMountedRef.current) {
        if (err.response) {
          setError(err.response.data?.message || 'Failed to fetch leads from server.');
        } else {
          setError('Network error: Unable to load leads.');
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [page, limit, search, statusFilter]);

  useEffect(() => {
    fetchReferences();
  }, [fetchReferences]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Handle Search Input
  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(0);
  };

  // Handle Status Filter Change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  // Handle Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open Create Lead Dialog
  const handleOpenCreateDialog = () => {
    setSelectedLead(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  // Open Edit Lead Dialog
  const handleOpenEditDialog = (lead) => {
    setSelectedLead(lead);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedLead(null);
  };

  // Handle Lead Create/Edit Success
  const handleLeadSaved = (savedLead, mode) => {
    if (mode === 'edit') {
      setLeads((prev) =>
        prev.map((item) => (item._id === savedLead._id ? savedLead : item))
      );
    } else {
      setLeads((prev) => [savedLead, ...prev.slice(0, limit - 1)]);
      setTotalLeads((prev) => prev + 1);
    }
  };

  // Status Quick Change Handlers
  const handleOpenStatusMenu = (event, lead) => {
    event.stopPropagation();
    setStatusMenuAnchor(event.currentTarget);
    setSelectedLeadForStatus(lead);
  };

  const handleCloseStatusMenu = () => {
    setStatusMenuAnchor(null);
    setSelectedLeadForStatus(null);
  };

  const handleQuickStatusUpdate = async (newStatus) => {
    if (!selectedLeadForStatus || selectedLeadForStatus.status === newStatus) {
      handleCloseStatusMenu();
      return;
    }

    const leadId = selectedLeadForStatus._id;
    handleCloseStatusMenu();

    // Optimistically update local state immediately
    setLeads((prev) =>
      prev.map((item) => (item._id === leadId ? { ...item, status: newStatus } : item))
    );

    try {
      await leadService.updateLeadStatus(leadId, newStatus);
      toast.success(`Lead status updated to ${newStatus}`);
    } catch (err) {
      fetchLeads(true);
      toast.error(err.response?.data?.message || 'Unable to update lead status. Please try again.');
    }
  };

  // Soft Delete Handlers
  const handleOpenDeleteDialog = (lead) => {
    setLeadToDelete(lead);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (!deleting) {
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!leadToDelete) return;
    setDeleting(true);

    try {
      await leadService.deleteLead(leadToDelete._id);
      setLeads((prev) => prev.filter((item) => item._id !== leadToDelete._id));
      setTotalLeads((prev) => Math.max(0, prev - 1));
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
      toast.success('Lead deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete lead.');
    } finally {
      setDeleting(false);
    }
  };

  // Table Columns Definition
  const columns = [
    {
      id: 'lead',
      label: 'Lead',
      minWidth: 220,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            {row.name?.charAt(0)?.toUpperCase() || 'L'}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} color="text.primary" noWrap>
              {row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap display="block">
              {row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'phone',
      label: 'Phone',
      minWidth: 140,
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.phone || '—'}
        </Typography>
      ),
    },
    {
      id: 'company',
      label: 'Company',
      minWidth: 150,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconBuilding size={16} color="#808390" />
          <Typography variant="body2" color="text.primary">
            {row.company?.name || '—'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'assignedTo',
      label: 'Assigned To',
      minWidth: 160,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            sx={{
              width: 26,
              height: 26,
              bgcolor: 'secondary.light',
              fontSize: '0.75rem',
            }}
          >
            {row.assignedTo?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Typography variant="body2" color="text.primary">
            {row.assignedTo?.name || 'Unassigned'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 130,
      render: (row) => (
        <Chip
          variant="tonal"
          color={getStatusColor(row.status)}
          label={row.status}
          size="small"
          onClick={(e) => handleOpenStatusMenu(e, row)}
          deleteIcon={<IconChevronDown size={14} />}
          onDelete={(e) => handleOpenStatusMenu(e, row)}
          sx={{
            cursor: 'pointer',
            fontWeight: 600,
            textTransform: 'capitalize',
            '&:hover': { opacity: 0.85 },
          }}
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      minWidth: 100,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
          <Tooltip title="Edit Lead">
            <IconButton size="small" onClick={() => handleOpenEditDialog(row)} sx={{ color: 'text.secondary' }}>
              <IconEdit size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Lead">
            <IconButton size="small" onClick={() => handleOpenDeleteDialog(row)} sx={{ color: 'error.main' }}>
              <IconTrash size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={600} color="text.primary">
            Leads Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View, search, filter, update status, and manage client prospect leads.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title="Refresh leads">
            <IconButton
              onClick={() => fetchLeads(true)}
              disabled={loading || refreshing}
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid rgba(47, 43, 61, 0.12)',
                boxShadow: '0 2px 6px rgba(47, 43, 61, 0.06)',
              }}
            >
              <IconRefresh size={18} />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<IconPlus size={18} />}
            onClick={handleOpenCreateDialog}
            sx={{ fontWeight: 600, px: 2.5 }}
          >
            Add Lead
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2.5, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => fetchLeads()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Vuexy CRM Table */}
      <CRMTable
        columns={columns}
        data={leads}
        loading={loading}
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search leads..."
        page={page}
        rowsPerPage={limit}
        totalCount={totalLeads}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        selectable
        selectedRows={selectedRows}
        onSelectRow={(id) => {
          setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
          );
        }}
        onSelectAll={(allIds) => setSelectedRows(allIds)}
        filters={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ minWidth: 200 }}>
              <CustomAutocomplete
                size="small"
                options={STATUS_FILTERS}
                value={statusFilter}
                onChange={(_, newValue) => {
                  handleStatusFilterChange({ target: { value: newValue || 'All' } });
                }}
                getOptionLabel={(option) => (option === 'All' ? 'All Statuses' : option)}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    label="Status"
                    placeholder="All Statuses"
                  />
                )}
                disableClearable
              />
            </Box>
          </Box>
        }
        emptyMessage="No leads found"
      />

      {/* Status Quick-Change Menu */}
      <Menu
        anchorEl={statusMenuAnchor}
        open={Boolean(statusMenuAnchor)}
        onClose={handleCloseStatusMenu}
        PaperProps={{
          elevation: 2,
          sx: { borderRadius: 2, minWidth: 150, p: 0.5 },
        }}
      >
        <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 600, display: 'block' }}>
          Change Status
        </Typography>
        {LEAD_STATUSES.map((status) => (
          <MenuItem
            key={status}
            selected={selectedLeadForStatus?.status === status}
            onClick={() => handleQuickStatusUpdate(status)}
            sx={{ borderRadius: 1.5, py: 0.75, my: 0.25 }}
          >
            <Chip
              variant="tonal"
              color={getStatusColor(status)}
              label={status}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </MenuItem>
        ))}
      </Menu>

      {/* Create / Edit Dialog */}
      <LeadDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        mode={dialogMode}
        lead={selectedLead}
        companies={companies}
        users={users}
        onSuccess={handleLeadSaved}
      />

      {/* Delete Confirmation Modal using CRMDialog */}
      <CRMDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title="Delete Lead"
        subtitle="Are you sure you want to delete this lead? This action cannot be undone."
        maxWidth="xs"
        showActions={false}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {leadToDelete && (
            <Box sx={{ p: 2, bgcolor: 'rgba(255, 76, 81, 0.06)', borderRadius: 2, border: '1px solid rgba(255, 76, 81, 0.16)' }}>
              <Typography variant="body2" fontWeight={600} color="text.primary">
                {leadToDelete.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {leadToDelete.email}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
            <Button
              variant="tonal"
              color="secondary"
              onClick={handleCloseDeleteDialog}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Lead'}
            </Button>
          </Box>
        </Box>
      </CRMDialog>
    </Box>
  );
};

export default LeadsPage;
