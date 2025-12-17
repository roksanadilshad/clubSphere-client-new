import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaSearch, FaDownload, FaDollarSign, FaCreditCard, FaCalendarAlt, FaHistory } from "react-icons/fa";
import axiosSecure from "../../../api/axiosSecure";
import { motion } from "framer-motion";

const ViewPayments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Fetch payments with TanStack Query
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["adminPayments", typeFilter, dateFilter],
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/payments?type=${typeFilter}&date=${dateFilter}`
      );
      return response.data;
    },
  });

  const filteredPayments = payments.filter(
    (payment) =>
      payment.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.clubName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const membershipRev = payments.filter(p => p.type === "membership").reduce((sum, p) => sum + p.amount, 0);
  const eventRev = payments.filter(p => p.type === "event").reduce((sum, p) => sum + p.amount, 0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 border-opacity-50"></div>
        <p className="mt-4 text-slate-400 font-bold animate-pulse">Processing Ledger...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-slate-50/30 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Financial <span className="text-blue-600">Ledger</span></h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-xs tracking-widest">Global Transaction Monitoring</p>
        </div>
        <button className="btn bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-bold rounded-2xl shadow-sm gap-2">
          <FaDownload className="text-blue-500" />
          Export CSV
        </button>
      </div>

      {/* Glassmorphism Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
          <FaDollarSign className="absolute -right-4 -bottom-4 text-9xl opacity-10 rotate-12" />
          <p className="text-blue-100 font-bold uppercase text-[10px] tracking-[0.2em] mb-4">Total Net Revenue</p>
          <h3 className="text-4xl font-black mb-2">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          <div className="flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Live Settlement
          </div>
        </motion.div>

        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
              <FaCreditCard className="text-emerald-600 text-xl" />
            </div>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Membership Intake</p>
            <h3 className="text-2xl font-black text-slate-900">${membershipRev.toLocaleString()}</h3>
          </div>
          <p className="text-xs font-bold text-emerald-600 mt-4 underline decoration-2 underline-offset-4 pointer-cursor tracking-tighter uppercase italic">View Details</p>
        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-4">
              <FaHistory className="text-purple-600 text-xl" />
            </div>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Event Admissions</p>
            <h3 className="text-2xl font-black text-slate-900">${eventRev.toLocaleString()}</h3>
          </div>
           <p className="text-xs font-bold text-purple-600 mt-4 underline decoration-2 underline-offset-4 pointer-cursor tracking-tighter uppercase italic">View Details</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            placeholder="Search transaction by email or club name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-slate-600"
          />
        </div>
        <div className="flex gap-4">
            <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-500 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none"
            >
            <option value="all">💳 All Categories</option>
            <option value="membership">Membership</option>
            <option value="event">Event</option>
            </select>
            <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-500 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none"
            >
            <option value="all">📅 Lifetime</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            </select>
        </div>
      </div>

      {/* Professional Transaction Table */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tx ID</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Type</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Execution Date</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-slate-50/80 transition-all duration-200">
                  <td className="px-8 py-6">
                    <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                      {payment.transactionId?.slice(-8).toUpperCase() || "N/A"}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-800 tracking-tight">{payment.userEmail}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{payment.clubName || payment.eventTitle}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                        payment.type === "membership" ? "bg-indigo-50 text-indigo-600" : "bg-purple-50 text-purple-600"
                    }`}>
                      {payment.type}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-900">${payment.amount.toFixed(2)}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                        <FaCalendarAlt className="opacity-30" />
                        {new Date(payment.paidAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 shadow-sm border border-emerald-200/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {payment.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPayments.length === 0 && (
            <div className="p-20 text-center">
                <p className="text-slate-400 font-bold italic">No transactions found for current filter criteria.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ViewPayments;