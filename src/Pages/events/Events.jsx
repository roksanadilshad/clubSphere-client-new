import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import axiosPublic from "../../api/axiosPublic";
import { FaCalendarAlt, FaUsers, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const UpcomingEventsTimeline = () => {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: async () => {
      const res = await axiosPublic.get("/events");
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-20">Loading events...</div>;
  }

  const upcomingEvents = events.filter(
    (event) => new Date(event.eventDate) > new Date()
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-16">
        <h2 className="text-4xl font-bold text-black">
          Find Out Ongoing Events This Week
        </h2>
        <Link
          to="/events"
          className="text-primary font-semibold hover:underline"
        >
          SEE ALL EVENTS →
        </Link>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-1/2 top-0 h-full w-[2px] bg-gray-300 -translate-x-1/2" />

        <div className="space-y-20">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, x: 120 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"
            >
              {/* Date Box (Left) */}
              <div className="lg:text-right lg:pr-16">
                <div className="inline-block bg-primary text-white px-6 py-4 rounded-xl">
                  <p className="font-semibold">
                    {new Date(event.eventDate).toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </p>
                  <p className="text-sm opacity-90">
                    {new Date(event.eventDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Timeline Dot */}
              <span className="absolute left-1/2 top-6 w-5 h-5 bg-white border-4 border-primary rounded-full -translate-x-1/2 z-10" />

              {/* Event Card (Right) */}
              <div className="bg-white p-8 rounded-2xl shadow-md border max-w-xl">
                <p className="text-sm text-gray-500 mb-2">
                  09:00 AM – 05:00 PM
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {event.title}
                </h3>

                <p className="text-gray-600 mb-4">
                  {event.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                  <span className="flex items-center gap-2">
                    <FaMapMarkerAlt />
                    {event.location}
                  </span>

                  {event.maxAttendees && (
                    <span className="flex items-center gap-2">
                      <FaUsers />
                      Max {event.maxAttendees} participants
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-6">
                  <Link
                    to={`/eventDetails/${event._id}`}
                    className="btn btn-primary rounded-full px-8"
                  >
                    Join Event
                  </Link>

                  <Link
                    to={`/eventDetails/${event._id}`}
                    className="text-primary font-semibold hover:underline"
                  >
                    More Detail →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventsTimeline;
