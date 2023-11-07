import TelegramLoginButton from 'react-telegram-login';
import { loginHandler } from '../services/AuthService';
import { useAuth } from '../services/AuthContext';

const Login = () => {
  const { setAuth } = useAuth();

  const localHandler = (response) => {
    loginHandler(response, setAuth);
  };

  return <TelegramLoginButton dataOnauth={localHandler} botName="DibsAppBot" />;
};

export default Login;
