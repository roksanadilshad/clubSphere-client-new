import { useState, useContext } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router";

import {
  FaBars,
  FaTimes,
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaChartBar,
  FaSignOutAlt,
  FaBuilding,
  FaDollarSign,
  FaUserCircle,
  FaCreditCard,
} from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";
import Logo from "../Components/LOgo";


const DashboardLayout = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get user role from context or user object
  const userRole = user?.role || "member"; // Default to member

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        navigate("/");
      })
      .catch();
  };

  // Role-based navigation menus
  const adminMenu = [
    { path: "/dashboard/admin", icon: <FaHome />, label: "Overview" },
    { path: "/dashboard/admin/users", icon: <FaUsers />, label: "Manage Users" },
    { path: "/dashboard/admin/clubs", icon: <FaBuilding />, label: "Manage Clubs" },
    { path: "/dashboard/admin/payments", icon: <FaDollarSign />, label: "Payments" },
    { path: "/dashboard/profile", icon: <FaUserCircle />, label: "Profile" },
  ];

  const managerMenu = [
    { path: "/dashboard/manager", icon: <FaHome />, label: "Overview" },
    { path: "/dashboard/manager/clubs", icon: <FaBuilding />, label: "My Clubs" },
    { path: "/dashboard/manager/events", icon: <FaCalendarAlt />, label: "Events" },
    { path: "/dashboard/profile", icon: <FaUserCircle />, label: "Profile" },
  ];

  const memberMenu = [
    { path: "/dashboard/member", icon: <FaHome />, label: "Overview" },
    { path: "/dashboard/member/clubs", icon: <FaBuilding />, label: "My Clubs" },
    { path: "/dashboard/member/events", icon: <FaCalendarAlt />, label: "My Events" },
    { path: "/dashboard/member/payments", icon: <FaCreditCard />, label: "Payment History" },
    { path: "/dashboard/profile", icon: <FaUserCircle />, label: "Profile" },
  ];

  // Select menu based on role
  const getMenuItems = () => {
    switch (userRole) {
      case "admin":
        return adminMenu;
      case "clubManager":
        return managerMenu;
      default:
        return memberMenu;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? (
              <FaTimes className="text-xl text-gray-600" />
            ) : (
              <FaBars className="text-xl text-gray-600" />
            )}
          </button>

          {/* Logo */}
          <div className="lg:hidden">
            <Logo></Logo>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-900">
                {user?.displayName || "User"}
              </p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
            <img
              src={
                user?.photoURL ||
                "https://images.unsplash.com/photo-1747592771443-e15f155b1faf?w=100&h=100&fit=crop"
              }
              alt="User"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200">
            <Logo />
            <p className="text-xs text-gray-500 mt-2 capitalize">
              {userRole} Dashboard
            </p>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={index}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <FaSignOutAlt className="text-lg" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
