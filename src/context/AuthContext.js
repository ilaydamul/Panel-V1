import { createContext, useState, useContext } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authenticate = (token) => {
    if (token) {
      setIsAuthenticated(true);
      Cookies.set("token", token, { expires: 1 }); // Token'ı cookie'e kaydediyoruz
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    Cookies.remove("token"); // Token'ı siliyoruz
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(AuthContext);
};
