import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { FaDownload, FaReceipt, FaFilter } from "react-icons/fa";

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const [typeFilter, setTypeFilter] = useState("all");

  // Fetch payment history
  const { data: payments, isLoading } = useQuery({
    queryKey: ["paymentHistory", user?.email, typeFilter],
    queryFn: async () => {
      const response = await fetch(
        `/api/member/payments?email=${user?.email}&type=${typeFilter}`
      );
      if (!response.ok) throw new Error("Failed to fetch payments");
      return response.json();
    },
  });

  const totalSpent = payments?.reduce((sum, p) => sum + p.amount, 0);

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment History</h1>
        <p className="text-gray-600">View all your transactions and receipts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h3 className="text-3xl font-bold mb-1">${totalSpent?.toFixed(2) || 0}</h3>
          <p className="text-blue-100 text-sm">Total Spent</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {payments?.filter((p) => p.type === "membership").length || 0}
          </h3>
          <p className="text-sm text-gray-600">Membership Payments</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {payments?.filter((p) => p.type === "event").length || 0}
          </h3>
          <p className="text-sm text-gray-600">Event Payments</p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6 flex items-center gap-4">
        <FaFilter className="text-gray-400" />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Payments</option>
          <option value="membership">Memberships</option>
          <option value="event">Events</option>
        </select>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Receipt
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments?.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
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
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {payment.clubName}
                      </p>
                      <p className="text-xs text-gray-500">{payment.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <FaDownload />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {payments?.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <FaReceipt className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Payments Yet</h3>
          <p className="text-gray-600">Your payment history will appear here</p>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
