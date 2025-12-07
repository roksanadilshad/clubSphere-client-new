import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaSearch, FaDownload, FaFilter, FaDollarSign } from "react-icons/fa";

const ViewPayments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Fetch payments
  const { data: payments, isLoading } = useQuery({
    queryKey: ["adminPayments", typeFilter, dateFilter],
    queryFn: async () => {
      const response = await fetch(
        `/api/admin/payments?type=${typeFilter}&date=${dateFilter}`
      );
      if (!response.ok) throw new Error("Failed to fetch payments");
      return response.json();
    },
  });

  const filteredPayments = payments?.filter(
    (payment) =>
      payment.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.clubName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = filteredPayments?.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Transactions</h1>
        <p className="text-gray-600">View and manage all payment records</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <FaDollarSign className="text-3xl opacity-80" />
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              Total
            </span>
          </div>
          <h3 className="text-3xl font-bold mb-1">${totalRevenue?.toFixed(2) || 0}</h3>
          <p className="text-green-100 text-sm">Total Revenue</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FaDollarSign className="text-blue-600 text-xl" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {payments?.filter((p) => p.type === "membership").length || 0}
          </h3>
          <p className="text-gray-600 text-sm">Membership Payments</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <FaDollarSign className="text-purple-600 text-xl" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {payments?.filter((p) => p.type === "event").length || 0}
          </h3>
          <p className="text-gray-600 text-sm">Event Payments</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user or club..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="membership">Membership</option>
          <option value="event">Event</option>
        </select>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
        <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <FaDownload />
          Export
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Club/Event
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments?.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">
                    #{payment.transactionId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{payment.userEmail}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        payment.type === "membership"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {payment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{payment.clubName}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {payment.status}
                    </span>
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

export default ViewPayments;
