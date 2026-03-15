import { } from "react";
import { Navigate } from "react-router-dom";

interface ProviderProtectedRouteProps {
  children?: React.ReactNode;
}

export function ProviderProtectedRoute({ children }: ProviderProtectedRouteProps) {
  const providerToken = localStorage.getItem('provider_token');

  if (!providerToken) {
    return <Navigate to="/provider/auth" replace />;
  }

  return <>{children}</>;
}

export default ProviderProtectedRoute;
