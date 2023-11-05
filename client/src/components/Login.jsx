import TelegramLoginButton from 'react-telegram-login';
import { loginHandler } from '../services/AuthService';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  
  const localHandler = (response) => {
    loginHandler(response, navigate);
  };

  return (
    <TelegramLoginButton dataOnauth={localHandler} botName="DibsAppBot" />
  );
};

export default Login;