import { useQuery } from "@tanstack/react-query";
import { FaUsers, FaBuilding, FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import { motion } from "framer-motion";
import axiosSecure from "../../../api/axiosSecure";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const AdminOverview = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const response = await axiosSecure.get("/admin/stats");
      return response.data;
    },
  });

  const summaryCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: <FaUsers className="text-3xl" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Total Clubs",
      value: stats?.totalClubs || 0,
      icon: <FaBuilding className="text-3xl" />,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Total Events",
      value: stats?.totalEvents || 0,
      icon: <FaCalendarAlt className="text-3xl" />,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue || 0}`,
      icon: <FaDollarSign className="text-3xl" />,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const membershipsData = stats?.clubsByMembership
  ? Object.entries(stats.clubsByMembership).map(([clubName, memberCount]) => ({
      clubName,
      members: memberCount,
    }))
  : [];

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Summary Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {summaryCards.map((card, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${card.bgColor} rounded-lg`}>
                <div className={card.textColor}>{card.icon}</div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
            <p className="text-sm text-gray-600">{card.title}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Club Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Club Status</h2>
          <div className="space-y-3">
            {["approved", "pending", "rejected"].map((status) => (
              <div
                key={status}
                className={`flex items-center justify-between p-3 ${
                  status === "approved"
                    ? "bg-green-50 text-green-600"
                    : status === "pending"
                    ? "bg-yellow-50 text-yellow-600"
                    : "bg-red-50 text-red-600"
                } rounded-lg`}
              >
                <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                <span className="text-lg font-bold">{stats?.clubsByStatus?.[status] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {stats?.recentActivity?.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Memberships Chart Placeholder */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
  <h2 className="text-xl font-bold text-gray-900 mb-4">Memberships Overview</h2>
  {membershipsData.length > 0 ? (
    <ResponsiveContainer width="100%" height={256}>
      <BarChart data={membershipsData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="clubName" tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="members" fill="#4F46E5" />
      </BarChart>
    </ResponsiveContainer>
  ) : (
    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
      <p className="text-gray-500">No membership data available</p>
    </div>
  )}
</div>
    </div>
  );
};

export default AdminOverview;
