import AuthProvider from './services/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './Routes'
import DibsTheme from './utils/ThemeProvider';
import { ThemeProvider } from '@mui/material/styles';

function App() {

  return (
    <ThemeProvider theme={DibsTheme}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
