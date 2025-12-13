import { useQuery } from "@tanstack/react-query";
import { FaCalendar, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import axiosPublic from "../../api/axiosPublic";
import { Link } from "react-router-dom";

const EventsPage = () => {
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ["publicEvents"],
    queryFn: async () => {
      const res = await axiosPublic.get("/events");
      return res.data;
    },
  });

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
        {events.map((event) => (
          <Link
            key={event._id}
            to={`/eventDetails/${event._id}`}
            className="block"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {event.title}
                </h3>

                <p className="text-sm text-gray-600 mb-2">
                  {event.description}
                </p>

                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-gray-400" />
                    <span>
                      {new Date(event.eventDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>{event.location}</span>
                  </div>

                  {event.maxAttendees && (
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-gray-400" />
                      <span>{event.maxAttendees} max attendees</span>
                    </div>
                  )}

                  {event.isPaid && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      ${event.eventFee}
                    </span>
                  )}
                </div>

                <div
                  className={`px-3 py-1 inline-block rounded-full text-xs font-medium ${
                    new Date(event.eventDate) > new Date()
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {new Date(event.eventDate) > new Date()
                    ? "Upcoming"
                    : "Past"}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center mt-12">
          <p className="text-gray-600">No events available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
