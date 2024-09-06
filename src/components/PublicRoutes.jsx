import React from 'react'
import { useUserContext } from '../context/UserContext'
import { Navigate, Outlet } from 'react-router-dom';

function PublicRoutes() {
  const { isAuthenticated } = useUserContext();

  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />;
}

export default PublicRoutes
