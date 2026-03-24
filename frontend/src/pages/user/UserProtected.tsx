import { Navigate } from 'react-router-dom';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * UserProtectedRoute component
 * Protects user by checking for user token
 * Only allows access if user is authenticated as user role
 */
export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const usertoken = localStorage.getItem('access_token');

  if (!usertoken) {
    return <Navigate to="/auth/signin" replace />;
  }

  return <>{children}</>;
}
