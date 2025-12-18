import React, { useContext, useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../Context/AuthContext";

import { FaBars, FaTimes, FaUser, FaChevronDown,  FaUsers, FaSignOutAlt } from "react-icons/fa";
import { CgLayoutPin } from "react-icons/cg";
import { motion, AnimatePresence } from "framer-motion";
import { LucideLayoutDashboard } from "lucide-react";

import AnimLogo from "./AnimLogo";
import useRole from "../hooks/useRole";

const Header = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const {role} = useRole();

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignout = () => {
    signOutUser().then(() => setProfileDropdownOpen(false));
  };

  const navLinks = [
  { to: "/", label: "Home" },
  { to: "/clubs", label: "Clubs" },
  { to: "/events", label: "Events" },
  // Conditionally spread links based on role
  ...(role === "member" 
    ? [
        { to: "/manager", label: "Be a manager" },
        { to: "/dashboard", label: "Dashboard" }
      ]
    : role === "clubManager" ? [
        { to: "/dashboard/manager/create-club", label: "Create Club" },
        { to: "/dashboard", label: "Dashboard" }
      ] : role === "admin" ? [
        { to: "/dashboard/admin/status", label: "Manage Status" },
        { to: "/dashboard", label: "Dashboard" }
      ] : [
        { to: "/about", label: "About us" },
        { to: "/contact", label: "Contact us" }
      ]
  )
];

  return (
    <header 
      className={`sticky top-0 z-100 transition-all duration-300 ${
        scrolled 
        ? "bg-white/80 backdrop-blur-md shadow-lg py-2" 
        : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 scale-110">
          <AnimLogo/>
          </div>

          {/* Desktop Navigation - Animated Underline */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-bold tracking-tight transition-all duration-300 ${
                    isActive ? "text-primary" : "text-gray-600 hover:text-primary"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.div 
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full mx-4"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center gap-6">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-3 p-1 pr-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all border border-transparent hover:border-primary/20"
                >
                  <img
                    src={user?.photoURL || "https://ui-avatars.com/api/?name=" + user.displayName}
                    alt="User"
                    className="w-9 h-9 rounded-full object-cover shadow-sm ring-2 ring-white"
                  />
                  <FaChevronDown className={`text-gray-500 text-[10px] transition-transform duration-300 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Desktop Dropdown */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <>
                      <div className="fixed inset-0" onClick={() => setProfileDropdownOpen(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 overflow-hidden"
                      >
                        <div className="px-5 py-4 bg-gray-50/50 mb-2">
                          <p className="text-sm font-black text-gray-900 leading-none">{user.displayName || "Member"}</p>
                          <p className="text-xs text-gray-500 mt-1 truncate">{user.email}</p>
                        </div>
                        
                        <DropdownItem to="/profile" icon={<FaUser />} label="My Profile" onClick={() => setProfileDropdownOpen(false)} />
                        <DropdownItem to="/dashboard" icon={<LucideLayoutDashboard />} label="Dashboard" onClick={() => setProfileDropdownOpen(false)} />
                        <DropdownItem to="/dashboard/member/clubs" icon={<CgLayoutPin/>} label="My Clubs" onClick={() => setProfileDropdownOpen(false)} />
                        
                        <div className="mt-2 pt-2 border-t border-gray-100 px-2">
                          <button
                            onClick={handleSignout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-bold"
                          >
                            <FaSignOutAlt /> Log Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-5 py-2 text-sm font-bold text-gray-700 hover:text-primary transition-colors">
                  Log In
                </Link>
                <Link to="/register" className="px-6 py-2.5 text-sm font-bold text-white bg-primary rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:translate-y-0">
                  Join Community
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-gray-100 text-gray-900 transition-all active:scale-90"
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overhaul */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black text-gray-900">
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              <div className="pt-6 border-t border-gray-100">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img src={user?.photoURL} className="w-12 h-12 rounded-full border-2 border-primary" alt="User" />
                      <div>
                        <p className="font-bold text-gray-900">{user.displayName}</p>
                        <button onClick={handleSignout} className="text-sm text-red-500 font-bold">Logout Account</button>
                      </div>
                    </div>
                    <div>
                      <DropdownItem to="/profile" icon={<FaUser />} label="My Profile" onClick={() => setProfileDropdownOpen(false)} />
                        <DropdownItem to="/dashboard" icon={<LucideLayoutDashboard />} label="Dashboard" onClick={() => setProfileDropdownOpen(false)} />
                        <DropdownItem to="/dashboard/member/clubs" icon={<CgLayoutPin/>} label="My Clubs" onClick={() => setProfileDropdownOpen(false)} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline border-gray-300 rounded-xl">Login</Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary rounded-xl">Register</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const DropdownItem = ({ to, icon, label, onClick }) => (
  <NavLink 
    to={to} 
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-primary hover:bg-primary/5 mx-2 rounded-xl transition-all font-semibold"
  >
    <span className="text-gray-400">{icon}</span>
    {label}
  </NavLink>
);

export default Header;