import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  Alert,
  Button,
  Skeleton,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  IconUsers,
  IconUserCheck,
  IconCalendarEvent,
  IconCheckbox,
  IconRefresh,
  IconArrowRight,
  IconBuildingSkyscraper,
} from '@tabler/icons-react';
import dashboardService from '../services/dashboardService';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Failed to load dashboard metrics from server.');
      } else if (err.request) {
        setError('Network error: Unable to connect to CRM server.');
      } else {
        setError('An unexpected error occurred while fetching dashboard statistics.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const cardsConfig = [
    {
      title: 'Total Leads',
      value: stats?.totalLeads ?? 0,
      description: 'Active leads registered in CRM',
      Icon: IconUsers,
      color: 'primary',
      bgLight: 'rgba(115, 103, 240, 0.12)',
      textColor: '#7367F0',
      linkTo: '/leads',
      linkLabel: 'View all leads',
    },
    {
      title: 'Qualified Leads',
      value: stats?.qualifiedLeads ?? 0,
      description: 'Engaged & contacted prospects',
      Icon: IconUserCheck,
      color: 'success',
      bgLight: 'rgba(40, 199, 111, 0.12)',
      textColor: '#28C76F',
      linkTo: '/leads',
      linkLabel: 'View qualified leads',
    },
    {
      title: 'Tasks Due Today',
      value: stats?.tasksDueToday ?? 0,
      description: 'Activities scheduled for today',
      Icon: IconCalendarEvent,
      color: 'warning',
      bgLight: 'rgba(255, 159, 67, 0.12)',
      textColor: '#FF9F43',
      linkTo: '/tasks',
      linkLabel: 'View today tasks',
    },
    {
      title: 'Completed Tasks',
      value: stats?.completedTasks ?? 0,
      description: 'Tasks marked as completed',
      Icon: IconCheckbox,
      color: 'info',
      bgLight: 'rgba(0, 186, 209, 0.12)',
      textColor: '#00BAD1',
      linkTo: '/tasks',
      linkLabel: 'View completed tasks',
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
          gap: 1.5,
          mb: 3.5,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={600} color="text.primary">
            Dashboard Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time pipeline metrics and task progress in Nexora CRM.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Refresh metrics">
            <IconButton
              onClick={fetchStats}
              disabled={loading}
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid rgba(47, 43, 61, 0.12)',
                boxShadow: '0 2px 6px rgba(47, 43, 61, 0.06)',
              }}
            >
              <IconRefresh size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Error Alert with Retry */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3.5, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={fetchStats}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Metric Cards Grid */}
      <Grid container spacing={3}>
        {loading
          ? Array.from(new Array(4)).map((_, idx) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={idx}>
                <Card sx={{ p: 2.5, borderRadius: 2.5, height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Skeleton variant="text" width="55%" height={24} />
                    <Skeleton variant="circular" width={42} height={42} />
                  </Box>
                  <Skeleton variant="text" width="40%" height={48} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="80%" height={18} />
                </Card>
              </Grid>
            ))
          : cardsConfig.map((card, idx) => {
              const CardIcon = card.Icon;
              return (
                <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={idx}>
                  <Card
                    sx={{
                      p: 2.5,
                      borderRadius: 2.5,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      border: '1px solid rgba(47, 43, 61, 0.12)',
                      boxShadow: '0 2px 10px 0 rgba(47, 43, 61, 0.08)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: '0 4px 18px 0 rgba(47, 43, 61, 0.12)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 2,
                        }}
                      >
                        <Typography variant="body2" fontWeight={600} color="text.secondary">
                          {card.title}
                        </Typography>
                        <Box
                          sx={{
                            width: 42,
                            height: 42,
                            borderRadius: 2,
                            bgcolor: card.bgLight,
                            color: card.textColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <CardIcon size={24} stroke={1.75} />
                        </Box>
                      </Box>

                      <Typography
                        variant="h3"
                        fontWeight={700}
                        color="text.primary"
                        sx={{ mb: 0.5, lineHeight: 1.1 }}
                      >
                        {card.value}
                      </Typography>

                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                        {card.description}
                      </Typography>
                    </Box>

                    <Button
                      component={RouterLink}
                      to={card.linkTo}
                      variant="tonal"
                      color={card.color}
                      size="small"
                      endIcon={<IconArrowRight size={16} />}
                      sx={{
                        fontWeight: 600,
                        borderRadius: 1.5,
                        py: 0.75,
                        justifyContent: 'space-between',
                      }}
                    >
                      {card.linkLabel}
                    </Button>
                  </Card>
                </Grid>
              );
            })}
      </Grid>

      {/* Quick Launch Actions Card */}
      <Box sx={{ mt: 3.5 }}>
        <Card
          sx={{
            p: 3,
            borderRadius: 2.5,
            border: '1px solid rgba(47, 43, 61, 0.12)',
            boxShadow: '0 2px 10px 0 rgba(47, 43, 61, 0.08)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2.5 }}>
            <Typography variant="h5" fontWeight={600} color="text.primary">
              Quick CRM Actions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Direct shortcuts to manage pipeline operations and tasks.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              component={RouterLink}
              to="/leads"
              variant="contained"
              startIcon={<IconUsers size={18} />}
              sx={{ fontWeight: 600, borderRadius: 2 }}
            >
              Manage Leads
            </Button>
            <Button
              component={RouterLink}
              to="/companies"
              variant="tonal"
              color="primary"
              startIcon={<IconBuildingSkyscraper size={18} />}
              sx={{ fontWeight: 600, borderRadius: 2 }}
            >
              Browse Companies
            </Button>
            <Button
              component={RouterLink}
              to="/tasks"
              variant="tonal"
              color="secondary"
              startIcon={<IconCheckbox size={18} />}
              sx={{ fontWeight: 600, borderRadius: 2 }}
            >
              View Task Board
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardPage;
