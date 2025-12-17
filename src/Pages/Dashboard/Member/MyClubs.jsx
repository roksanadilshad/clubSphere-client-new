import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import axiosSecure from "../../../api/axiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FaExternalLinkAlt, FaTrashAlt, FaUsers } from "react-icons/fa";
import { Link } from "react-router";

const MyClubs = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data: memberships = [], isLoading } = useQuery({
    queryKey: ["myMemberships", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/memberships?userEmail=${user?.email}`);
      return response.data;
    },
    enabled: !!user?.email,
  });

  const handleLeaveClub = (membershipId, clubName) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to leave ${clubName || 'this club'}. You may lose access to member-only content.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, leave club",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/memberships/${membershipId}`);
          toast.success("Membership cancelled");
          queryClient.invalidateQueries(["myMemberships", user?.email]);
        } catch (error) {
          toast.error("Failed to process request");
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="mt-4 text-slate-400 font-medium">Fetching your memberships...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Clubs</h1>
        <p className="text-slate-500 font-medium">You are an active member of {memberships.length} communities.</p>
      </div>

      {memberships.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-16 text-center border-2 border-dashed border-slate-200">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaUsers className="text-slate-300 text-3xl" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">The world is waiting!</h3>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">
            You haven't joined any clubs yet. Join a community to share interests and attend exclusive events.
          </p>
          <Link to="/all-clubs" className="btn btn-primary rounded-xl px-8 shadow-lg shadow-blue-200">
            Explore Clubs
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Club Details</th>
                  <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                  <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Joined Date</th>
                  <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Expiry</th>
                  <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {memberships.map((membership) => (
                  <tr key={membership._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold overflow-hidden shadow-sm">
                           {/* Assuming your API returns club details via population or a field */}
                           {membership.clubImage ? (
                             <img src={membership.clubImage} alt="" className="w-full h-full object-cover" />
                           ) : (
                             <FaUsers />
                           )}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 tracking-tight leading-none mb-1">
                            {membership.clubName || "Private Club"}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {membership.clubId?.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-5 px-8">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        membership.status === "active" 
                          ? "bg-emerald-100 text-emerald-600" 
                          : "bg-amber-100 text-amber-600"
                      }`}>
                        {membership.status}
                      </span>
                    </td>

                    <td className="py-5 px-8 text-sm font-bold text-slate-500">
                      {new Date(membership.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>

                    <td className="py-5 px-8">
                      <p className={`text-sm font-bold ${membership.expiresAt ? 'text-slate-500' : 'text-slate-300 italic'}`}>
                        {membership.expiresAt ? new Date(membership.expiresAt).toLocaleDateString() : "Permanent"}
                      </p>
                    </td>

                    <td className="py-5 px-8 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/clubs`}
                          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
                          title="Visit Club"
                        >
                          <FaExternalLinkAlt size={14} />
                        </Link>
                        <button
                          onClick={() => handleLeaveClub(membership._id, membership.clubName)}
                          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
                          title="Leave Club"
                        >
                          <FaTrashAlt size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClubs;