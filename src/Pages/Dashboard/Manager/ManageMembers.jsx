import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useContext } from "react";
import { FaSearch, FaEnvelope, FaBan, FaUserFriends, FaClock, FaHistory } from "react-icons/fa";
import toast from "react-hot-toast";
import axiosSecure from "../../../api/axiosSecure";
import { AuthContext } from "../../../Context/AuthContext";

const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { user } = useContext(AuthContext);
  const managerEmail = user?.email;

  const { data, isLoading } = useQuery({
    queryKey: ["managerMembers", managerEmail],
    queryFn: async () => {
      if (!managerEmail) return [];
      const res = await axiosSecure.get(`/manager/members?managerEmail=${managerEmail}`);
      return res.data;
    },
    enabled: !!managerEmail,
  });

  useEffect(() => {
    if (data) {
      setMembers(
        data.map((m) => ({
          id: m._id || m.id,
          name: m.name || "Unknown",
          email: m.userEmail || "Unknown",
          photoURL: m.photoURL || "",
          clubName: m.clubName || "Unknown",
          status: m.status || "active",
          joinedAt: m.joinedAt || m.createdAt || new Date(),
          expiryDate: m.expiryDate || m.expiresAt || null,
          membershipFee: m.membershipFee || 0,
        }))
      );
    }
  }, [data]);

  const expireMembershipMutation = useMutation({
    mutationFn: async (membershipId) => {
      const res = await axiosSecure.patch(`/memberships/${membershipId}/expire`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["managerMembers", managerEmail]);
      toast.success("Access revoked successfully");
    },
    onError: () => toast.error("Operational failure: Could not expire membership"),
  });

  const handleExpireMembership = (membershipId, memberName) => {
    toast((t) => (
      <span className="flex flex-col gap-2">
        <b>Revoke access for {memberName}?</b>
        <div className="flex gap-2 justify-end">
          <button className="bg-slate-200 px-2 py-1 rounded text-xs" onClick={() => toast.dismiss(t.id)}>Cancel</button>
          <button 
            className="bg-red-600 text-white px-2 py-1 rounded text-xs" 
            onClick={() => {
              expireMembershipMutation.mutate(membershipId);
              toast.dismiss(t.id);
            }}
          >
            Confirm
          </button>
        </div>
      </span>
    ), { duration: 5000 });
  };

  const filteredMembers = members.filter(
    (m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-10 bg-gray-200 rounded-lg w-1/4"></div>
        <div className="grid grid-cols-3 gap-6">
          <div className="h-32 bg-gray-100 rounded-2xl"></div>
          <div className="h-32 bg-gray-100 rounded-2xl"></div>
          <div className="h-32 bg-gray-100 rounded-2xl"></div>
        </div>
        <div className="h-96 bg-gray-50 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Members Hub</h1>
          <p className="text-slate-500 font-medium">Monitoring {members.length} total affiliations</p>
        </div>
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all font-medium shadow-sm"
          />
        </div>
      </header>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Pulse", val: members.filter(m => m.status === "active").length, icon: <FaUserFriends />, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Expired Access", val: members.filter(m => m.status === "expired").length, icon: <FaClock />, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Historical Revenue", val: `৳${members.reduce((s, m) => s + (m.membershipFee || 0), 0).toLocaleString()}`, icon: <FaHistory />, color: "text-blue-600", bg: "bg-blue-50" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center text-2xl`}>
              {stat.icon}
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-800">{stat.val}</h3>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Club Association</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Current Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Dates (Joined/Expiry)</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={member.photoURL || "https://ui-avatars.com/api/?name="+member.name} className="w-12 h-12 rounded-2xl object-cover shadow-sm ring-2 ring-white" alt=""/>
                      <div>
                        <p className="text-sm font-black text-slate-800 leading-none mb-1">{member.name}</p>
                        <p className="text-[11px] font-medium text-slate-400">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-slate-600">{member.clubName}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      member.status === "active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-800 tracking-tight">In: {new Date(member.joinedAt).toLocaleDateString()}</span>
                      <span className="text-[10px] font-bold text-slate-400 tracking-tight">Out: {member.expiryDate ? new Date(member.expiryDate).toLocaleDateString() : "Permanent"}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {member.status === "active" ? (
                      <button
                        onClick={() => handleExpireMembership(member.id, member.name)}
                        className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm active:scale-95"
                      >
                        <FaBan size={14} />
                      </button>
                    ) : (
                      <div className="p-3 text-slate-200 inline-block cursor-not-allowed">
                        <FaBan size={14} />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUserFriends className="text-3xl text-slate-200" />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No matching members found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageMembers;