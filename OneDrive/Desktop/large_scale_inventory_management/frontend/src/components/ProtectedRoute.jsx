import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner large"></div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // If the user's role doesn't match the required role, bounce them to their correct dashboard
    return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/staff/dashboard'} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
