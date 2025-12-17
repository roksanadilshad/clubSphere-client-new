import { useQuery } from "@tanstack/react-query";
import { data, useParams } from "react-router-dom";
import { useState } from "react";
import { FaSearch, FaEnvelope, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axiosSecure from "../../../api/axiosSecure";

const EventRegistrations = () => {
  const { eventId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch event details
  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/events/${eventId}`);
      return res.data;
    },
    enabled: !!eventId, // only fetch if eventId exists
  });

  // Fetch registrations
  const { data: registrations = [], isLoading: regLoading } = useQuery({
    queryKey: ["eventRegistrations", eventId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/events/${eventId}/registrations`);
      return res.data;
    },
    enabled: !!eventId,
  });
  //console.log(registrations);

  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeRegistrations = registrations.filter((r) => r.status === "registered").length;

  if (eventLoading || regLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
//console.log(event);
console.log(filteredRegistrations);
console.log("ALL REGISTRATIONS:", registrations);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Event Registrations</h1>
        <p className="text-gray-600">{event?.title || "Event Title"}</p>
      </div>

      {/* Event Info Card */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl p-6 text-white mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-blue-100 text-sm mb-1">Total Registered</p>
            <p className="text-3xl font-bold">{activeRegistrations}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Max Attendees</p>
            <p className="text-3xl font-bold">{event?.maxAttendees || "∞"}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Event Date</p>
            <p className="text-lg font-semibold">
              {event?.eventDate ? new Date(event.eventDate).toLocaleDateString() : "-"}
            </p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Revenue</p>
            <p className="text-3xl font-bold">
              ${((event?.eventFee || 0) * activeRegistrations).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search registrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Attendee</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Registered</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRegistrations.map((reg) => (
                <tr key={reg._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={reg.userPhoto || "https://via.placeholder.com/40"}
                        alt={reg.userName || reg.userEmail}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="font-medium text-gray-900">{reg.userName || "Anonymous"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                    <FaEnvelope className="text-gray-400" /> {reg.userEmail}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        reg.status === "registered"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {reg.status === "registered" ? <FaCheckCircle /> : <FaTimesCircle />}
                      {reg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {reg.registeredAt ? new Date(reg.registeredAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4">
                    {event?.isPaid ? (
                      <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        ${event.eventFee}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">Free</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRegistrations.length === 0 && (
        <p className="text-gray-500 mt-6 text-center">No registrations found.</p>
      )}
    </div>
  );
};

export default EventRegistrations;
