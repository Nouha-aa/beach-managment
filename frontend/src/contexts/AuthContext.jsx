import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMe, login as apiLogin } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// auth provider per l'autenticazione
export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getMe();
          setUser(userData);
          setLoggedIn(true);
        } catch (error) {
          console.error('Errore nel recupero dei dati utente:', error);
          handleLogout();
        }
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setUser({});
    navigate('/login');
  };

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Inizio login');
      const response = await apiLogin(email, password);
      console.log('AuthContext: Risposta login ricevuta', response);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setLoggedIn(true);
      if (response.user.isAdmin) {
        console.log('Reindirizzamento a /umbrellas');
        navigate('/umbrellas');
      } else {
        console.log('Reindirizzamento a /');
        navigate('/');
      }
    } catch (error) {
      console.error('AuthContext: Errore durante il login', error);
      throw error;
    }
  };

  // metodo per verificare se l'utente è admin
  const isAdmin = () => {
    return user && user.isAdmin === true;
  };

  return (
    <AuthContext.Provider value={{ loggedIn, user, login, handleLogout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);