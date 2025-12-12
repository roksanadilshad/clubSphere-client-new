import { Outlet } from "react-router-dom";
import Sidebar from "../Pages/Sidebar";


const DashboardLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 w-full bg-gray-50 min-h-screen p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
