import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  return (
    <Link to={`/eventDetails/${event._id}`}>
      <div className="bg-white border rounded-xl p-6 hover:shadow-md transition">
        <h3 className="text-xl font-bold text-black mb-2">
          {event.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-400" />
            {new Date(event.eventDate).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-400" />
            {event.location}
          </div>

          {event.maxAttendees && (
            <div className="flex items-center gap-2">
              <FaUsers className="text-gray-400" />
              {event.maxAttendees} attendees
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center">
          {event.isPaid ? (
            <span className="text-sm font-semibold text-gray-700">
              ৳{event.eventFee}
            </span>
          ) : (
            <span className="text-sm font-semibold text-green-600">
              Free
            </span>
          )}

          <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
            Upcoming
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
