import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.up('md')]: {
    '&:before': {
      zIndex: 0,
      position: 'absolute',
      height: '234px',
      width: '238px',
      content: '""',
      top: 'calc(50% - 240px)',
      left: 'calc(50% - 280px)',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='238' height='234' viewBox='0 0 238 234' fill='none'%3E%3Crect x='87.9395' y='0.5' width='149' height='149' rx='19.5' stroke='%237367F0' stroke-opacity='0.16'/%3E%3Crect y='33.5608' width='200' height='200' rx='10' fill='%237367F0' fill-opacity='0.08'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      pointerEvents: 'none',
    },
    '&:after': {
      zIndex: 0,
      position: 'absolute',
      height: '180px',
      width: '180px',
      content: '""',
      bottom: 'calc(50% - 220px)',
      right: 'calc(50% - 280px)',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180' fill='none'%3E%3Crect x='1' y='1' width='178' height='178' rx='19' stroke='%237367F0' stroke-opacity='0.16' stroke-width='2' stroke-dasharray='8 8'/%3E%3Crect x='22.5' y='22.5' width='135' height='135' rx='10' fill='%237367F0' fill-opacity='0.08'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      pointerEvents: 'none',
    },
  },
}));

const AuthIllustrationWrapper = ({ children }) => {
  return (
    <StyledContainer>
      <Box sx={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
        {children}
      </Box>
    </StyledContainer>
  );
};

export default AuthIllustrationWrapper;
