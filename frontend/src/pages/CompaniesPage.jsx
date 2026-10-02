import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Alert,
  Avatar,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  IconPlus,
  IconRefresh,
  IconEye,
} from '@tabler/icons-react';
import { toast } from 'react-toastify';
import companyService from '../services/companyService';
import CRMTable from '../components/crm/CRMTable';
import CRMDialog from '../components/crm/CRMDialog';
import CustomTextField from '@core/components/mui/TextField';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Add Company Modal State
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [formApiError, setFormApiError] = useState('');

  // Selection
  const [selectedRows, setSelectedRows] = useState([]);

  const fetchCompanies = useCallback(async (isMountedRef = { current: true }) => {
    setLoading(true);
    setError('');
    try {
      const data = await companyService.getCompanies();
      if (isMountedRef.current) {
        setCompanies(data.companies || []);
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Request timed out: Server took too long to respond.');
      } else if (err.response) {
        setError(err.response.data?.message || 'Failed to fetch companies from server.');
      } else {
        setError('Network error: Unable to load companies.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    const isMountedRef = { current: true };
    fetchCompanies(isMountedRef);
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchCompanies]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(0);
  };

  const handleOpenCreateModal = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      website: '',
      address: '',
    });
    setFormErrors({});
    setFormApiError('');
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    if (!saving) {
      setOpenModal(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Company name is required';
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email format';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (formApiError) {
      setFormApiError('');
    }
  };

  const handleSaveCompany = async (e) => {
    e.preventDefault();
    setFormApiError('');

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        website: formData.website.trim() || undefined,
        address: formData.address.trim() || undefined,
      };

      await companyService.createCompany(payload);
      toast.success('Company registered successfully');
      setOpenModal(false);
      fetchCompanies();
    } catch (err) {
      if (err.response) {
        setFormApiError(err.response.data?.message || 'Failed to create company.');
      } else {
        setFormApiError('Network error: Unable to save company.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Filter companies by search query
  const filteredCompanies = companies.filter((c) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.phone?.toLowerCase().includes(query) ||
      c.website?.toLowerCase().includes(query) ||
      c.address?.toLowerCase().includes(query)
    );
  });

  const paginatedCompanies = filteredCompanies.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const columns = [
    {
      id: 'name',
      label: 'Company',
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
            {row.name?.charAt(0)?.toUpperCase() || 'C'}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Link
              component={RouterLink}
              to={`/companies/${row._id}`}
              underline="hover"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                display: 'block',
                '&:hover': { color: 'primary.main' },
              }}
            >
              {row.name}
            </Link>
            {row.website ? (
              <Typography
                variant="caption"
                component="a"
                href={row.website.startsWith('http') ? row.website : `https://${row.website}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {row.website.replace(/^https?:\/\//, '')}
              </Typography>
            ) : (
              <Typography variant="caption" color="text.secondary">
                No website
              </Typography>
            )}
          </Box>
        </Box>
      ),
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 160,
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.email || '—'}
        </Typography>
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
      id: 'address',
      label: 'Address',
      minWidth: 180,
      render: (row) => (
        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
          {row.address || '—'}
        </Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      minWidth: 100,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
          <Tooltip title="View Company Details">
            <IconButton
              component={RouterLink}
              to={`/companies/${row._id}`}
              size="small"
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              <IconEye size={18} />
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
            Companies
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your client organizations, accounts, and contact profiles.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title="Refresh companies">
            <IconButton
              onClick={() => {
                setRefreshing(true);
                fetchCompanies();
              }}
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
            onClick={handleOpenCreateModal}
            sx={{ fontWeight: 600, px: 2.5 }}
          >
            Add Company
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2.5, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => fetchCompanies()}>
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
        data={paginatedCompanies}
        loading={loading}
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search companies by name, email, address..."
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={filteredCompanies.length}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        selectable
        selectedRows={selectedRows}
        onSelectRow={(id) => {
          setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
          );
        }}
        onSelectAll={(allIds) => setSelectedRows(allIds)}
        emptyMessage="No companies found"
      />

      {/* Create Company Dialog */}
      <CRMDialog
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleSaveCompany}
        title="Add New Company"
        subtitle="Fill in the organization details to register a new account"
        loading={saving}
        submitText="Create Company"
        maxWidth="sm"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          {formApiError && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {formApiError}
            </Alert>
          )}

          <CustomTextField
            fullWidth
            label="Company Name"
            required
            name="name"
            placeholder="e.g. Acme Corporation"
            value={formData.name}
            onChange={handleFormChange}
            error={Boolean(formErrors.name)}
            helperText={formErrors.name}
            disabled={saving}
            autoFocus
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
            }}
          >
            <CustomTextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              placeholder="contact@acme.com"
              value={formData.email}
              onChange={handleFormChange}
              error={Boolean(formErrors.email)}
              helperText={formErrors.email}
              disabled={saving}
            />

            <CustomTextField
              fullWidth
              label="Phone Number"
              name="phone"
              placeholder="+1 555-0199"
              value={formData.phone}
              onChange={handleFormChange}
              disabled={saving}
            />
          </Box>

          <CustomTextField
            fullWidth
            label="Website"
            name="website"
            placeholder="https://acme.com"
            value={formData.website}
            onChange={handleFormChange}
            disabled={saving}
          />

          <CustomTextField
            fullWidth
            label="Address"
            name="address"
            placeholder="123 Business Way, Suite 400"
            value={formData.address}
            onChange={handleFormChange}
            disabled={saving}
          />
        </Box>
      </CRMDialog>
    </Box>
  );
};

export default CompaniesPage;
