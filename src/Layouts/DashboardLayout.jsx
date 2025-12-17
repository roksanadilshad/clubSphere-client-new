import React from 'react';
import { CiDeliveryTruck } from 'react-icons/ci';
import { FaMotorcycle, FaRegCreditCard, FaUsers } from 'react-icons/fa';
import { Link, NavLink, Outlet } from 'react-router';
import useRole from '../hooks/useRole';
import { RiDashboard2Fill, RiEBikeFill } from 'react-icons/ri';
import Logo from '../Components/LOgo';
import { CalendarClock, ChartNetwork, CircleDollarSign, Home, LayoutDashboard, Pickaxe, Puzzle, Shovel, Sidebar, UserCog, UserRoundPen, Users } from 'lucide-react';

const DashboardLayout = () => {
    const { role } = useRole();
    return (
        <div className="drawer lg:drawer-open max-w-7xl mx-auto ">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Navbar */}
         <nav className="navbar z-50 w-full top-0  sticky bg-white">
        <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
            {/* Sidebar toggle icon */}
            <Sidebar></Sidebar>
        </label>
                    <div className="px-4  font-bold "><Logo/> Dashboard</div>
        </nav>
                {/* Page content here */}
         <Outlet></Outlet>

            </div>

            <div className="drawer-side pt-20 is-drawer-close:overflow-visible">
  <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
  <div className="flex min-h-full flex-col items-start bg-white is-drawer-close:w-14 is-drawer-open:w-64">
      {/* Sidebar content here */}
      <ul className="menu w-full grow">
          {/* List item */}
          <li>
              <Link to="/" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Homepage">
                  {/* Home icon */}
                  <Home></Home>
                  <span className="is-drawer-close:hidden">Homepage</span>
              </Link>
          </li>

              {/* our dashboard links */}
  <li>
    {
      role === 'admin'? (
 <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="OverView" to="/dashboard/admin">
          <LayoutDashboard />
          <span className="is-drawer-close:hidden">Admin Dashboard</span>
      </NavLink>
      ) : role === "clubManager" ? (
         <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="OverView" to="/dashboard/manager">
          <LayoutDashboard />
          <span className="is-drawer-close:hidden">Manager Dashboard</span>
      </NavLink>
      ):(
 <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="OverView" to="/dashboard/member">
          <LayoutDashboard />
          <span className="is-drawer-close:hidden">My Dashboard</span>
      </NavLink>
      )
    }
     
      <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="My clubs" to="/dashboard/member/clubs">
          <Users />
          <span className="is-drawer-close:hidden">My Clubs</span>
      </NavLink>
     
      <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="My events" to="/dashboard/member/events">
          <CalendarClock />
          <span className="is-drawer-close:hidden">My Events</span>
      </NavLink>
  </li>
  {/* clubs */}
  <li>
     {
      role === "admin" ? (
         <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="View Payment History" to="/dashboard/admin/payments">
         <CircleDollarSign />
          <span className="is-drawer-close:hidden"> View Payment History</span>
      </NavLink>
      ) : role === "clubManager" ? (
        <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Payment History" to="/dashboard/manager/payments">
         <CircleDollarSign />
          <span className="is-drawer-close:hidden">Payment History</span>
      </NavLink>
      ):(
         <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Payment History" to="/dashboard/member/payments">
         <CircleDollarSign />
          <span className="is-drawer-close:hidden">Payment History</span>
      </NavLink>
      )
     }
      
  </li>
  {
      role === 'admin' && <>
          <li>
              <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Manage clubs" to="/dashboard/admin/clubs">
                  <Puzzle />
                  <span className="is-drawer-close:hidden">Manage Clubs</span>
              </NavLink>
          </li>
          <li>
              <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Manage Status" to="/dashboard/admin/status">
                  <ChartNetwork />
                  <span className="is-drawer-close:hidden">Manage Status</span>
              </NavLink>
          </li>
          <li>
              <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Manage Users" to="/dashboard/admin/users">
                  <UserRoundPen />
                  <span className="is-drawer-close:hidden">Manage Users</span>
              </NavLink>
          </li>
      </>
  }
  {
      role === 'clubManager' && <>
          <li>
              <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Manage Members" to="/dashboard/manager/members">
                  <Puzzle />
                  <span className="is-drawer-close:hidden">Manage Members</span>
              </NavLink>
          </li>
          <li>
              <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Manage Events" to="/dashboard/manager/events">
                  <ChartNetwork />
                  <span className="is-drawer-close:hidden">Manage Events</span>
              </NavLink>
          </li>
          <li>
              <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Manage Events" to="/dashboard/manager/clubs">
                  <Shovel />
                  <span className="is-drawer-close:hidden">Manage Clubs</span>
              </NavLink>
          </li>
          <li>
              <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Manage Users" to="/create-club">
                 <Pickaxe />
                  <span className="is-drawer-close:hidden">Create Clubs</span>
              </NavLink>
          </li>
          <li>
              <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Manage Users" to="/dashboard/manager/events/create">
                  <UserRoundPen />
                  <span className="is-drawer-close:hidden">Create Events</span>
              </NavLink>
          </li>
      </>
  }

        {/* List item */}
        <li>
            <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Profile Settings" to='/profile' >
                {/* Settings icon */}
                 <UserCog />
                <span className="is-drawer-close:hidden">Profile Settings</span>
            </NavLink>
             

        </li>
              </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;