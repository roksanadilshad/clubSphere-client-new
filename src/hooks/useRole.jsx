import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react'; // Use standard useContext
import useAxiosSecure from '../hooks/useAxiosSecure'; // Use the hook version
import { AuthContext } from '../Context/AuthContext';

const useRole = () => {
    const { user, loading } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure(); // Use the hook to ensure interceptors work

    const { isLoading: roleLoading, data: role } = useQuery({
        // 1. The queryKey must include the email
        queryKey: ['user-role', user?.email],
        
        // 2. ONLY run this query if we have a user email and auth is not loading
        enabled: !loading && !!user?.email,
        
        queryFn: async () => {
            console.log('Fetching role for:', user?.email);
            const res = await axiosSecure.get(`/users/${user.email}/role`);
            return res.data?.role;
        },
        // 3. Optional: keep the data cached for 5 minutes
        staleTime: 1000 * 60 * 5, 
    });

    // Default to 'user' or null while loading
    return { role: role || 'user', roleLoading };
};

export default useRole;