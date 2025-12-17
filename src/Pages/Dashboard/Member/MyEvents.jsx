import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { FaCalendar, FaMapMarkerAlt, FaClock, FaTicketAlt } from "react-icons/fa";
import { Link } from "react-router";
import axiosSecure from "../../../api/axiosSecure";
import Login from "../../Login";

const MyEvents = () => {
  const { user } = useContext(AuthContext);

  // Fetch user's events
  const { data: events, isLoading } = useQuery({
    queryKey: ["myEvents", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const response = await axiosSecure.get(`/member/events?email=${user?.email}`);
      return response.data
    },
  });

 const upcomingEvents = events?.filter(e => e.date && new Date(e.date) > new Date());
const pastEvents = events?.filter(e => e.date && new Date(e.date) <= new Date());




 //console.log("Events fetched:", events);
// events?.forEach(e => console.log(e.title, e.date, new Date(e.date)));


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
//console.log(upcomingEvents);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
        <p className="text-gray-600">Events you've registered for</p>
      </div>

      {/* Upcoming Events */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Total Events {events.length}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events?.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs text-blue-600 font-semibold">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium">{event.clubName}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaClock className="text-gray-400" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.status === "registered"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {event.status}
                    </span>
                    {event.isPaid && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        ${event.eventFee}
                      </span>
                    )}
                  </div>
                  {/* <Link
                    
                   to={`/eventDetails/${event.id}`}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {upcomingEvents?.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Upcoming Events
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't registered for any upcoming events yet
            </p>
            <Link
              to="/events"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Events
            </Link>
          </div>
        )}
      </div>

      {/* Past Events */}
      {pastEvents?.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Events</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {pastEvents?.map((event) => (
                <div
                  key={event.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-xs text-gray-600 font-semibold">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                          })}
                        </span>
                        <span className="text-lg font-bold text-gray-600">
                          {new Date(event.date).getDate()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.clubName}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      Attended
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
