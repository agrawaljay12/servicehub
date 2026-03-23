import { } from "react";
import { Navigate } from "react-router-dom";
import {ProviderSidebar} from "../../components/provider/Sidebar"
import { ProviderHeader } from "../../components/provider/Header";

interface ProviderProtectedRouteProps {
  children?: React.ReactNode;
}

export function ProviderProtectedRoute({ children }: ProviderProtectedRouteProps) {
  const providerToken = localStorage.getItem('access_token');

  if (!providerToken) {
    return <Navigate to="/provider/auth" replace />;
  }

 
  return (
    <div className="flex">
      <ProviderSidebar />

      <div className="ml-64 w-full">
        <ProviderHeader />

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );

}
