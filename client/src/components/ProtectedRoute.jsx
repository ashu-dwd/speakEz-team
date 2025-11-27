import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute component that checks for authentication before rendering children
 * Redirects to /login if user is not authenticated (no token found)
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // If no token exists, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // If token exists, render the protected component
  return children;
};

export default ProtectedRoute;
