import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { FaPlus, FaEdit, FaTrash, FaUsers, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router";
import toast from "react-hot-toast";
import axiosSecure from "../../../api/axiosSecure";

const ManageMyClubs = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Fetch manager's clubs
  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["managerClubs", user?.email],
    queryFn: async () => {
      const res = await axiosSecure(`/manager/clubs?email=${user?.email}`);
      // if (!res.ok) throw new Error("Failed to fetch clubs");
      return res.data;
    },
  });

  // Delete club mutation
  const deleteClubMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure(`/clubs/${id}`, { method: "DELETE" });
     return res.data;
    },
    onSuccess: () => {
      toast.success("Club deleted successfully!");
      queryClient.invalidateQueries(["managerClubs", user?.email]);
    },
    onError: () => {
      toast.error("Failed to delete club");
    },
  });

  const handleDelete = (id) => {
    if (toast("Are you sure you want to delete this club?")) {
      deleteClubMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
//console.log(clubs);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Clubs</h1>
          <p className="text-gray-600">Manage clubs you've created</p>
        </div>
        <Link
          to="/dashboard/manager/clubs/create"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FaPlus />
          Create New Club
        </Link>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {clubs.map((club) => (
          <div
            key={club._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-500">
              {club.bannerImage ? (
                <img
                  src={club.bannerImage}
                  alt={club.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaUsers className="text-6xl text-white opacity-50" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    club.status === "approved"
                      ? "bg-green-500 text-white"
                      : club.status === "pending"
                      ? "bg-yellow-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {club.status}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{club.name}</h3>
                  <p className="text-sm text-gray-500">{club.category}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/dashboard/manager/clubs/${club._id}/edit`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FaEdit className="text-lg" />
                  </Link>
                  <button
                    onClick={() => handleDelete(club._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTrash className="text-lg" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{club.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaUsers className="text-gray-400" />
                  <span>{club.memberCount || 0} members</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCalendarAlt className="text-gray-400" />
                  <span>{club.eventCount || 0} events</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <FaMapMarkerAlt className="text-gray-400" />
                <span>{club.location}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500">Membership Fee</p>
                  <p className="text-lg font-bold text-gray-900">
                    ${club.membershipFee}/month
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {clubs.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUsers className="text-4xl text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Clubs Yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first club and start building your community
          </p>
          <Link
            to="/dashboard/manager/clubs/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            Create Your First Club
          </Link>
        </div>
      )}
    </div>
  );
};

export default ManageMyClubs;
