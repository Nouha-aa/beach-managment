import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Funzione per gestire il routing protetto agli users e non admin
const ProtectedRoute = ({ element: Element, adminOnly = false, ...rest }) => {
  const { isAdmin } = useAuth();

  //console.log('ProtectedRoute props:', { Element, adminOnly, ...rest });

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" />;
  }

  return <Element {...rest} />;
};

export default ProtectedRoute;

