// layouts/ProviderLayout.tsx
import { ProviderSidebar } from "../components/provider/Sidebar";
import { ProviderHeader } from "../components/provider/Header";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";

export function ProviderLayout() {

    useEffect(() => {
        window.history.pushState(null, "", window.location.href);

        const handlePopState = () => {
            window.history.pushState(null, "", window.location.href);
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
        }, []);
  return (


    <div className="flex min-h-screen">

      {/* Sidebar */}
      <ProviderSidebar />

      {/* Right side */}
      <div className="ml-64 flex flex-col w-full">

        {/* Header */}
        <ProviderHeader />

        {/* Content */}
        <main className="p-6 flex-1 bg-gray-50">
          <Outlet />
        </main>

      </div>
    </div>
  );
}