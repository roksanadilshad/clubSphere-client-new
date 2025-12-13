import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { FaBuilding, FaCalendarAlt, FaCreditCard } from "react-icons/fa";
import { Link } from "react-router";
import axiosSecure from "../../../api/axiosSecure";

const MemberOverview = () => {
  const { user } = useContext(AuthContext);

  // Fetch member stats
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["memberStats", user?.email],
    enabled: !!user?.email, // only run if email exists
    queryFn: async () => {
      const response = await axiosSecure.get(`/member/stats?email=${user.email}`);
      return response.data
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center mt-8">
        Failed to load member overview.
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Clubs Joined",
      value: stats?.totalClubs || 0,
      icon: <FaBuilding className="text-2xl" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Events Registered",
      value: stats?.totalEvents || 0,
      icon: <FaCalendarAlt className="text-2xl" />,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Total Spent",
      value: `$${stats?.totalSpent || 0}`,
      icon: <FaCreditCard className="text-2xl" />,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  const safeUpcomingEvents = stats?.upcomingEvents?.filter(
    (e) => e.date && !isNaN(new Date(e.date))
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {user?.displayName || "Member"}!
        </h1>
        <p className="text-gray-600">Here's your activity overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${card.bgColor} rounded-lg`}>{card.icon}</div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
            <p className="text-sm text-gray-600">{card.title}</p>
          </div>
        ))}
      </div>

      {/* My Clubs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Clubs</h2>
          <div className="space-y-3">
            {stats?.myClubs?.length > 0 ? (
              stats.myClubs.map((club) => (
                <div
                  key={club.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={club.bannerImage || "https://via.placeholder.com/40"}
                      alt={club.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{club.name}</p>
                      <p className="text-xs text-gray-500">{club.location}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                    Active
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">You haven't joined any clubs yet.</p>
            )}
          </div>
          <Link
            to="/dashboard/member/clubs"
            className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Clubs →
          </Link>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          <div className="space-y-3">
            {safeUpcomingEvents?.length > 0 ? (
              safeUpcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs text-blue-600 font-semibold">
                      {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.clubName}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No upcoming events registered.</p>
            )}
          </div>
          <Link
            to="/dashboard/member/events"
            className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Events →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Discover More</h2>
        <p className="mb-6 text-blue-100">
          Explore new clubs and events that match your interests
        </p>
        <div className="flex gap-4">
          <Link
            to="/clubs"
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Browse Clubs
          </Link>
          <Link
            to="/events"
            className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
          >
            Find Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MemberOverview;
