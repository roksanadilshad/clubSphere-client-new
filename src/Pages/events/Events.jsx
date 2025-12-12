import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { FaCalendar, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import toast from "react-hot-toast";
import axiosPublic from "../../api/axiosPublic";
import { AuthContext } from "../../Context/AuthContext";

const EventsPage = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Fetch all events
  const { data: events, isLoading, error } = useQuery({
    queryKey: ["publicEvents"],
    queryFn: async () => {
      const res = await axiosPublic.get("/events");
      return res.data;
    },
  });

  // Register mutation
  const registerMutation = useMutation({
  mutationFn: async ({ _id, eventName, clubName, userEmail }) => {
    const res = await axiosPublic.post(`/events/${_id}/register`, {
      eventId: eventName,  // name of event
      clubId: clubName,    // name of club
      userEmail,
    });
    return res.data;
  },
  onSuccess: () => {
    toast.success("Successfully registered for the event!");
    queryClient.invalidateQueries(["publicEvents"]); // refresh events
  },
  onError: (err) => {
    toast.error(err.response?.data?.message || "Failed to register");
  },
});


  const handleRegister = (event) => {
  if (!user) return toast.error("Please log in to register for events");

  registerMutation.mutate({
    _id: event._id,              // event _id for URL
    eventName: event.title,      // store event name
    clubName: event.clubName || event.clubId, // fallback to ID if name missing
    userEmail: user.email,
  });
};


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">Failed to load events.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">All Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event) => {
          const eventPassed = new Date(event.eventDate) < new Date();
          const isFull = event.registrations >= event.maxAttendees;

          return (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{event.description}</p>

                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-gray-400" />
                    <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                  {event.maxAttendees && (
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-gray-400" />
                      <span>{event.registrations || 0} / {event.maxAttendees} registered</span>
                    </div>
                  )}
                  {event.isPaid && (
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        ${event.eventFee}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleRegister(event)}
                  disabled={eventPassed || isFull}
                  className={`w-full px-4 py-2 rounded-lg font-semibold text-white ${
                    eventPassed || isFull
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isFull ? "Full" : eventPassed ? "Event Passed" : "Register"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {events?.length === 0 && (
        <div className="text-center mt-12">
          <p className="text-gray-600">No events available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
