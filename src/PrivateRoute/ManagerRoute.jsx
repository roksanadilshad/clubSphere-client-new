import React, { use } from 'react';
import { AuthContext } from '../Context/AuthContext';
import useRole from '../hooks/useRole';
import Forbidden from '../Pages/Forbidden';
import Loading from '../Components/Loading';

const ManagerRoute = ({ children }) => {
    const { loading } = use(AuthContext)
    const { role, roleLoading } = useRole()

    if (loading || roleLoading) {
        return <Loading/>
    }

    if (role !== 'clubManager') {
        return <p>Be a manager to start a club</p>
    }

    return children;
};

export default ManagerRoute;