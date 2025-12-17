import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaSearch, FaCheck, FaTimes, FaSync } from "react-icons/fa";
import toast from "react-hot-toast";
import axiosSecure from "../../../api/axiosSecure";


const AdminApproval = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  // 1. Fetch Clubs using React Query
  const { data: clubs = [], isLoading, isRefetching } = useQuery({
    queryKey: ["adminClubs"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/admin/clubs");
      return data;
    },
  });

  // 2. Optimized Mutation for Status Updates
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      // Logic handles both approve and reject endpoints
      const endpoint = status === "approved" ? "approve" : "reject";
      const { data } = await axiosSecure.patch(`/admin/clubs/${endpoint}/${id}`);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["adminClubs"]);
      toast.success(`Club ${variables.status} successfully!`);
    },
    onError: () => toast.error("Action failed. Please try again."),
  });

  // Filter logic
  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      club.clubName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.managerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || club.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-opacity-50 mb-4"></div>
      <p className="text-slate-400 font-bold animate-pulse">Syncing Database...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Club Approvals</h1>
          <p className="text-slate-500 font-medium">Review and authorize new club registrations</p>
        </div>
        <button 
          onClick={() => queryClient.invalidateQueries(["adminClubs"])}
          className={`btn btn-circle btn-ghost ${isRefetching ? 'animate-spin' : ''}`}
        >
          <FaSync />
        </button>
      </div>

      {/* Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2 relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or manager email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-slate-600 shadow-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">⏳ Pending Only</option>
          <option value="approved">✅ Approved</option>
          <option value="rejected">❌ Rejected</option>
        </select>
      </div>

      {/* Desktop Table View */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Club Details</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Manager Info</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Current Status</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredClubs.length > 0 ? filteredClubs.map((club) => (
                <tr key={club._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-5">
                    <p className="font-black text-slate-900">{club.clubName}</p>
                    <p className="text-sm font-bold text-primary/70">{club.category}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold text-slate-600">{club.managerEmail}</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter ${
                      club.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      club.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {club.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      {club.status === "pending" ? (
                        <>
                          <button
                            disabled={updateStatusMutation.isLoading}
                            onClick={() => updateStatusMutation.mutate({ id: club._id, status: "approved" })}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-emerald-200 active:scale-95"
                            title="Approve Club"
                          >
                            <FaCheck />
                          </button>
                          <button
                            disabled={updateStatusMutation.isLoading}
                            onClick={() => updateStatusMutation.mutate({ id: club._id, status: "rejected" })}
                            className="bg-rose-500 hover:bg-rose-600 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-rose-200 active:scale-95"
                            title="Reject Club"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-300 text-xs font-bold italic">Decision Finalized</span>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center py-20 text-slate-400 font-bold">No clubs found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminApproval;