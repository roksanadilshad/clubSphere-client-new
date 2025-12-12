import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
 

const Sidebar = () => {

  const { userInfo } = useContext(AuthContext) || {};

  const isAdmin = userInfo?.role === "admin";

  const sidebarLinks = [
    {
      title: "Dashboard Home",
      path: "/dashboard",
    },
    {
      title: "My Clubs",
      path: "/dashboard/member/clubs",
    },
    {
      title: "Memberships",
      path: "/dashboard/member/myClubs",
    },
  ];

  const adminLinks = [
    {
      title: "Pending Approvals",
      path: "/dashboard/admin/approval",
    },
    {
      title: "Manage Users",
      path: "/dashboard/admin/users",
    },
    {
      title: "All Clubs",
      path: "/dashboard/admin/clubs",
    }
  ];

  return (
    <div className="w-64 h-screen bg-[#1c1f2e] text-white fixed left-0 top-0 shadow-xl">
      <div className="p-6">
        <h2 className="text-2xl font-bold">ClubSphere</h2>
      </div>

      <nav className="mt-4 px-4 flex flex-col gap-1">

        {/* Normal User Links */}
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg text-sm font-medium transition 
              ${isActive ? "bg-white text-black" : "text-gray-300 hover:bg-gray-700"}`
            }
          >
            {link.title}
          </NavLink>
        ))}

        {/* Admin Links */}
        {isAdmin && (
          <div className="mt-6">
            <h3 className="text-xs uppercase text-gray-400 mb-2">Admin Panel</h3>

            {adminLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg text-sm font-medium transition 
                  ${isActive ? "bg-white text-black" : "text-gray-300 hover:bg-gray-700"}`
                }
              >
                {link.title}
              </NavLink>
            ))}
          </div>
        )}

      </nav>
    </div>
  );
};

export default Sidebar;
