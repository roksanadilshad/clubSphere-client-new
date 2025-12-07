import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { FaMapMarkerAlt, FaUsers, FaCalendar } from "react-icons/fa";
import { Link } from "react-router";

const MyClubs = () => {
  const { user } = useContext(AuthContext);

  // Fetch user's clubs
  const { data: memberships, isLoading } = useQuery({
    queryKey: ["myMemberships", user?.email],
    queryFn: async () => {
      const response = await fetch(`/api/member/memberships?email=${user?.email}`);
      if (!response.ok) throw new Error("Failed to fetch memberships");
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Clubs</h1>
        <p className="text-gray-600">Clubs you're currently a member of</p>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memberships?.map((membership) => (
          <div
            key={membership.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-40 bg-gradient-to-br from-blue-500 to-purple-500">
              {membership.club.bannerImage ? (
                <img
                  src={membership.club.bannerImage}
                  alt={membership.club.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaBuilding className="text-6xl text-white opacity-50" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    membership.status === "active"
                      ? "bg-green-500 text-white"
                      : "bg-yellow-500 text-white"
                  }`}
                >
                  {membership.status}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {membership.club.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {membership.club.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span>{membership.club.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaUsers className="text-gray-400" />
                  <span>{membership.club.memberCount} members</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCalendar className="text-gray-400" />
                  <span>
                    Joined {new Date(membership.joinedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500">Expires</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(membership.expiryDate).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  to={`/clubs/${membership.club.id}`}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Club
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {memberships?.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <FaBuilding className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Clubs Yet</h3>
          <p className="text-gray-600 mb-6">
            You haven't joined any clubs yet. Start exploring!
          </p>
          <Link
            to="/clubs"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Clubs
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyClubs;
