import React, { use } from 'react';
import { AuthContext } from '../Context/AuthContext';
import useRole from '../hooks/useRole';
import Forbidden from '../Pages/Forbidden';

const AdminRoute = ({ children }) => {
    const { loading } = use(AuthContext)
    const { role, roleLoading } = useRole()

    if (loading || roleLoading) {
        return <p>Loading....</p>
    }

    if (role !== 'admin') {
        return <Forbidden></Forbidden>
    }

    return children;
};

export default AdminRoute;