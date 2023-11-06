import { UserProvider } from './components/UserContext';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './Routes'

function App() {

  return (
    <BrowserRouter>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
