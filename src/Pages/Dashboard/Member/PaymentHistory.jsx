import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { FaDownload, FaReceipt, FaFilter, FaArrowRight, FaCreditCard } from "react-icons/fa";
import axiosSecure from "../../../api/axiosSecure";

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["paymentHistory", user?.email, typeFilter],
    enabled: !!user?.email,
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/payments?email=${user?.email}&type=${typeFilter}`
      );
      return response.data;
    },
  });

  const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="loading loading-spinner loading-lg text-blue-600"></div>
        <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Encrypting Ledger...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Finances</h1>
          <p className="text-slate-500 font-medium">Tracking your investments in the community</p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <FaFilter className="text-slate-400 ml-2" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-transparent text-sm font-bold text-slate-700 outline-none pr-4 cursor-pointer"
          >
            <option value="all">All Records</option>
            <option value="membership">Memberships</option>
            <option value="event">Events</option>
          </select>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-200/20">
          <div className="absolute right-[-10%] top-[-20%] w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
          <FaCreditCard className="text-blue-500/40 text-4xl mb-6" />
          <h3 className="text-4xl font-black mb-1">${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Aggregate Expenditure</p>
        </div>
        
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-center">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Membership Fees</p>
            <h3 className="text-3xl font-black text-slate-800">
                {payments.filter(p => p.type === "membership").length} 
                <span className="text-sm font-bold text-slate-300 ml-2">Trans.</span>
            </h3>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-center">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Event Bookings</p>
            <h3 className="text-3xl font-black text-slate-800">
                {payments.filter(p => p.type === "event").length}
                <span className="text-sm font-bold text-slate-300 ml-2">Trans.</span>
            </h3>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Reference / Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Details</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map((payment) => (
                <tr key={payment._id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1">
                        #{payment.transactionId?.slice(-8).toUpperCase() || "REF-ID"}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                        {new Date(payment.paidAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </td>
                  
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      payment.type === "membership" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                    }`}>
                      {payment.type}
                    </span>
                  </td>

                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-700 leading-tight">
                        {payment.type === "event" ? payment.eventTitle : payment.clubName}
                    </p>
                    <p className="text-[11px] font-medium text-slate-400 mt-1">${payment.amount.toFixed(2)} USD</p>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">
                            {payment.paymentStatus}
                        </span>
                    </div>
                  </td>

                  <td className="px-8 py-6 text-right">
                    <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                      <FaDownload size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {payments.length === 0 && (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaReceipt className="text-3xl text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Clear Ledger</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8">You haven't made any transactions yet. Join a club or register for an event to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;