import React from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import useRole from '../hooks/useRole';
import { 
  CalendarClock, ChartNetwork, CircleDollarSign, Home, 
  LayoutDashboard, Pickaxe, Puzzle, Shovel, Sidebar, 
  UserCog, UserRoundPen, Users, ChevronRight, 
  ToolCase,
  Scissors
} from 'lucide-react';
import { Tooltip } from 'recharts';
import AnimLogo from '../Components/AnimLogo';

const DashboardLayout = () => {
    const { role } = useRole();
    const location = useLocation();

    // Utility to get a readable title based on path
    const getPathTitle = () => {
        const path = location.pathname.split('/').pop();
        return path.charAt(0).toUpperCase() + path.slice(1) || 'Overview';
    };

    return (
        <div className="drawer lg:drawer-open bg-slate-50 min-h-screen">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            
            <div className="drawer-content flex flex-col">
                {/* Modern Navbar */}
                <nav className="navbar sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6">
                    <div className="flex-none lg:hidden">
                        <label htmlFor="my-drawer-4" className="btn btn-square btn-ghost">
                            <Sidebar className="w-5 h-5" />
                        </label>
                    </div>
                    
                    <div className="flex-1 flex items-center gap-3 ml-2 lg:ml-0">
                        <span className="text-slate-300 lg:hidden md:block"><AnimLogo/></span>
                        <ChevronRight className="w-4 h-4 text-slate-300 hidden md:block" />
                        <h2 className="font-bold text-slate-800 tracking-tight">
                            {getPathTitle()}
                        </h2>
                    </div>

                    <div className="flex-none gap-2">
                        {/* Profile/Notifications would go here */}
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200"></div>
                    </div>
                </nav>

                {/* Main Content Area */}
                <main className="p-4 md:p-8 animate-in fade-in duration-500">
                    <Outlet />
                </main>
            </div>

            {/* Optimized Sidebar */}
            <div className="drawer-side z-50">
                <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
                <aside className="w-72 min-h-full bg-white border-r border-slate-100 flex flex-col">
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-slate-50 mb-4">
                        <div className="flex items-center gap-3">
                            <AnimLogo className="scale-125" />
                            
                        </div>
                    </div>

                    <ul className="menu px-4 gap-2 text-slate-600 font-medium overflow-y-auto">
                        <SidebarLink to="/" icon={<Home size={20}/>} label="Public Home" />
                        
                        <div className="divider text-[10px] uppercase font-black tracking-widest text-slate-300 my-2">Dashboard</div>

                        {/* Dynamic Role-Based Overview */}
                        <SidebarLink 
                            to={role === 'admin' ? '/dashboard/admin' : role === 'clubManager' ? '/dashboard/manager' : '/dashboard/member'} 
                            icon={<LayoutDashboard size={20}/>} 
                            label={`${role === 'admin' ? 'Admin' : role === 'clubManager' ? 'Manager' : 'My'} Overview`} 
                        />

                        {/* Shared Member Links */}
                        <SidebarLink to="/dashboard/member/clubs" icon={<Users size={20}/>} label="My Clubs" />
                        <SidebarLink to="/dashboard/member/events" icon={<CalendarClock size={20}/>} label="My Events" />
                        
                        {/* Conditional Payment Links */}
                        <SidebarLink 
                            to={role === 'admin' ? '/dashboard/admin/payments' : role === 'clubManager' ? '/dashboard/manager/payments' : '/dashboard/member/payments'} 
                            icon={<CircleDollarSign size={20}/>} 
                            label="Payment History" 
                        />

                        {/* Admin Specific Links */}
                        {role === 'admin' && (
                            <>
                                <div className="divider text-[10px] uppercase font-black tracking-widest text-slate-300 my-2">Management</div>
                                <SidebarLink to="/dashboard/admin/clubs" icon={<Puzzle size={20}/>} label="Manage Clubs" />
                                <SidebarLink to="/dashboard/admin/status" icon={<ChartNetwork size={20}/>} label="Manage Status" />
                                <SidebarLink to="/dashboard/admin/users" icon={<UserRoundPen size={20}/>} label="Manage Users" />
                            </>
                        )}

                        {/* Manager Specific Links */}
                        {role === 'clubManager' && (
                            <>
                                <div className="divider text-[10px] uppercase font-black tracking-widest text-slate-300 my-2">Club Tools</div>
                                <SidebarLink to="/dashboard/manager/members" icon={<Puzzle size={20}/>} label="Manage Members" />
                                <SidebarLink to="/dashboard/manager/clubs" icon={<Scissors size={20}/>} label="Manage Clubs" />
                                <SidebarLink to="/dashboard/manager/events" icon={<ChartNetwork size={20}/>} label="Manage Events" />
                                <SidebarLink to="/dashboard/manager/create-club" icon={<Pickaxe size={20}/>} label="Create Club" />
                                <SidebarLink to="/dashboard/manager/events" icon={<ToolCase size={20}/>} label="Create Event" />
                            </>
                        )}
                    </ul>

                    {/* Footer / Profile Settings */}
                    <div className="mt-auto p-4 border-t border-slate-50">
                        <SidebarLink to="/profile" icon={<UserCog size={20}/>} label="Profile Settings" />
                    </div>
                </aside>
            </div>
        </div>
    );
};

// Reusable Sub-component for clean code
const SidebarLink = ({ to, icon, label }) => (
    <li>
        <NavLink 
            to={to} 
            end
            className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                    : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'}
            `}
        >
            {icon}
            <span className="flex-1">{label}</span>
        </NavLink>
    </li>
);

export default DashboardLayout;