import { createTheme } from '@mui/material/styles';

const DibsTheme = createTheme({
  palette: {
    primary: {
      main: '#DFB685' // Blue
    },
    secondary: {
      main: '#988671' // Orange
    },
    background: {
      default: '#F5F5F5', // Light Gray
      paper: '#FFFFFF', // White
      secondary: '#17213C'
    },
    text: {
      primary: '#333333', // Dark Gray
      secondary: '#666666' // Medium Gray
    },
    default: {
      main: '#FFFFFF' // White
    }
  }
});

export default DibsTheme;
