// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useState } from "react";
// import { FaSearch, FaCheck, FaTimes, FaEye } from "react-icons/fa";
// import toast from "react-hot-toast";

// const ManageClubs = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const queryClient = useQueryClient();

//   // Fetch clubs
//   const { data: clubs, isLoading } = useQuery({
//     queryKey: ["adminClubs"],
//     queryFn: async () => {
//       const response = await fetch("http://localhost:3000/admin/clubs");
//       if (!response.ok) throw new Error("Failed to fetch clubs");
//       return response.json();
//     },
//   });

//   // Update club status mutation
//   const updateStatusMutation = useMutation({
//     mutationFn: async ({ clubId, status }) => {
//       const response = await fetch(`/api/admin/clubs/${clubId}/status`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status }),
//       });
//       if (!response.ok) throw new Error("Failed to update status");
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(["adminClubs"]);
//       toast.success("Club status updated successfully");
//     },
//     onError: () => {
//       toast.error("Failed to update club status");
//     },
//   });

//   const handleStatusChange = (clubId, status) => {
//     if (window.confirm(`Are you sure you want to ${status} this club?`)) {
//       updateStatusMutation.mutate({ clubId, status });
//     }
//   };

//   const filteredClubs = clubs?.filter((club) => {
//     const matchesSearch =
//       club.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       club.managerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === "all" || club.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Clubs</h1>
//         <p className="text-gray-600">Review and manage all clubs on the platform</p>
//       </div>

//       {/* Filters */}
//       <div className="mb-6 flex flex-col sm:flex-row gap-4">
//         <div className="flex-1 relative">
//           <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search clubs..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="all">All Status</option>
//           <option value="pending">Pending</option>
//           <option value="approved">Approved</option>
//           <option value="rejected">Rejected</option>
//         </select>
//       </div>

//       {/* Clubs Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
//                   Club Name
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
//                   Manager
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
//                   Status
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
//                   Members
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
//                   Fee
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredClubs?.map((club) => (
//                 <tr key={club.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <img
//                         src={club.bannerImage || "https://via.placeholder.com/40"}
//                         alt={club.name}
//                         className="w-10 h-10 rounded object-cover"
//                       />
//                       <div>
//                         <p className="font-medium text-gray-900">{club.name}</p>
//                         <p className="text-xs text-gray-500">{club.category}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-600">{club.managerEmail}</td>
//                   <td className="px-6 py-4">
//                     <span
//                       className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
//                         club.status === "approved"
//                           ? "bg-green-100 text-green-700"
//                           : club.status === "pending"
//                           ? "bg-yellow-100 text-yellow-700"
//                           : "bg-red-100 text-red-700"
//                       }`}
//                     >
//                       {club.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-600">
//                     {club.memberCount || 0}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-600">
//                     ${club.membershipFee || 0}
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2">
//                       {club.status === "pending" && (
//                         <>
//                           <button
//                             onClick={() => handleStatusChange(club.id, "approved")}
//                             className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                             title="Approve"
//                           >
//                             <FaCheck />
//                           </button>
//                           <button
//                             onClick={() => handleStatusChange(club.id, "rejected")}
//                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                             title="Reject"
//                           >
//                             <FaTimes />
//                           </button>
//                         </>
//                       )}
//                       <button
//                         className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                         title="View Details"
//                       >
//                         <FaEye />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageClubs;
import { useEffect, useState } from "react";
import axios from "axios";

const AdminApproval = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClubs = async () => {
    const { data } = await axios.get("http://localhost:3000/admin/clubs");
    setClubs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleApprove = async (id) => {
    await axios.patch(`http://localhost:3000/admin/clubs/approve/${id}`);
    fetchClubs(); // reload list
  };

  const handleReject = async (id) => {
    await axios.patch(`http://localhost:3000/admin/clubs/reject/${id}`);
    fetchClubs();
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Club Approval</h1>

      <div className="space-y-4">
        {clubs.map((club) => (
          <div
            key={club._id}
            className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold">{club.clubName}</h2>
              <p className="text-gray-600">{club.category}</p>
              <p>Status: <span className="font-bold">{club.status}</span></p>
              <p className="text-sm text-gray-500">
                Manager: {club.managerEmail}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              {club.status === "pending" && (
                <>
                  <button
                    onClick={() => handleApprove(club._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(club._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </>
              )}

              {club.status !== "pending" && (
                <span className="px-3 py-1 text-sm rounded bg-gray-200">
                  {club.status.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminApproval;
