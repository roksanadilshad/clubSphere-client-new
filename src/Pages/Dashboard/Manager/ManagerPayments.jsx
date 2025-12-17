import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { FaSearch, FaFileInvoiceDollar, FaCalendarDay, FaArrowRight } from "react-icons/fa";
import axiosSecure from "../../../api/axiosSecure";

const ManagerPayments = () => {
  const { user } = useContext(AuthContext);
  const managerEmail = user?.email;
  const [searchTerm, setSearchTerm] = useState("");

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["managerPayments", managerEmail],
    enabled: !!managerEmail,
    queryFn: async () => {
      const res = await axiosSecure.get(`/manager/payments?managerEmail=${managerEmail}`);
      return res.data.payments;
    }
  });

  const filteredPayments = payments.filter(p => 
    p.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.trackingId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const membershipRev = payments.filter(p => p.type === "membership").reduce((sum, p) => sum + p.amount, 0);
  const eventRev = payments.filter(p => p.type === "event").reduce((sum, p) => sum + p.amount, 0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Syncing Financial Records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Financial <span className="text-blue-600">Ledger</span></h1>
          <p className="text-slate-500 font-medium">Audit and manage all incoming revenue streams</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search email or Tracking ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* Financial Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-900/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
              <FaFileInvoiceDollar />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Net Revenue</p>
          </div>
          <h2 className="text-4xl font-black tracking-tighter">৳{totalRevenue.toLocaleString()}</h2>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Memberships</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-slate-800">৳{membershipRev.toLocaleString()}</h3>
            <span className="text-blue-600 font-bold text-xs bg-blue-50 px-3 py-1 rounded-lg">{( (membershipRev/totalRevenue) * 100 || 0).toFixed(0)}%</span>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Event Tickets</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-slate-800">৳{eventRev.toLocaleString()}</h3>
            <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1 rounded-lg">{( (eventRev/totalRevenue) * 100 || 0).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">User / Identity</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Source</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Tracking ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPayments.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-800 mb-0.5">{p.userEmail.split('@')[0]}</p>
                    <p className="text-[10px] font-medium text-slate-400">{p.userEmail}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-700 leading-tight">
                        {p.clubName || p.eventTitle}
                    </p>
                    <p className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase mt-1">
                        <FaCalendarDay size={8} /> {new Date(p.paidAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      p.type === "membership" 
                      ? "bg-indigo-50 text-indigo-600 border-indigo-100" 
                      : "bg-blue-50 text-blue-600 border-blue-100"
                    }`}>
                      {p.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-slate-900 text-sm">৳{p.amount.toLocaleString()}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                            {p.trackingId}
                        </span>
                        <button className="text-slate-200 hover:text-blue-600 transition-colors">
                            <FaArrowRight size={12} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="py-20 text-center">
            <FaFileInvoiceDollar className="text-4xl text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerPayments;