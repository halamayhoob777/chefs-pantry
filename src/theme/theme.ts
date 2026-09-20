import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#10B981', // Emerald Green
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F97316', // Warm Orange
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8FAFC', // Soft off-white
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
});