import React, { use } from 'react';
import { AuthContext } from '../Context/AuthContext';
import useRole from '../hooks/useRole';
import Forbidden from '../Pages/Forbidden';
import Loading from '../Components/Loading';

const AdminRoute = ({ children }) => {
    const { loading } = use(AuthContext)
    const { role, roleLoading } = useRole()

    if (loading || roleLoading) {
        return <Loading/>
    }

    if (role !== 'admin') {
        return <Forbidden></Forbidden>
    }

    return children;
};

export default AdminRoute;