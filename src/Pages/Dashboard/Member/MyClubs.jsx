import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import axiosSecure from "../../../api/axiosSecure";
import toast from "react-hot-toast";

const MyClubs = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Fetch user's memberships
  const { data: memberships = [], isLoading } = useQuery({
    queryKey: ["myMemberships", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/memberships?userEmail=${user?.email}`);
      return response.data;
    },
  });

  // Remove club function
  const handleLeaveClub = async (membershipId) => {
    // if (!window.confirm("Are you sure you want to leave this club?")) return;

    try {
      await axiosSecure.delete(`/memberships/${membershipId}`);
      toast.success("Membership removed successfully!");
      // Refetch memberships after deletion
      queryClient.invalidateQueries(["myMemberships", user?.email]);
    } catch (error) {
      console.error("Failed to leave club:", error);
      toast.error("Failed to leave club. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Clubs</h1>

      {memberships.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Clubs Yet</h3>
          <p className="text-gray-600 mb-6">
            You haven't joined any clubs yet. Start exploring!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Club Name</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Joined At</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Expires At</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((membership) => (
                <tr key={membership._id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-6">{membership.clubId}</td>
                  <td className={`py-4 px-6 font-semibold ${membership.status === "active" ? "text-green-600" : "text-yellow-600"}`}>
                    {membership.status}
                  </td>
                  <td className="py-4 px-6">{new Date(membership.joinedAt).toLocaleDateString()}</td>
                  <td className="py-4 px-6">{membership.expiresAt ? new Date(membership.expiresAt).toLocaleDateString() : "N/A"}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleLeaveClub(membership._id)}
                      className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Leave Club
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyClubs;
