import { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';

import CustomTextField from '@core/components/mui/TextField';
import CustomAutocomplete from '@core/components/mui/Autocomplete';
import CRMDialog from './crm/CRMDialog';
import leadService from '../services/leadService';

const LEAD_STATUS_OPTIONS = ['New', 'Contacted', 'Lost'];

export const LeadDialog = ({
  open,
  onClose,
  mode = 'create', // 'create' | 'edit'
  lead = null,
  companies = [],
  users = [],
  onSuccess, // (savedLead, mode) => void
}) => {
  const isEdit = mode === 'edit';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'New',
    assignedTo: '',
    company: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Sync state on open/lead change
  useEffect(() => {
    if (open) {
      if (isEdit && lead) {
        setFormData({
          name: lead.name || '',
          email: lead.email || '',
          phone: lead.phone || '',
          status: lead.status || 'New',
          assignedTo: lead.assignedTo?._id || lead.assignedTo || '',
          company: lead.company?._id || lead.company || '',
        });
      } else {
        setFormData({
          name: '',
          email: '',
          phone: '',
          status: 'New',
          assignedTo: '',
          company: '',
        });
      }
      setFormErrors({});
    }
  }, [open, isEdit, lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Lead Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Lead Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone Number is required';
    }

    if (!formData.status) {
      errors.status = 'Status is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        status: formData.status,
        assignedTo: formData.assignedTo || null,
        company: formData.company || null,
      };

      let result;
      if (isEdit && lead) {
        result = await leadService.updateLead(lead._id, payload);
        toast.success('Lead updated successfully');
      } else {
        result = await leadService.createLead(payload);
        toast.success('Lead created successfully');
      }

      const savedLead = result.lead;
      if (onSuccess) {
        onSuccess(savedLead, mode);
      }
      onClose();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        'Failed to save lead. Please check the inputs and try again.';
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const selectedCompany = companies.find((c) => c._id === formData.company) || null;
  const selectedUser = users.find((u) => u._id === formData.assignedTo) || null;

  return (
    <CRMDialog
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={isEdit ? 'Edit Lead' : 'Add New Lead'}
      subtitle={
        isEdit
          ? 'Update prospect lead information and assignment'
          : 'Fill in the details below to create a new sales lead'
      }
      loading={saving}
      submitText={isEdit ? 'Save Changes' : 'Create Lead'}
      maxWidth="sm"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
        {/* Lead Name */}
        <CustomTextField
          fullWidth
          label="Lead Name"
          required
          name="name"
          placeholder="e.g. John Doe"
          value={formData.name}
          onChange={handleChange}
          error={Boolean(formErrors.name)}
          helperText={formErrors.name}
          disabled={saving}
          autoFocus
        />

        {/* Email & Phone in 2-column layout */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          {/* Email Address */}
          <CustomTextField
            fullWidth
            label="Email Address"
            required
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            error={Boolean(formErrors.email)}
            helperText={formErrors.email}
            disabled={saving}
          />

          {/* Phone Number */}
          <CustomTextField
            fullWidth
            label="Phone Number"
            required
            name="phone"
            placeholder="e.g. +1 555-0199"
            value={formData.phone}
            onChange={handleChange}
            error={Boolean(formErrors.phone)}
            helperText={formErrors.phone}
            disabled={saving}
          />
        </Box>

        {/* Status & Assigned To in 2-column layout */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          {/* Status */}
          <CustomTextField
            select
            fullWidth
            label="Status"
            required
            name="status"
            value={formData.status}
            onChange={handleChange}
            error={Boolean(formErrors.status)}
            helperText={formErrors.status}
            disabled={saving}
          >
            {LEAD_STATUS_OPTIONS.map((st) => (
              <MenuItem key={st} value={st}>
                {st}
              </MenuItem>
            ))}
          </CustomTextField>

          {/* Assigned To Autocomplete */}
          <CustomAutocomplete
            fullWidth
            options={users}
            value={selectedUser}
            onChange={(event, newValue) => {
              setFormData((prev) => ({
                ...prev,
                assignedTo: newValue ? newValue._id : '',
              }));
            }}
            getOptionLabel={(option) =>
              option.name ? `${option.name} (${option.email})` : ''
            }
            isOptionEqualToValue={(option, value) => option._id === value._id}
            disabled={saving}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                label="Assigned To"
                placeholder="Select user"
              />
            )}
          />
        </Box>

        {/* Company Autocomplete */}
        <CustomAutocomplete
          fullWidth
          options={companies}
          value={selectedCompany}
          onChange={(event, newValue) => {
            setFormData((prev) => ({
              ...prev,
              company: newValue ? newValue._id : '',
            }));
          }}
          getOptionLabel={(option) => option.name || ''}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          disabled={saving}
          renderInput={(params) => (
            <CustomTextField
              {...params}
              label="Company"
              placeholder="Select company"
            />
          )}
        />
      </Box>
    </CRMDialog>
  );
};

export default LeadDialog;
