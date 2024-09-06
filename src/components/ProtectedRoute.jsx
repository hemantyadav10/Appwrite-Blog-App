import React from 'react';
import { useUserContext } from '../context/UserContext';
import { Outlet, Navigate } from 'react-router-dom';

function ProtectedRoute() {
  const { isAuthenticated,  } = useUserContext();

  return (
    isAuthenticated ? <Outlet /> : <Navigate to='/login' />
  )
}

export default ProtectedRoute;
