import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  MenuItem,
  IconButton,
  Tooltip,
  Alert,
  Avatar,
  Menu,
  Chip,
} from '@mui/material';
import {
  IconPlus,
  IconRefresh,
  IconEdit,
  IconTrash,
  IconCheckbox,
  IconChevronDown,
} from '@tabler/icons-react';
import { toast } from 'react-toastify';

import CustomTextField from '@core/components/mui/TextField';
import CustomAutocomplete from '@core/components/mui/Autocomplete';
import CRMTable from '../components/crm/CRMTable';
import CRMDialog from '../components/crm/CRMDialog';
import taskService from '../services/taskService';
import authService from '../services/authService';
import leadService from '../services/leadService';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed'];

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'warning';
    case 'In Progress':
      return 'primary';
    case 'Completed':
      return 'success';
    default:
      return 'secondary';
  }
};

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [userFilter, setUserFilter] = useState('All');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Selection
  const [selectedRows, setSelectedRows] = useState([]);

  // Modal Dialog States (Create / Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [modalApiError, setModalApiError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'Pending',
    assignedTo: '',
    lead: '',
  });

  // Delete Confirmation Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Status Change Menu State
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const [activeTaskForStatus, setActiveTaskForStatus] = useState(null);

  // Fetch Tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await taskService.getTasks({
        status: statusFilter !== 'All' ? statusFilter : undefined,
        assignedTo: userFilter !== 'All' ? userFilter : undefined,
      });
      setTasks(data.tasks || []);
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Failed to fetch tasks.');
      } else {
        setError('Network error: Unable to load tasks from server.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, userFilter]);

  // Fetch Auxiliary Data
  const fetchDropdownData = useCallback(async () => {
    try {
      const [usersData, leadsData] = await Promise.all([
        authService.getUsers(),
        leadService.getLeads({ limit: 100 }),
      ]);
      setUsers(usersData.users || []);
      setLeads(leadsData.leads || []);
    } catch (err) {
      console.error('Failed to load auxiliary user/lead data:', err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchDropdownData();
  }, [fetchDropdownData]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedTask(null);
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      status: 'Pending',
      assignedTo: '',
      lead: '',
    });
    setFormErrors({});
    setModalApiError('');
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (task) => {
    setIsEditing(true);
    setSelectedTask(task);
    setFormData({
      title: task.title || '',
      description: task.description || '',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      status: task.status || 'Pending',
      assignedTo: task.assignedTo?._id || task.assignedTo || '',
      lead: task.lead?._id || task.lead || '',
    });
    setFormErrors({});
    setModalApiError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!saving) {
      setModalOpen(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (modalApiError) {
      setModalApiError('');
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Task title is required';
    }
    if (formData.status && !STATUS_OPTIONS.includes(formData.status)) {
      errors.status = 'Please select a valid status';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    setModalApiError('');

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        dueDate: formData.dueDate || undefined,
        status: formData.status,
        assignedTo: formData.assignedTo || undefined,
        lead: formData.lead || undefined,
      };

      if (isEditing && selectedTask) {
        await taskService.updateTask(selectedTask._id, payload);
        toast.success('Task updated successfully');
      } else {
        await taskService.createTask(payload);
        toast.success('Task created successfully');
      }

      setModalOpen(false);
      fetchTasks();
    } catch (err) {
      if (err.response) {
        setModalApiError(err.response.data?.message || 'Failed to save task.');
      } else {
        setModalApiError('Network error: Unable to connect to server.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Status Menu Handlers
  const handleOpenStatusMenu = (event, task) => {
    event.stopPropagation();
    setStatusMenuAnchor(event.currentTarget);
    setActiveTaskForStatus(task);
  };

  const handleCloseStatusMenu = () => {
    setStatusMenuAnchor(null);
    setActiveTaskForStatus(null);
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!activeTaskForStatus || activeTaskForStatus.status === newStatus) {
      handleCloseStatusMenu();
      return;
    }

    const taskId = activeTaskForStatus._id;
    handleCloseStatusMenu();

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      toast.success(`Task marked as ${newStatus}`);
    } catch (err) {
      fetchTasks();
      toast.error(err.response?.data?.message || 'Failed to update task status.');
    }
  };

  // Delete Handlers
  const handleOpenDeleteDialog = (task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (!deleting) {
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setDeleting(true);

    try {
      await taskService.deleteTask(taskToDelete._id);
      setTasks((prev) => prev.filter((t) => t._id !== taskToDelete._id));
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task.');
    } finally {
      setDeleting(false);
    }
  };

  // Filter tasks by search query
  const filteredTasks = tasks.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.title?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.assignedTo?.name?.toLowerCase().includes(q) ||
      t.lead?.name?.toLowerCase().includes(q)
    );
  });

  const paginatedTasks = filteredTasks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const columns = [
    {
      id: 'title',
      label: 'Task',
      minWidth: 240,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: 'rgba(115, 103, 240, 0.08)',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <IconCheckbox size={20} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} color="text.primary" noWrap>
              {row.title}
            </Typography>
            {row.description && (
              <Typography variant="caption" color="text.secondary" noWrap display="block" sx={{ maxWidth: 280 }}>
                {row.description}
              </Typography>
            )}
          </Box>
        </Box>
      ),
    },
    {
      id: 'lead',
      label: 'Related Lead',
      minWidth: 160,
      render: (row) => (
        <Typography variant="body2" color="text.primary">
          {row.lead?.name || '—'}
        </Typography>
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
      id: 'dueDate',
      label: 'Due Date',
      minWidth: 130,
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.dueDate ? new Date(row.dueDate).toLocaleDateString() : '—'}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 140,
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
          <Tooltip title="Edit Task">
            <IconButton size="small" onClick={() => handleOpenEdit(row)} sx={{ color: 'text.secondary' }}>
              <IconEdit size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Task">
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
            Tasks Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Organize, prioritize, assign, and track CRM activities.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title="Refresh tasks">
            <IconButton
              onClick={() => {
                setRefreshing(true);
                fetchTasks();
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
            onClick={handleOpenCreate}
            sx={{ fontWeight: 600, px: 2.5 }}
          >
            Add Task
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2.5, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => fetchTasks()}>
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
        data={paginatedTasks}
        loading={loading}
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(0);
        }}
        searchPlaceholder="Search tasks..."
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={filteredTasks.length}
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
        filters={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ minWidth: 180 }}>
              <CustomAutocomplete
                size="small"
                options={['All', ...STATUS_OPTIONS]}
                value={statusFilter}
                onChange={(_, newValue) => {
                  setStatusFilter(newValue || 'All');
                  setPage(0);
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

            <Box sx={{ minWidth: 220 }}>
              <CustomAutocomplete
                size="small"
                options={[{ _id: 'All', name: 'All Assignees' }, ...users]}
                value={
                  userFilter === 'All'
                    ? { _id: 'All', name: 'All Assignees' }
                    : users.find((u) => u._id === userFilter) || { _id: 'All', name: 'All Assignees' }
                }
                onChange={(_, newValue) => {
                  setUserFilter(newValue ? newValue._id : 'All');
                  setPage(0);
                }}
                getOptionLabel={(option) => option?.name || ''}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    label="Assignee"
                    placeholder="All Assignees"
                  />
                )}
                disableClearable
              />
            </Box>
          </Box>
        }
        emptyMessage="No tasks found"
        loadingMessage="Loading tasks..."
      />

      {/* Status Menu */}
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
        {STATUS_OPTIONS.map((st) => (
          <MenuItem
            key={st}
            selected={activeTaskForStatus?.status === st}
            onClick={() => handleUpdateStatus(st)}
            sx={{ borderRadius: 1.5, py: 0.75, my: 0.25 }}
          >
            <Chip
              variant="tonal"
              color={getStatusColor(st)}
              label={st}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </MenuItem>
        ))}
      </Menu>

      {/* Create / Edit Modal using CRMDialog */}
      <CRMDialog
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveTask}
        title={isEditing ? 'Edit Task' : 'Add New Task'}
        subtitle={
          isEditing
            ? 'Update task details and due date'
            : 'Fill in details to assign a new activity'
        }
        loading={saving}
        submitText={isEditing ? 'Save Changes' : 'Create Task'}
        maxWidth="sm"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          {modalApiError && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {modalApiError}
            </Alert>
          )}

          <CustomTextField
            fullWidth
            label="Task Title"
            required
            name="title"
            placeholder="e.g. Follow up on proposal"
            value={formData.title}
            onChange={handleFormChange}
            error={Boolean(formErrors.title)}
            helperText={formErrors.title}
            disabled={saving}
            autoFocus
          />

          <CustomTextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            name="description"
            placeholder="Provide context or instructions for this task..."
            value={formData.description}
            onChange={handleFormChange}
            disabled={saving}
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
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleFormChange}
              disabled={saving}
              InputLabelProps={{ shrink: true }}
            />

            <CustomTextField
              select
              fullWidth
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              disabled={saving}
            >
              {STATUS_OPTIONS.map((st) => (
                <MenuItem key={st} value={st}>
                  {st}
                </MenuItem>
              ))}
            </CustomTextField>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
            }}
          >
            <CustomTextField
              select
              fullWidth
              label="Assign To"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleFormChange}
              disabled={saving}
            >
              <MenuItem value="">
                <em>Unassigned</em>
              </MenuItem>
              {users.map((u) => (
                <MenuItem key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </MenuItem>
              ))}
            </CustomTextField>

            <CustomTextField
              select
              fullWidth
              label="Related Lead"
              name="lead"
              value={formData.lead}
              onChange={handleFormChange}
              disabled={saving}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {leads.map((l) => (
                <MenuItem key={l._id} value={l._id}>
                  {l.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Box>
        </Box>
      </CRMDialog>

      {/* Delete Confirmation Dialog */}
      <CRMDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title="Delete Task"
        subtitle="Are you sure you want to delete this task? This action cannot be undone."
        maxWidth="xs"
        showActions={false}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {taskToDelete && (
            <Box sx={{ p: 2, bgcolor: 'rgba(255, 76, 81, 0.06)', borderRadius: 2, border: '1px solid rgba(255, 76, 81, 0.16)' }}>
              <Typography variant="body2" fontWeight={600} color="text.primary">
                {taskToDelete.title}
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
              {deleting ? 'Deleting...' : 'Delete Task'}
            </Button>
          </Box>
        </Box>
      </CRMDialog>
    </Box>
  );
};

export default TasksPage;
