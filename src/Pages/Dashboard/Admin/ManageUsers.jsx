import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaSearch, FaUserShield, FaUser, FaUserEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import axiosSecure from "../../../api/axiosSecure";

const ManageUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // 1. Fetch users with TanStack Query
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // 2. Mutation for role changes
  const changeRoleMutation = useMutation({
    mutationFn: async ({ email, newRole }) => {
      const res = await axiosSecure.patch(`/users/role/${email}`, {
        role: newRole,
      });
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["users"]);
      // Corrected template literal syntax
      toast.success(`${variables.email} is now an ${variables.newRole}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update role");
    },
  });

  const handleRoleChange = (email, currentRole, newRole) => {
    if (currentRole === newRole) return;

    Swal.fire({
      title: "Confirm Role Change",
      text: `Are you sure you want to promote/demote ${email} to ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update role",
    }).then((result) => {
      if (result.isConfirmed) {
        changeRoleMutation.mutate({ email, newRole });
      }
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="mt-4 text-slate-500 font-medium">Loading user directory...</p>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Users</h1>
          <p className="text-slate-500 font-medium">Directory of {users.length} registered members</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">User Identity</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Email Address</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Assigned Role</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Member Since</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="avatar">
                        <div className="w-11 h-11 rounded-2xl shadow-sm">
                          <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} />
                        </div>
                      </div>
                      <span className="font-bold text-slate-800 tracking-tight">{user.name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-600 font-medium">{user.email}</td>

                  <td className="px-6 py-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm ${
                      user.role === "admin" ? "bg-rose-100 text-rose-700" :
                      user.role === "clubManager" ? "bg-indigo-100 text-indigo-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {user.role || 'Member'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end">
                       <select
                        value={user.role || 'member'}
                        onChange={(e) => handleRoleChange(user.email, user.role, e.target.value)}
                        disabled={changeRoleMutation.isLoading && changeRoleMutation.variables?.email === user.email}
                        className="select select-sm select-bordered rounded-xl font-bold text-xs bg-white border-slate-200 focus:outline-none"
                      >
                        <option value="member">Member</option>
                        <option value="clubManager">Club Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                      
                      {changeRoleMutation.isLoading && changeRoleMutation.variables?.email === user.email && (
                        <span className="loading loading-spinner loading-xs ml-2 text-primary"></span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="py-20 text-center">
             <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <FaUser className="text-slate-300 text-2xl" />
             </div>
             <p className="text-slate-500 font-bold">No users found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;