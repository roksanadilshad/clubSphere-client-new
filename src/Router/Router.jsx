import React from 'react';
import { createBrowserRouter } from 'react-router';
import Root from '../Layouts/Root';
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

import ManageMyClubs from '../Pages/Dashboard/Manager/MyClubs';
import CreateEvent from '../Pages/Dashboard/Manager/CreateEvent';
import EditEvent from '../Pages/Dashboard/Manager/EditEvent';
import EventDetails from '../Pages/events/EventDetails';
import MembershipPayment from '../Pages/Dashboard/Payment/MembershipPayment';
import EventPayment from '../Pages/Dashboard/Payment/EventPayment';
import PaymentHistoryD from '../Pages/Dashboard/Payment/PaymentHistory';
import ApplyManager from '../Pages/Manager';
import ManagerStatus from '../Pages/Dashboard/Admin/ManagerStatus';
import AdminRoute from '../PrivateRoute/AdminRoute';
import ManagerRoute from '../PrivateRoute/ManagerRoute';
import CreateClub from '../Pages/Dashboard/Manager/CreateAClub';
import ManagerPayments from '../Pages/Dashboard/Manager/ManagerPayments';
import AboutPage from '../Pages/About';
import EventsPage from '../Pages/events/Event';
import ContactUs from '../Pages/Contact';


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
          path:'/events' ,
         element:<EventsPage/>
        },
        {
          path:'/eventDetails/:id' ,
         element:<EventDetails></EventDetails>
        },
        {
          path:'/about' ,
         element:<AboutPage/>
        },
        {
          path:'/contact' ,
         element:<ContactUs/>
        },
        {
          path:'/manager' ,
         element:<PrivateRoute><ApplyManager/></PrivateRoute>
        },
        
        
  {
      path: 'profile',
      element: <PrivateRoute><Profile></Profile></PrivateRoute>
    }, 
    ]
  },
  {
  path: '/dashboard',
  element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
  errorElement: <ErrorPage></ErrorPage>,
  children: [
    {
      path: "member",
      element: <MemberOverview />
    },
    {
      path: 'member/clubs',
      element: <MyClubs />
    },
    {
      path: 'member/events',
      element: <MyEvents></MyEvents>
    },
    {
      path: 'member/payments',
      element: <PaymentHistory></PaymentHistory>
    },



    
    {
      path: 'manager/clubs',
      element: <ManagerRoute><ManageMyClubs></ManageMyClubs></ManagerRoute>
    },
    {
      path: 'manager/members',
      element: <ManagerRoute><ManageMembers></ManageMembers></ManagerRoute>
    },
    {
      path: 'manager/events',
      element: <ManagerRoute><ManageEvents></ManageEvents></ManagerRoute>
    },
    {
      path: 'manager/events/create',
      element: <ManagerRoute><CreateEvent/></ManagerRoute>
    },
    {
      path: 'manager/editEvent/:eventId',
      element: <ManagerRoute><EditEvent/></ManagerRoute>
    },
    {
      path: 'manager/editClub/:clubId',
      element: <ManagerRoute><EditClub/></ManagerRoute>
    },
    {
      path: 'manager/payments',
      element: <ManagerRoute><ManagerPayments/></ManagerRoute>
    },
    {
  path: 'manager/eventRegistrations/:eventId?',
  element: (
    <ManagerRoute> <EventRegistrations /></ManagerRoute>  
           )
    },
    {
          path:'manager/create-club' ,
         element:<ManagerRoute><CreateClub></CreateClub></ManagerRoute>
        },
    {
      path: 'manager',
      // index: true,
      element: <ManagerRoute><ManagerOverview /></ManagerRoute>
    },
    


    
    {
      path: 'admin',
      // index: true,
      element:<AdminRoute><AdminOverview></AdminOverview></AdminRoute>
    },
    {
      path: 'admin/users',
      element: <AdminRoute><ManageUsers/></AdminRoute>
    },
    {
      path: 'admin/status',
      element: <PrivateRoute allowedRoles={["admin"]}><ManagerStatus></ManagerStatus></PrivateRoute>
    },
    {
      path: 'admin/clubs',
      element: <AdminRoute><ManageClubs></ManageClubs></AdminRoute>
    },
    {
      path: 'admin/payments',
      element:<AdminRoute><ViewPayments/></AdminRoute>
    },
    {
      path: 'admin/paymentHistory',
      element: <AdminRoute><PaymentHistoryD></PaymentHistoryD></AdminRoute>
    },
    {
      path: 'profile',
      element: <PrivateRoute><Profile></Profile></PrivateRoute>
    },
    {
      path: 'payment-success',
      element: <PrivateRoute><MembershipPayment></MembershipPayment></PrivateRoute>
    },
    {
      path: 'event-payment-success',
      element: <PrivateRoute><EventPayment></EventPayment></PrivateRoute>
    },

    
  ]
},
]);
