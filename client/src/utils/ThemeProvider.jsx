import { createTheme } from '@mui/material/styles';

const DibsTheme = createTheme({
  palette: {
    primary: {
      main: '#2196F3', // Blue
    },
    secondary: {
      main: '#FF9800', // Orange
    },
    background: {
      default: '#F5F5F5', // Light Gray
      paper: '#FFFFFF', // White
    },
    text: {
      primary: '#333333', // Dark Gray
      secondary: '#666666', // Medium Gray
    },
    default: {
      main: '#FFFFFF', // White
    },
  },
});

export default DibsTheme;