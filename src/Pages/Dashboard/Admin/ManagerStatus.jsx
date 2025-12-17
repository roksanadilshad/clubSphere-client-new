
import { IoPersonRemove } from "react-icons/io5";
import { AuthContext } from '../../../Context/AuthContext';
import { FaTrash, FaUserCheck } from 'react-icons/fa';
import { useMutation, useQuery, QueryClient } from '@tanstack/react-query';
import axiosSecure from '../../../api/axiosSecure';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const queryClient = new QueryClient(); 

export default function ManagerStatus() {
    //const { user } = useContext(AuthContext);

    const { refetch, data: application = [], isLoading } = useQuery({
        queryKey: ['managerApplications', 'pending'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/manager-applications');
            return res.data;
        }
    })

    // Mutation for role update
    const roleMutation = useMutation({
        mutationFn: ({ email, role }) => {
            // Use the correct server endpoint: /managers/role/
            return axiosSecure.patch(`/managers/role/${email}`, { role }); 
        },
        onSuccess: (data, variables) => {
            const { userModifiedCount, applicationModifiedCount } = data.data;

            if (userModifiedCount > 0 || applicationModifiedCount > 0) { 
                queryClient.invalidateQueries({ queryKey: ['managerApplications', 'pending'] });
                refetch();
                
                // Determine the success message
                const actionText = variables.role === 'clubManager' 
                    ? `Role set to Manager.` 
                    : `Application rejected.`;

                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `${actionText} for ${variables.email}`,
                    showConfirmButton: false,
                    timer: 2000
                });
            } else {
                toast.error(`Application or role may be already processed.`);
            }
        },
        onError: (error) => {
            console.error(error.response || error);
            toast.error(`Failed to update role: ${error.response?.data?.message || error.message || 'Server error'}`);
        }
    });

    // 3. Corrected Handlers
    const handleApproval = applicants => {
        //  Send the correct target role 'manager'
        roleMutation.mutate({ email: applicants.email, role: 'clubManager' });
    }

    const handleRejection = applicants => {
        // Send the custom signal 'reject_app'
        roleMutation.mutate({ email: applicants.email, role: 'reject_app' });
    }

    const deleteMutation = useMutation({
    mutationFn: (id) => {
        // Call the new DELETE route using the document's _id
        return axiosSecure.delete(`/admin/manager-applications/${id}`);
    },
    onSuccess: (data) => {
        if (data.data.deletedCount === 1) {
            // Invalidate cache and refetch the list to update the UI
            queryClient.invalidateQueries({ queryKey: ['managerApplications', 'pending'] });
            refetch();
            
            toast.success("Application successfully deleted.");
        }
    },
    onError: (error) => {
        console.error(error);
        toast.error(`Failed to delete application: ${error.response?.data?.message || 'Server error'}`);
    }
});



    if (isLoading) {
        return <p className="text-center mt-10">Loading applications...</p>;
    }
    
    if (application.length === 0) {
        return <p>No pending manager applications found.</p>;
    }


// 4. New Handler for Deletion (Uses SweetAlert2 for confirmation)
const handleDelete = applicants => {
    Swal.fire({
        title: "Are you sure?",
        text: `You are about to permanently delete the application from ${applicants.fullName}.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            deleteMutation.mutate(applicants._id); // Pass the application's _id to the mutation
        }
    });
};

    if (application.length === 0) {
        return <p className="text-center mt-10">No pending manager applications found.</p>;
    }
  
    return (
        <div className="max-w-4xl mx-auto p-6 bg-[#FFC4C4] rounded-2xl shadow mt-10">
            <h2 className="text-2xl font-bold text-[#850E35] mb-6">
                Manager Application Status ({application.length} Pending)
            </h2>
            <div className="p-4 bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
            <table className="table w-full">
          <thead>
              <tr className="bg-[#f0f0f0]">
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Reason</th>
                  <th>Status</th> 
                  <th>Actions</th>
              </tr>
          </thead>
          <tbody>
              {
        application.map((applicants, index) => (
            <tr key={applicants._id} className="hover:bg-gray-50">
  <th>{index + 1}</th>
  <td>{applicants.fullName}</td>
  <td>{applicants.email}</td>
  <td>{applicants.reason}</td>
  <td>
      <span 
        className={`font-semibold ${applicants.status === 'approved' ? 'text-green-600' : 
            applicants.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}
      >
          {applicants.status}
      </span>
  </td>
  <td className="flex space-x-2">
      {/* Approve Button */}
      <button
          onClick={() => handleApproval(applicants)}
          className='btn btn-sm btn-success text-white'
          disabled={applicants.status !== 'pending' || roleMutation.isPending}
          title="Approve"
      >
          <FaUserCheck />
      </button>
      
      {/* Reject Button */}
      <button
          onClick={() => handleRejection(applicants)}
          className='btn btn-sm btn-error text-white'
          disabled={applicants.status !== 'pending' || roleMutation.isPending}
          title="Reject"
      >
          <IoPersonRemove/>
      </button>
      
      {/* Trash Button */}
      <button 
      onClick={() => handleDelete(applicants)}
          className='btn btn-sm btn-ghost text-red-600'
          title="Delete"
          disabled={roleMutation.isPending || roleMutation.isPending}
      >
          <FaTrash />
      </button>
  </td>
            </tr>
        ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}