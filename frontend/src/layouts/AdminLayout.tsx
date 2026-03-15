import { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import AdminSidebar, { AdminMobileHeader } from "../pages/admin/AdminSidebar";
import { AdminDashboard } from "../pages/admin/AdminDashboard";

export const AdminLayout = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  // Authentication Check
  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    const adminUserData = localStorage.getItem('admin_user');

    if (!adminToken || !adminUserData) {
      navigate('/admin/auth');
      setIsAuthed(false);
      return;
    }

    setAdminUser(JSON.parse(adminUserData));
    setIsAuthed(true);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/auth');
  };

  // Theme Styles
  const containerBg = {
    backgroundColor: theme === 'dark' ? '#000000' : '#f5f7fa',
    color: theme === 'dark' ? '#ffffff' : '#000000'
  };

  // Don't render layout if not authenticated
  if (isAuthed === null) {
    return null;
  }

  if (!isAuthed) {
    return null;
  }

  return (
    <div style={containerBg} className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar - Desktop Only */}
      <div className="hidden md:block">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
          adminUser={adminUser}
        />
      </div>

      {/* Mobile Overlay for Sidebar */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 md:hidden z-30 bg-black bg-opacity-50"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar with Overlay */}
      <div className="md:hidden">
        {isMobileSidebarOpen && (
          <AdminSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
            adminUser={adminUser}
            isMobileOpen={isMobileSidebarOpen}
            onMobileClose={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <AdminMobileHeader
          onMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          theme={theme}
          adminUser={adminUser}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Routes>
            <Route path="/dashboard" element={<AdminDashboard activeTab={activeTab} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
