import { useContext, useState, useEffect, createContext } from 'react';

const AuthContext = createContext({
  auth: null,
  setAuth: () => {},
  user: null
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const cuser = localStorage.getItem('user');
      cuser ? setAuth(true) : setAuth(false);
      cuser ? setUser(JSON.parse(cuser)) : setUser(null);
    };

    checkLoggedIn();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
