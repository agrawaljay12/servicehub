import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserPlus,
  FaClipboardList,
  FaHistory,
  FaCheckCircle
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const PRIMARY_COLOR = "#0891b2";

export function ProviderSidebar() {
  const { theme } = useTheme();
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/provider/dashboard",
      icon: FaTachometerAlt
    },
    {
      name: "Register Service",
      path: "/provider/register-service",
      icon: FaUserPlus
    },
    {
      name: "Booking Requests",
      path: "/provider/requests",
      icon: FaClipboardList
    },
    {
      name: "Manage Bookings",
      path: "/provider/manage-bookings",
      icon: FaCheckCircle
    },
    {
      name: "Booking History",
      path: "/provider/history",
      icon: FaHistory
    }
  ];

  const isActive = (path: string) =>
    location.pathname.startsWith(path);

  return (
    <div
      className="h-screen w-64 fixed top-0 left-0 shadow-lg flex flex-col"
      style={{
        backgroundColor: theme === "dark" ? "#0a0a0a" : "#ffffff",
        borderRight: "1px solid rgba(0,0,0,0.1)"
      }}
    >
      {/* Logo */}
      <div className="p-4 flex items-center gap-2 border-b">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #14b8a6, #0891b2)"
          }}
        >
          <span className="text-white font-bold">P</span>
        </div>
        <span
          className="font-bold text-lg"
          style={{ color: PRIMARY_COLOR }}
        >
          Provider Panel
        </span>
      </div>

      {/* Menu */}
      <div className="flex-1 p-3 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                active
                  ? "text-white"
                  : theme === "dark"
                  ? "text-gray-300"
                  : "text-gray-700"
              }`}
              style={{
                background: active
                  ? "linear-gradient(135deg, #0891b2, #06b6d4)"
                  : "transparent"
              }}
            >
              <Icon size={16} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t text-sm text-center text-gray-400">
        © Provider Dashboard
      </div>
    </div>
  );
}