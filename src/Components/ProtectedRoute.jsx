import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Components/context/AuthProvider';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth(); // Get user from Auth context
  const data = user// Check if user is logged in and their role is allowed
  if (!data) {
    return <Navigate to="/" replace />; // Redirect to login if user is not authenticated
  } else if (!allowedRoles.includes(data?.role)) {
    return <Navigate to="/unauthorized" replace />; // Redirect if user role is not allowed
  }

  // If authenticated and role is allowed, render the child components (via Outlet)
  return <Outlet />;
};

export default ProtectedRoute;