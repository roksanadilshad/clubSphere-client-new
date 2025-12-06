import React from 'react';
import { createBrowserRouter } from 'react-router';
import Root from '../Layouts/root';
import Home from '../Pages/Home';
import Registration from '../Pages/Register';
import Login from '../Pages/Login';

export const router = createBrowserRouter([
  {
    path: "/",
    element:<Root></Root>,
    errorElement:<p>Add Firebase</p>,
    children: [
        {
            index: true,
            path:'/',
  //             loader: async () => {
  //   const [petsRes, tipsRes, vetsRes] = await Promise.all([
  //     fetch('/pets.json'),
  //     fetch('/tips.json'),
  //     fetch('/vets.json')
      
  //   ]);

  //   const [pets, tips, vets] = await Promise.all([
  //     petsRes.json(),
  //     tipsRes.json(),
  //     vetsRes.json()
  //   ]);

  //   return { pets, tips,  vets};
  // },
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
       
    ]
  },
]);
