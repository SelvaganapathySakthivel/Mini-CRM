import { Box, Typography, Button, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        p: 2,
      }}
    >
      <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 450, borderRadius: 3 }}>
        <Typography variant="h3" fontWeight={700} color="primary" mb={1}>
          404
        </Typography>
        <Typography variant="h6" fontWeight={600} mb={1}>
          Page Not Found
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          The page you are looking for does not exist or has been moved.
        </Typography>
        <Button component={RouterLink} to="/dashboard" variant="contained">
          Back to Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFoundPage;
