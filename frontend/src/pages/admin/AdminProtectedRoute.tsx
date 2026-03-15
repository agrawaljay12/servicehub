import { Navigate } from 'react-router-dom';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * AdminProtectedRoute component
 * Protects admin routes by checking for admin token
 * Only allows access if user is authenticated as admin
 */
export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const adminToken = localStorage.getItem('admin_token');

  if (!adminToken) {
    return <Navigate to="/admin/auth" replace />;
  }

  return <>{children}</>;
}
