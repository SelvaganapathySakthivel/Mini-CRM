import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CrmLogo from '../../CrmLogo';

const Logo = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, textDecoration: 'none' }}>
      <CrmLogo size={32} />
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: '1.2rem',
            color: 'text.primary',
            letterSpacing: '-0.02em',
          }}
        >
          Nexora
        </Typography>
        <Typography
          component="span"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'primary.main',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          CRM
        </Typography>
      </Box>
    </Box>
  );
};

export default Logo;
