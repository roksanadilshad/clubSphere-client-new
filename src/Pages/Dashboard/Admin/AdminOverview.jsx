import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";
import { FaUsers, FaLayerGroup, FaCalendarCheck, FaDollarSign, FaHistory } from "react-icons/fa";
import { motion } from "framer-motion";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminOverview = () => {
  const axiosSecure = useAxiosSecure();
  const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/stats");
      return res.data;
    },
  });

  if (isLoading) return <div className="p-10 animate-pulse text-slate-400 font-bold text-center">Loading Analytics...</div>;

  if (isError) {
    return (
      <div className="p-10 text-red-500 text-center bg-red-50 rounded-xl m-10">
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p>{error?.response?.data?.message || "Failed to load admin stats. Please check your admin privileges."}</p>
      </div>
    );
  }

  // --- SAFETY GUARDS FOR DATA TRANSFORMATION ---
  // Using Object.keys on an undefined object will crash. We default to {}
  const pieData = Object.keys(stats?.clubsByStatus || {}).map((key) => ({
    name: key.toUpperCase(),
    value: stats.clubsByStatus[key],
  }));

  const barData = Object.keys(stats?.clubsByMembership || {}).map((key) => ({
    name: key.length > 10 ? key.substring(0, 10) + "..." : key,
    members: stats.clubsByMembership[key],
  }));

  const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Platform Insights</h1>
        <p className="text-slate-500 font-medium">Real-time overview of ClubSphere operations.</p>
      </header>

      {/* 1. Stat Cards - Added Optional Chaining stats?. */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={<FaUsers />} color="blue" />
        <StatCard title="Active Clubs" value={stats?.totalClubs || 0} icon={<FaLayerGroup />} color="purple" />
        <StatCard title="Events Held" value={stats?.totalEvents || 0} icon={<FaCalendarCheck />} color="emerald" />
        <StatCard title="Total Revenue" value={`$${stats?.totalRevenue || 0}`} icon={<FaDollarSign />} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Bar Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <h3 className="text-xl font-black text-slate-900 mb-6">Club Membership Density</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="members" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Pie Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <h3 className="text-xl font-black text-slate-900 mb-6">Clubs by Status</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Recent Activity Log - Added guard for .map() */}
        <div className="lg:col-span-3 bg-slate-900 p-10 rounded-[2.5rem] text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/10 rounded-xl"><FaHistory className="text-indigo-400" /></div>
            <h3 className="text-2xl font-black">Live Registration Feed</h3>
          </div>
          <div className="space-y-4">
            {stats?.recentActivity?.map((activity, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: idx * 0.1 }}
                key={idx} 
                className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors"
              >
                <span className="font-medium text-slate-300">{activity?.message}</span>
                <span className="text-xs font-bold text-slate-500 uppercase">{activity?.time}</span>
              </motion.div>
            )) || <p className="text-slate-500 italic">No recent activity found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50",
    purple: "text-purple-600 bg-purple-50",
    emerald: "text-emerald-600 bg-emerald-50",
    rose: "text-rose-600 bg-rose-50",
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      </div>
    </div>
  );
};

export default AdminOverview;