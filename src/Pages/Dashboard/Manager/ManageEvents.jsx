import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { FaPlus, FaEdit, FaTrash, FaUsers, FaCalendar, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axiosSecure from "../../../api/axiosSecure"; // your axios instance

const ManageEvents = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [selectedClub, setSelectedClub] = useState("all");

  // Fetch manager's clubs
  const { data: clubs } = useQuery({
    queryKey: ["managerClubs", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/manager/clubs?email=${user?.email}`);
      return res.data;
    },
  });

  // Fetch manager's events
  const { data: events, isLoading } = useQuery({
    queryKey: ["managerEvents", user?.email, selectedClub],
    queryFn: async () => {
      let url = `/manager/events?email=${user?.email}`;
      if (selectedClub !== "all") url += `&club=${selectedClub}`;
      const res = await axiosSecure.get(url);
      return res.data;
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId) => {
      const res = await axiosSecure.delete(`/events/${eventId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["managerEvents", user?.email, selectedClub]);
      toast.success("Event deleted successfully");
    },
    onError: () => toast.error("Failed to delete event"),
  });

  const handleDeleteEvent = (eventId) => {
    // if (toast.confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      deleteEventMutation.mutate(eventId);
    //}
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
//console.log(events);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Events</h1>
          <p className="text-gray-600">Create and manage events for your clubs</p>
        </div>
        <Link
          to="/dashboard/manager/events/create"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FaPlus />
          Create Event
        </Link>
      </div>

      {/* Club Filter */}
      {/* <div className="mb-6">
        <select
          value={selectedClub}
          onChange={(e) => setSelectedClub(e.target.value)}
          required
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Select a Club</option>
          {clubs?.map((club) => (
            <option key={club._id} value={club._id}>
              {club.clubName}
            </option>
          ))}
        </select>
      </div> */}

      {/* Events Grid */}
      {events?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h3>
                    <p className="text-sm text-blue-600 font-medium">{event.clubName}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/dashboard/manager/editEvent/${event._id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDeleteEvent(event._id, event.title)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCalendar className="text-gray-400" />
                    <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaUsers className="text-gray-400" />
                    <span>
                      {event.registeredCount || 0} / {event.maxAttendees} registered
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    {event.isPaid && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        ${event.eventFee}
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        new Date(event.eventDate) > new Date()
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {new Date(event.eventDate) > new Date() ? "Upcoming" : "Past"}
                    </span>
                  </div>
                  <Link
                    to={`/dashboard/manager/eventRegistrations/${event._id}`}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Registrations
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCalendar className="text-4xl text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Events Yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first event to engage with your club members
          </p>
          <Link
            to="/dashboard/manager/events/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            Create Your First Event
          </Link>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
