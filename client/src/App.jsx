import AuthProvider from './services/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './Routes'

function App() {

  return (
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
  );
}

export default App;
