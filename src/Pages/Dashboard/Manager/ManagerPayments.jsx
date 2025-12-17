import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../api/axiosSecure";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";

const ManagerPayments = () => {
  const { user } = useContext(AuthContext);
  const managerEmail = user?.email;

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["managerPayments", managerEmail],
    enabled: !!managerEmail,
    queryFn: async () => {
      const res = await axiosSecure.get(`/manager/payments?managerEmail=${managerEmail}`);
      return res.data.payments;
    }
  });

  if (isLoading) {
    return <div className="flex justify-center py-20">Loading payments...</div>;
  }

  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-gray-600">All payments from your clubs & events</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold">Total Revenue</h2>
        <p className="text-3xl font-bold mt-2">৳{totalRevenue}</p>
      </div>

      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm">User</th>
              <th className="px-4 py-3 text-left text-sm">Club / Event</th>
              <th className="px-4 py-3 text-left text-sm">Type</th>
              <th className="px-4 py-3 text-left text-sm">Amount</th>
              <th className="px-4 py-3 text-left text-sm">Date</th>
              <th className="px-4 py-3 text-left text-sm">Tracking ID</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {payments.map((p) => (
              <tr key={p._id}>
                <td className="px-4 py-3 text-sm">{p.userEmail}</td>
                <td className="px-4 py-3 text-sm">{p.clubName || p.eventTitle}</td>
                <td className="px-4 py-3 text-sm capitalize">{p.type}</td>
                <td className="px-4 py-3 text-sm">৳{p.amount}</td>
                <td className="px-4 py-3 text-sm">
                  {new Date(p.paidAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm font-mono">{p.trackingId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerPayments;