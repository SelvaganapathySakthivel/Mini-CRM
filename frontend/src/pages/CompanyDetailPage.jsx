import { useState, useEffect, useCallback } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  Chip,
  Avatar,
  Link,
  Alert,
  Skeleton,
  Divider,
} from '@mui/material';
import {
  IconArrowLeft,
  IconBuildingSkyscraper,
  IconMail,
  IconPhone,
  IconWorld,
  IconMapPin,
} from '@tabler/icons-react';
import companyService from '../services/companyService';
import CRMTable from '../components/crm/CRMTable';

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

const CompanyDetailPage = () => {
  const { id } = useParams();

  const [company, setCompany] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCompanyData = useCallback(async (isMountedRef = { current: true }) => {
    if (!id) return;
    setLoading(true);
    setError('');

    try {
      const data = await companyService.getCompanyLeads(id);
      if (isMountedRef.current) {
        setCompany(data.company || null);
        setLeads(data.leads || []);
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Request timed out: Server took too long to respond.');
      } else if (err.response) {
        if (err.response.status === 404) {
          setError('Company not found. It may have been deleted or the ID is invalid.');
        } else if (err.response.status === 400) {
          setError('Invalid company ID format.');
        } else {
          setError(err.response.data?.message || 'Failed to fetch company information.');
        }
      } else {
        setError('Network error: Unable to connect to server.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    const isMountedRef = { current: true };
    fetchCompanyData(isMountedRef);
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchCompanyData]);

  const leadColumns = [
    {
      id: 'name',
      label: 'Lead Name',
      minWidth: 200,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              fontSize: '0.8125rem',
              fontWeight: 600,
            }}
          >
            {row.name?.charAt(0)?.toUpperCase() || 'L'}
          </Avatar>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {row.name}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'email',
      label: 'Email Address',
      minWidth: 180,
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.email}
        </Typography>
      ),
    },
    {
      id: 'phone',
      label: 'Phone Number',
      minWidth: 140,
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.phone}
        </Typography>
      ),
    },
    {
      id: 'assignedTo',
      label: 'Assigned User',
      minWidth: 160,
      render: (row) => (
        <Typography variant="body2" color="text.primary">
          {row.assignedTo?.name || 'Unassigned'}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      render: (row) => (
        <Chip
          variant="tonal"
          color={getStatusColor(row.status)}
          label={row.status}
          size="small"
          sx={{ fontWeight: 600, textTransform: 'capitalize' }}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <Skeleton variant="rounded" width={160} height={36} sx={{ mb: 3 }} />
        <Card sx={{ p: 3, mb: 4, borderRadius: 2.5 }}>
          <Skeleton variant="text" width="40%" height={38} sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Skeleton variant="text" width="80%" height={24} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Skeleton variant="text" width="80%" height={24} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Skeleton variant="text" width="80%" height={24} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Skeleton variant="text" width="80%" height={24} />
            </Grid>
          </Grid>
        </Card>
        <Skeleton variant="rounded" width="100%" height={240} sx={{ borderRadius: 2.5 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: '100%' }}>
        <Button
          component={RouterLink}
          to="/companies"
          variant="tonal"
          color="secondary"
          startIcon={<IconArrowLeft size={18} />}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          Back to Companies
        </Button>
        <Alert
          severity="error"
          sx={{ borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => fetchCompanyData()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Back Navigation Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          component={RouterLink}
          to="/companies"
          variant="tonal"
          color="secondary"
          startIcon={<IconArrowLeft size={18} />}
          sx={{ fontWeight: 600, borderRadius: 2 }}
        >
          Back to Companies
        </Button>
      </Box>

      {/* Company Header & Overview Card */}
      {company && (
        <Card
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            mb: 3.5,
            borderRadius: 2.5,
            border: '1px solid rgba(47, 43, 61, 0.12)',
            boxShadow: '0 2px 10px 0 rgba(47, 43, 61, 0.08)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 2.5,
                bgcolor: 'rgba(115, 103, 240, 0.12)',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconBuildingSkyscraper size={28} />
            </Box>

            <Box>
              <Typography variant="h4" fontWeight={700} color="text.primary">
                {company.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Registered on {new Date(company.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3, borderColor: 'rgba(47, 43, 61, 0.08)' }} />

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <IconMail size={20} color="#808390" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Email Address
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {company.email || '—'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <IconPhone size={20} color="#808390" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Phone
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {company.phone || '—'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <IconWorld size={20} color="#808390" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Website
                  </Typography>
                  {company.website ? (
                    <Link
                      href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                      fontWeight={600}
                      color="primary.main"
                      underline="hover"
                    >
                      {company.website.replace(/^https?:\/\//, '')}
                    </Link>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      —
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <IconMapPin size={20} color="#808390" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Address
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {company.address || '—'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>
      )}

      {/* Associated Leads Table */}
      <CRMTable
        title={`Associated Leads (${leads.length})`}
        columns={leadColumns}
        data={leads}
        emptyMessage="No leads currently linked with this company"
      />
    </Box>
  );
};

export default CompanyDetailPage;
