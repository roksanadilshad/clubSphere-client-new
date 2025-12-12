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
import AdminOverview from '../Pages/Dashboard/Admin/AdminOverview';
import Clubs from '../Pages/Clubs/Clubs';
import ClubDetails from '../Pages/Clubs/ClubDetails';
import ViewPayments from '../Pages/Dashboard/Admin/ViewPaments';
import EventRegistrations from '../Pages/Dashboard/Manager/EventRegistrations';
import ManageUsers from '../Pages/Dashboard/Admin/ManageUsers';
import Unauthorized from '../Pages/Unauthorized';
import CreateClub from '../Pages/CreateAClub';
import ManageMyClubs from '../Pages/Dashboard/Manager/MyClubs';

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
          path:'/clubs' ,
         element:<Clubs></Clubs>
        },
        {
          path:'/clubDetail/:id' ,
         element:<ClubDetails></ClubDetails>
        },
        {
          path:'/create-club' ,
         element:<CreateClub></CreateClub>
        },
        {
  path: '/dashboard',
  element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
  errorElement: <ErrorPage></ErrorPage>,
  children: [
    {
      path: "member",
      element: <PrivateRoute allowedRoles={["member"]}><MemberOverview /></PrivateRoute>
    },
    {
      path: 'member/clubs',
      element: <PrivateRoute allowedRoles={["member"]}><MyClubs /></PrivateRoute>
    },
    {
      path: 'member/events',
      element: <PrivateRoute allowedRoles={["member"]}><MyEvents></MyEvents></PrivateRoute>
    },
    {
      path: 'member/payments',
      element: <PrivateRoute allowedRoles={["member"]}><PaymentHistory></PaymentHistory></PrivateRoute>
    },



    
    {
      path: 'manager/clubs',
      element: <PrivateRoute allowedRoles={["clubManager"]}><ManageMyClubs></ManageMyClubs></PrivateRoute>
    },
    {
      path: 'manager/members',
      element: <PrivateRoute allowedRoles={["clubManager"]}><ManageMembers></ManageMembers></PrivateRoute>
    },
    {
      path: 'manager/events',
      element: <PrivateRoute allowedRoles={["clubManager"]}><ManageEvents></ManageEvents></PrivateRoute>
    },
    {
      path: 'manager/editClub/:clubId',
      element: <PrivateRoute allowedRoles={["clubManager"]}><EditClub/></PrivateRoute>
    },
    {
      path: 'manager/eventRegistrations',
      element: <PrivateRoute allowedRoles={["clubManager"]}><EventRegistrations></EventRegistrations></PrivateRoute>
    },
    {
      path: 'manager',
      // index: true,
      element: <PrivateRoute allowedRoles={["clubManager"]}><ManagerOverview /></PrivateRoute>
    },



    
    {
      path: 'admin',
      // index: true,
      element: <PrivateRoute allowedRoles={["admin"]}><AdminOverview></AdminOverview></PrivateRoute>
    },
    {
      path: 'admin/users',
      element: <PrivateRoute allowedRoles={["admin"]}><ManageUsers/></PrivateRoute>
    },
    {
      path: 'admin/clubs',
      element: <PrivateRoute allowedRoles={["admin"]}><ManageClubs></ManageClubs></PrivateRoute>
    },
    {
      path: 'admin/payments',
      element: <PrivateRoute allowedRoles={["admin"]}><ViewPayments/></PrivateRoute>
    },
    {
      path: 'profile',
      element: <PrivateRoute><Profile></Profile></PrivateRoute>
    },
    
  ]
},
  {
      path: 'profile',
      element: <PrivateRoute><Profile></Profile></PrivateRoute>
    }, 
    {
      path: '/unauthorized',
      element: <Unauthorized></Unauthorized>
    }, 
    ]
  },
]);
