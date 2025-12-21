import React, { use } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../Context/AuthContext';
import Loading from '../Components/Loading';
;

const PrivateRoute = ({children}) => {
    const {user, loading} = use(AuthContext);

    const location = useLocation();
    //console.log(location);

    if(loading){
        return <Loading/>
    };
    if(user){
        return children;
    }
    
    
    return <Navigate state={{from: location}} replace to='/login'></Navigate>;
};

export default PrivateRoute;