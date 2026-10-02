import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7367F0',
      light: '#8F85F3',
      dark: '#675DD8',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#808390',
      light: '#999CA6',
      dark: '#737682',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#28C76F',
      light: '#48DA89',
      dark: '#20A65B',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FF9F43',
      light: '#FFB269',
      dark: '#E68F3C',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF4C51',
      light: '#FF7074',
      dark: '#E64449',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#00BAD1',
      light: '#33C8DA',
      dark: '#00A7BC',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2F2B3D',
      secondary: '#6D6777',
      disabled: '#A09BA6',
    },
    divider: '#DBDADE',
    action: {
      active: 'rgba(47, 43, 61, 0.54)',
      hover: 'rgba(47, 43, 61, 0.04)',
      selected: 'rgba(115, 103, 240, 0.08)',
      disabled: 'rgba(47, 43, 61, 0.26)',
      disabledBackground: 'rgba(47, 43, 61, 0.12)',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: { fontWeight: 700, letterSpacing: '-0.02em', color: '#2F2B3D' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em', color: '#2F2B3D' },
    h3: { fontWeight: 600, letterSpacing: '-0.01em', color: '#2F2B3D' },
    h4: { fontWeight: 600, letterSpacing: '-0.01em', color: '#2F2B3D', fontSize: '1.375rem' },
    h5: { fontWeight: 600, letterSpacing: '-0.01em', color: '#2F2B3D', fontSize: '1.125rem' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em', color: '#2F2B3D', fontSize: '0.9375rem' },
    subtitle1: { fontSize: '0.9375rem', fontWeight: 500, color: '#6D6777' },
    subtitle2: { fontSize: '0.8125rem', fontWeight: 500, color: '#6D6777' },
    body1: { fontSize: '0.9375rem', lineHeight: 1.5, color: '#2F2B3D' },
    body2: { fontSize: '0.8125rem', lineHeight: 1.45, color: '#6D6777' },
    caption: { fontSize: '0.75rem', color: '#6D6777' },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: '#FF4C51 !important',
          fontWeight: 700,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#6D6777',
          fontSize: '0.875rem',
        },
        asterisk: {
          color: '#FF4C51 !important',
          fontWeight: 700,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 18px',
          boxShadow: 'none',
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(47, 43, 61, 0.12)',
          },
        },
        containedPrimary: {
          boxShadow: '0 2px 6px rgba(115, 103, 240, 0.38)',
          '&:hover': {
            backgroundColor: '#675DD8',
            boxShadow: '0 4px 12px rgba(115, 103, 240, 0.45)',
          },
        },
        containedSecondary: {
          boxShadow: '0 2px 6px rgba(128, 131, 144, 0.38)',
          '&:hover': {
            backgroundColor: '#737682',
            boxShadow: '0 4px 12px rgba(128, 131, 144, 0.45)',
          },
        },
      },
      variants: [
        {
          props: { variant: 'tonal' },
          style: {
            backgroundColor: 'rgba(115, 103, 240, 0.12)',
            color: '#7367F0',
            '&:hover': {
              backgroundColor: 'rgba(115, 103, 240, 0.22)',
            },
          },
        },
        {
          props: { variant: 'tonal', color: 'primary' },
          style: {
            backgroundColor: 'rgba(115, 103, 240, 0.12)',
            color: '#7367F0',
            '&:hover': {
              backgroundColor: 'rgba(115, 103, 240, 0.22)',
            },
          },
        },
        {
          props: { variant: 'tonal', color: 'secondary' },
          style: {
            backgroundColor: 'rgba(128, 131, 144, 0.12)',
            color: '#808390',
            '&:hover': {
              backgroundColor: 'rgba(128, 131, 144, 0.22)',
            },
          },
        },
        {
          props: { variant: 'tonal', color: 'success' },
          style: {
            backgroundColor: 'rgba(40, 199, 111, 0.12)',
            color: '#28C76F',
            '&:hover': {
              backgroundColor: 'rgba(40, 199, 111, 0.22)',
            },
          },
        },
        {
          props: { variant: 'tonal', color: 'warning' },
          style: {
            backgroundColor: 'rgba(255, 159, 67, 0.12)',
            color: '#FF9F43',
            '&:hover': {
              backgroundColor: 'rgba(255, 159, 67, 0.22)',
            },
          },
        },
        {
          props: { variant: 'tonal', color: 'error' },
          style: {
            backgroundColor: 'rgba(255, 76, 81, 0.12)',
            color: '#FF4C51',
            '&:hover': {
              backgroundColor: 'rgba(255, 76, 81, 0.22)',
            },
          },
        },
        {
          props: { variant: 'tonal', color: 'info' },
          style: {
            backgroundColor: 'rgba(0, 186, 209, 0.12)',
            color: '#00BAD1',
            '&:hover': {
              backgroundColor: 'rgba(0, 186, 209, 0.22)',
            },
          },
        },
      ],
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 10px 0 rgba(47, 43, 61, 0.08)',
        },
        elevation2: {
          boxShadow: '0 4px 18px 0 rgba(47, 43, 61, 0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(47, 43, 61, 0.12)',
          boxShadow: '0 2px 10px 0 rgba(47, 43, 61, 0.08)',
          borderRadius: 10,
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
          height: 24,
          fontSize: '0.75rem',
        },
      },
      variants: [
        {
          props: { variant: 'tonal', color: 'primary' },
          style: {
            backgroundColor: 'rgba(115, 103, 240, 0.12)',
            color: '#7367F0',
          },
        },
        {
          props: { variant: 'tonal', color: 'secondary' },
          style: {
            backgroundColor: 'rgba(128, 131, 144, 0.12)',
            color: '#808390',
          },
        },
        {
          props: { variant: 'tonal', color: 'success' },
          style: {
            backgroundColor: 'rgba(40, 199, 111, 0.12)',
            color: '#28C76F',
          },
        },
        {
          props: { variant: 'tonal', color: 'warning' },
          style: {
            backgroundColor: 'rgba(255, 159, 67, 0.12)',
            color: '#FF9F43',
          },
        },
        {
          props: { variant: 'tonal', color: 'error' },
          style: {
            backgroundColor: 'rgba(255, 76, 81, 0.12)',
            color: '#FF4C51',
          },
        },
        {
          props: { variant: 'tonal', color: 'info' },
          style: {
            backgroundColor: 'rgba(0, 186, 209, 0.12)',
            color: '#00BAD1',
          },
        },
      ],
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#2F2B3D',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(47, 43, 61, 0.12)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(47, 43, 61, 0.12)',
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
  },
});

export default theme;
