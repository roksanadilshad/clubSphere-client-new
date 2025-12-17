import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useContext } from "react";
import { FaSearch, FaEnvelope, FaBan } from "react-icons/fa";
import toast from "react-hot-toast";
import axiosSecure from "../../../api/axiosSecure";
import { AuthContext } from "../../../Context/AuthContext";

const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { user } = useContext(AuthContext); // ✅ fix here
  const managerEmail = user?.email;

  // Fetch members
  const { data, isLoading } = useQuery({
    queryKey: ["managerMembers", managerEmail],
    queryFn: async () => {
      if (!managerEmail) return [];
      const res = await axiosSecure.get(`/manager/members?managerEmail=${managerEmail}`);
      return res.data;
    },
    enabled: !!managerEmail, // only fetch if email exists
  });
//console.log(data);

  // Map backend data to frontend
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

  // Expire membership mutation
  const expireMembershipMutation = useMutation({
    mutationFn: async (membershipId) => {
      const res = await axiosSecure.patch(`/memberships/${membershipId}/expire`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["managerMembers", managerEmail]);
      toast.success("Membership expired successfully");
    },
    onError: () => toast.error("Failed to expire membership"),
  });

  const handleExpireMembership = (membershipId, memberName) => {
    if (window.confirm(`Are you sure you want to expire ${memberName}'s membership?`)) {
      expireMembershipMutation.mutate(membershipId);
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
console.log(members.membershipFee);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Club Members</h1>
        <p className="text-gray-600">Manage members for your clubs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {members.filter((m) => m.status === "active").length}
          </h3>
          <p className="text-sm text-gray-600">Active Members</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {members.filter((m) => m.status === "expired").length}
          </h3>
          <p className="text-sm text-gray-600">Expired Memberships</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            ${members.reduce((sum, m) => sum + (m.membershipFee || 0), 0).toFixed(2)}
          </h3>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Member</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Club</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Joined</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Expires</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.photoURL || "https://via.placeholder.com/40"}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="font-medium text-gray-900">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaEnvelope className="text-gray-400" />
                      {member.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.clubName}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        member.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {member.expiryDate ? new Date(member.expiryDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4">
                    {member.status === "active" && (
                      <button
                        onClick={() => handleExpireMembership(member.id, member.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Expire Membership"
                      >
                        <FaBan />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageMembers;
