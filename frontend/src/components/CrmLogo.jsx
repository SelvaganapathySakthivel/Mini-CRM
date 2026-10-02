import { Box } from '@mui/material';

export const CrmLogo = ({ size = 34, sx = {} }) => {
  return (
    <Box
      component="svg"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        ...sx,
      }}
    >
      <defs>
        <linearGradient id="nexoraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7367F0" />
          <stop offset="100%" stopColor="#9E95F5" />
        </linearGradient>
        <linearGradient id="nexoraAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00BAD1" />
          <stop offset="100%" stopColor="#28C76F" />
        </linearGradient>
      </defs>
      {/* Outer rounded hexagon shield */}
      <rect width="32" height="32" rx="8" fill="url(#nexoraGrad)" />
      {/* Geometric 'N' & interconnected CRM node path */}
      <path
        d="M9 23V9L23 23V9"
        stroke="#FFFFFF"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Connected accent node dot */}
      <circle cx="23" cy="9" r="2.25" fill="#FFFFFF" />
      <circle cx="9" cy="23" r="2.25" fill="#FFFFFF" />
      <circle cx="16" cy="16" r="2" fill="url(#nexoraAccent)" />
    </Box>
  );
};

export default CrmLogo;
