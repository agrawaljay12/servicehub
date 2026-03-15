import { FaHome, FaBox, FaChartBar, FaUsers, FaCog, FaSignOutAlt, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  adminUser?: any;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const PRIMARY_COLOR = '#0891b2';

export function AdminSidebar({ 
  activeTab, 
  onTabChange, 
  onLogout, 
  adminUser,
  isMobileOpen = false,
  onMobileClose
}: AdminSidebarProps) {
  const { theme } = useTheme();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome, color: '#3b82f6' },
    { id: 'services', label: 'Services', icon: FaBox, color: '#10b981' },
    { id: 'analytics', label: 'Analytics', icon: FaChartBar, color: '#f59e0b' },
    { id: 'users', label: 'Users', icon: FaUsers, color: '#8b5cf6' },
    { id: 'settings', label: 'Settings', icon: FaCog, color: '#6366f1' },
  ];

  const sidebarStyle = {
    backgroundColor: theme === 'dark' ? '#0a0a0a' : '#f8fafc',
    borderRight: `1px solid ${theme === 'dark' ? '#222222' : '#e2e8f0'}`,
    color: theme === 'dark' ? '#ffffff' : '#000000'
  };

  const itemStyle = (id: string) => ({
    backgroundColor: activeTab === id 
      ? (theme === 'dark' ? 'rgba(8, 145, 178, 0.2)' : 'rgba(8, 145, 178, 0.1)')
      : 'transparent',
    color: activeTab === id ? PRIMARY_COLOR : (theme === 'dark' ? '#a0aec0' : '#64748b'),
    borderLeft: activeTab === id ? `4px solid ${PRIMARY_COLOR}` : '4px solid transparent'
  });

  const handleItemClick = (id: string) => {
    onTabChange(id);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <div
      style={sidebarStyle}
      className={`fixed md:sticky inset-y-0 md:inset-auto left-0 md:left-auto md:top-0 z-40 w-64 flex flex-col transition-transform duration-300 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-6 border-b" style={{ borderColor: theme === 'dark' ? '#222222' : '#e2e8f0' }}>
        <h2 className="text-xl font-bold flex items-center gap-3" style={{ fontFamily: 'var(--font-outfit)' }}>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white"
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            SL
          </div>
          <span>Admin</span>
        </h2>
        {adminUser && (
          <p style={{ fontFamily: 'var(--font-worksans)', fontSize: '12px', opacity: 0.6, marginTop: '0.5rem' }}>
            {adminUser.id}
          </p>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              style={itemStyle(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:pl-5 font-medium group"
            >
              <Icon
                size={18}
                style={{ color: activeTab === item.id ? item.color : 'inherit' }}
              />
              <span style={{ fontFamily: 'var(--font-worksans)' }}>{item.label}</span>
              {activeTab === item.id && (
                <div
                  className="ml-auto w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t space-y-2" style={{ borderColor: theme === 'dark' ? '#222222' : '#e2e8f0' }}>
        <Link
          to="/"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-opacity-10"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.1)',
            fontFamily: 'var(--font-worksans)',
            color: theme === 'dark' ? '#94a3b8' : '#64748b'
          }}
          title="Go to home"
        >
          <FaHome size={16} />
          <span style={{ fontSize: '14px' }}>Home</span>
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-opacity-20 font-medium"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            fontFamily: 'var(--font-worksans)'
          }}
          title="Logout"
        >
          <FaSignOutAlt size={16} />
          <span style={{ fontSize: '14px' }}>Logout</span>
        </button>
      </div>
    </div>
  );
}

interface MobileHeaderProps {
  onMenuToggle: () => void;
  theme: string;
  adminUser?: any;
}

export function AdminMobileHeader({ onMenuToggle, theme, adminUser }: MobileHeaderProps) {
  return (
    <div
      className="md:hidden sticky top-0 z-30 px-4 py-4 flex items-center justify-between border-b"
      style={{
        backgroundColor: theme === 'dark' ? '#0a0a0a' : '#f8fafc',
        borderColor: theme === 'dark' ? '#222222' : '#e2e8f0',
        color: theme === 'dark' ? '#ffffff' : '#000000'
      }}
    >
      <div>
        <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: '18px', fontWeight: 'bold' }}>
          Admin Panel
        </h1>
        {adminUser && (
          <p style={{ fontFamily: 'var(--font-worksans)', fontSize: '12px', opacity: 0.6 }}>
            {adminUser.id}
          </p>
        )}
      </div>
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-lg transition-all"
        style={{
          backgroundColor: theme === 'dark' ? '#222222' : '#e2e8f0',
          color: PRIMARY_COLOR
        }}
      >
        <FaBars size={20} />
      </button>
    </div>
  );
}

export default AdminSidebar;
