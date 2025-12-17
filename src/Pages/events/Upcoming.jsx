import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import axiosPublic from "../../api/axiosPublic";
import { FaCalendarAlt, FaUsers, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Loading from "../../Components/Loading";

const UpcomingEventsTimeline = () => {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: async () => {
      const res = await axiosPublic.get("/events");
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading/>;
  }

  const upcomingEvents = events.filter(
    (event) => new Date(event.eventDate) > new Date()
  );

  const upcoming = upcomingEvents.slice(0,6)

  return (
    <div className="max-w-6xl bg-primary mx-auto px-6 py-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-16">
        <h2 className="text-4xl font-bold text-black">
          Find Out Ongoing Events This Week
        </h2>
        <Link
          to="/events"
          className="text-gray-700 font-semibold hover:underline"
        >
          SEE ALL EVENTS →
        </Link>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-1/2 top-0 h-full w-[2px] bg-gray-400 -translate-x-1/2" />

        <div className="space-y-20">
          {upcoming.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, x: 120 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
            >
              {/* Date Box (Left) */}
              <div className="lg:text-right lg:pr-16">
                <div className="inline-block bg-purple-300 text-white px-6 py-4 rounded-xl">
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
              <div className="bg-white p-8 rounded-2xl shadow-md  max-w-xl">
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
                    <FaMapMarkerAlt  className="text-red-400"/>
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
                    className="btn btn-info rounded-full px-8"
                  >
                    Join Event
                  </Link>

                  <Link
                    to={`/eventDetails/${event._id}`}
                    className="text-warning font-semibold hover:underline"
                  >
                    More Detail →
                  </Link>
                   
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-gray-800 h-[300px] bg-secondary/20 flex items-center justify-center">
  {event.location ? (
    <iframe
      title="Event Location"
      src={`https://www.google.com/maps?q=${encodeURIComponent(
          event.location
        )}&output=embed`}
      width="100%"
      height="80%"
      className="" // Optional "pro" styling
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
    />
  ) : (
    <div className="text-center p-4">
      <p className="text-sm opacity-50">Map location not provided</p>
    </div>
  )}
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
