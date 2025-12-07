import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { FaPlus, FaEdit, FaUsers, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router";

const MyClubs = () => {
  const { user } = useContext(AuthContext);

  // Fetch manager's clubs
  const { data: clubs, isLoading } = useQuery({
    queryKey: ["managerClubs", user?.email],
    queryFn: async () => {
      const response = await fetch(`/api/manager/clubs?email=${user?.email}`);
      if (!response.ok) throw new Error("Failed to fetch clubs");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
        {clubs?.map((club) => (
          <div
            key={club.id}
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
                <Link
                  to={`/dashboard/manager/clubs/${club.id}/edit`}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FaEdit className="text-lg" />
                </Link>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {club.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaUsers className="text-gray-400" />
                  <span>{club.memberCount} members</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCalendarAlt className="text-gray-400" />
                  <span>{club.eventCount} events</span>
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
                <div className="flex gap-2">
                  <Link
                    to={`/dashboard/manager/clubs/${club.id}/members`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Members
                  </Link>
                  <Link
                    to={`/dashboard/manager/clubs/${club.id}/events`}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Events
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {clubs?.length === 0 && (
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

export default MyClubs;
