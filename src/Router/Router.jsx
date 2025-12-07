import React from 'react';
import { createBrowserRouter } from 'react-router';
import Root from '../Layouts/root';
import Home from '../Pages/Home/Home';
import Registration from '../Pages/Register';
import Login from '../Pages/Login';
import ErrorPage from '../Pages/ErrorPage';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import DashboardLayout from '../Layouts/DashboardLayout';
import MemberOverview from '../Pages/Dashboard/Member/MemberOverview';
import MyClubs from '../Pages/Dashboard/Member/MyClubs';
import ManagerOverview from '../Pages/Dashboard/Manager/ManagerOverview';
import ManageClubs from '../Pages/Dashboard/Admin/ManageClubs';
import ManageMembers from '../Pages/Dashboard/Manager/ManageMembers';
import ManageEvents from '../Pages/Dashboard/Manager/ManageEvents';
import MyEvents from '../Pages/Dashboard/Member/MyEvents';
import PaymentHistory from '../Pages/Dashboard/Member/PaymentHistory';
import EditClub from '../Pages/Dashboard/Manager/EditClub';
import Profile from '../Pages/Dashboard/Profile';

export const router = createBrowserRouter([
  {
    path: "/",
    element:<Root></Root>,
    errorElement:<ErrorPage></ErrorPage>,
    children: [
        {
            index: true,
            path:'/',
            element:<Home></Home>,
        },
        {
          path:'/register',
          element:<Registration></Registration>
        },
        {
          path:'/login' ,
         element:<Login></Login>
        },
        {
  path: '/dashboard',
  element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
  children: [
    {
      index: true,
      element: <PrivateRoute><MemberOverview /></PrivateRoute>
    },
    {
      path: 'member',
      element: <PrivateRoute><MemberOverview /></PrivateRoute>
    },
    {
      path: 'member/clubs',
      element: <PrivateRoute><MyClubs /></PrivateRoute>
    },
    {
      path: 'member/events',
      element: <PrivateRoute><MyEvents></MyEvents></PrivateRoute>
    },
    {
      path: 'member/payments',
      element: <PrivateRoute><PaymentHistory></PaymentHistory></PrivateRoute>
    },
    {
      path: 'member/clubs',
      element: <PrivateRoute><MyClubs /></PrivateRoute>
    },

    {
      path: 'manager/clubs',
      element: <PrivateRoute><ManageClubs></ManageClubs></PrivateRoute>
    },
    {
      path: 'manager/members',
      element: <PrivateRoute><ManageMembers></ManageMembers></PrivateRoute>
    },
    {
      path: 'manager/events',
      element: <PrivateRoute><ManageEvents></ManageEvents></PrivateRoute>
    },
    {
      path: 'manager',
      element: <PrivateRoute><ManagerOverview /></PrivateRoute>
    },
    {
      path: 'manager/editClub',
      element: <PrivateRoute><EditClub></EditClub></PrivateRoute>
    },
    {
      path: 'admin',
      element: <PrivateRoute><MyClubs /></PrivateRoute>
    },
    {
      path: 'admin/users',
      element: <PrivateRoute><MyClubs /></PrivateRoute>
    },
    {
      path: 'admin/clubs',
      element: <PrivateRoute><MyClubs /></PrivateRoute>
    },
    {
      path: 'admin/payments',
      element: <PrivateRoute><MyClubs /></PrivateRoute>
    },
    {
      path: 'profile',
      element: <PrivateRoute><Profile></Profile></PrivateRoute>
    },
  ]
}
       
    ]
  },
]);
