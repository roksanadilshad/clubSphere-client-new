import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

import { FaBuilding, FaUsers, FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import { Link } from "react-router";
import axiosSecure from "../../../api/axiosSecure";
import { AuthContext } from "../../../Context/AuthContext";

const ManagerOverview = () => {
  const { user } = useContext(AuthContext);

  // Fetch manager stats
  const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: ["managerStats", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/manager/stats?email=${user.email}`);
      return response.data;
    },
    enabled: !!user?.email, // Only fetch when email exists
  });

  const summaryCards = [
    {
      title: "My Clubs",
      value: stats?.totalClubs || 0,
      icon: <FaBuilding className="text-2xl" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      link: "/dashboard/manager/clubs",
    },
    {
      title: "Total Members",
      value: stats?.totalMembers || 0,
      icon: <FaUsers className="text-2xl" />,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      link: "/dashboard/manager/members",
    },
    {
      title: "Total Events",
      value: stats?.totalEvents || 0,
      icon: <FaCalendarAlt className="text-2xl" />,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      link: "/dashboard/manager/events",
    },
    {
      title: "Revenue",
      value: `$${stats?.totalRevenue || 0}`,
      icon: <FaDollarSign className="text-2xl" />,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      link: "/dashboard/manager/payments",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  console.log();
  

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">
        Error loading stats: {error?.message || "Unknown error"}
      </div>
    );
  }
//console.log(stats);


  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.displayName}!
        </h1>
        <p className="text-gray-600">Here's an overview of your clubs and activities</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${card.bgColor} rounded-lg`}>
                <div className={card.textColor}>{card.icon}</div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
            <p className="text-sm text-gray-600">{card.title}</p>
          </Link>
        ))}
      </div>

      {/* Recent Clubs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Clubs</h2>
          <div className="space-y-3">
            {stats?.recentClubs?.map((club) => (
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
                    <p className="text-xs text-gray-500">{club.memberCount} members</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    club.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {club.status}
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/dashboard/manager/clubs"
            className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Clubs →
          </Link>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          <div className="space-y-3">
            {stats?.upcomingEvents?.map((event) => (
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
                  <p className="text-xs text-gray-500 mt-1">
                    {event.registrations} / {event.maxAttendees} registered
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/dashboard/manager/events"
            className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Events →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ManagerOverview;
