import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import useAuth from '../hooks/useAuth';

const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', bgcolor: '#ffffff' }}>
      <Outlet />
    </Box>
  );
};

export default AuthLayout;
