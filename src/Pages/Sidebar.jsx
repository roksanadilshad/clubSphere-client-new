import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const Sidebar = () => {
  const { userInfo } = useContext(AuthContext) || {};
  const role = userInfo?.role;

  const memberLinks = [
    { title: "Dashboard Home", path: "/dashboard" },
    { title: "My Clubs", path: "/dashboard/member/clubs" },
    { title: "My Memberships", path: "/dashboard/member/myClubs" },
    { title: "My Events", path: "/dashboard/member/events" },
  ];

  const managerLinks = [
    { title: "Manager Overview", path: "/dashboard/manager" },
    { title: "My Clubs", path: "/dashboard/manager/clubs" },
    { title: "Create Event", path: "/dashboard/manager/create-event" },
    { title: "Manage Events", path: "/dashboard/manager/events" },
    { title: "Event Registrations", path: "/dashboard/manager/registrations" },
  ];

  const adminLinks = [
    { title: "Admin Overview", path: "/dashboard/admin" },
    { title: "Pending Approvals", path: "/dashboard/admin/approval" },
    { title: "Manage Users", path: "/dashboard/admin/users" },
    { title: "All Clubs", path: "/dashboard/admin/clubs" },
  ];

  const renderLinks = (links) =>
    links.map((link) => (
      <NavLink
        key={link.path}
        to={link.path}
        className={({ isActive }) =>
          `block px-4 py-2 rounded-lg text-sm font-medium transition
          ${
            isActive
              ? "bg-white text-black"
              : "text-gray-300 hover:bg-gray-700"
          }`
        }
      >
        {link.title}
      </NavLink>
    ));

  return (
    <div className="w-64 -z-10 h-screen bg-[#1c1f2e] text-white fixed left-0 top-10 shadow-xl">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold">ClubSphere</h2>
        <p className="text-xs text-gray-400 capitalize">
          {role || "member"} dashboard
        </p>
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-4 flex flex-col gap-1">

        {/* MEMBER */}
        {role === "member" && (
          <>
            <h3 className="text-xs uppercase text-gray-400 mt-4 mb-2">
              Member
            </h3>
            {renderLinks(memberLinks)}
          </>
        )}

        {/* MANAGER */}
        {role === "manager" && (
          <>
            <h3 className="text-xs uppercase text-gray-400 mt-4 mb-2">
              Manager
            </h3>
            {renderLinks(managerLinks)}
          </>
        )}

        {/* ADMIN */}
        {role === "admin" && (
          <>
            <h3 className="text-xs uppercase text-gray-400 mt-4 mb-2">
              Admin Panel
            </h3>
            {renderLinks(adminLinks)}
          </>
        )}

      </nav>
    </div>
  );
};

export default Sidebar;
