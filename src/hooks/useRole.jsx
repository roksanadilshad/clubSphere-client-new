import { useQuery } from '@tanstack/react-query';
import React, { use } from 'react';
import axiosSecure from '../api/axiosSecure';
import { AuthContext } from '../Context/AuthContext';

const useRole = () => {
    const { user } = use(AuthContext);
    

    const { isLoading: roleLoading, data: role = 'user' } = useQuery({
        queryKey: ['user-role', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}/role`);
            
            return res.data?.role || 'user';
        }
    })

    return { role, roleLoading };
};

export default useRole;