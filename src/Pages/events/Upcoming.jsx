import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import axiosPublic from "../../api/axiosPublic";
import { FaUsers, FaMapMarkerAlt, FaArrowRight, FaClock } from "react-icons/fa";
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

  if (isLoading) return <Loading />;

  const upcoming = events
    .filter((event) => new Date(event.eventDate) > new Date())
    .slice(0, 6);

  return (
    <section className="relative bg-slate-50 overflow-hidden py-24">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
              Weekly <span className="text-primary">Event</span> Briefing
            </h2>
            <p className="text-lg text-slate-600">
              Stay ahead of the curve. Join the most influential workshops and 
              gatherings happening in your community this week.
            </p>
          </div>
          <Link
            to="/events"
            className="group flex items-center gap-2 font-bold text-primary hover:text-slate-900 transition-colors uppercase tracking-widest text-sm"
          >
            Explore All Events <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {/* Timeline Implementation */}
        <div className="relative">
          {/* Central Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 via-secondary/50 to-transparent -translate-x-1/2" />

          <div className="space-y-16 md:space-y-24">
            {upcoming.map((event, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-center justify-between ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* 1. Date Indicator Section */}
                  <div className="w-full md:w-[45%] mb-8 md:mb-0">
                    <div className={`${!isEven ? "md:text-right" : "md:text-left"}`}>
                      <div className="inline-flex flex-col bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
                        <span className="bg-primary text-white px-6 py-2 text-xs font-black uppercase tracking-tighter">
                          {new Date(event.eventDate).toLocaleDateString("en-US", { weekday: "long" })}
                        </span>
                        <div className="px-6 py-4">
                           <p className="text-3xl font-black text-slate-900">
                             {new Date(event.eventDate).getDate()}
                           </p>
                           <p className="text-xs font-bold text-slate-400 uppercase">
                             {new Date(event.eventDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                           </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Central Dot */}
                  <div className="absolute left-4 md:left-1/2 w-10 h-10 bg-white border-4 border-primary rounded-full -translate-x-1/2 z-20 shadow-lg hidden md:flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                  </div>

                  {/* 3. Event Details Card */}
                  <div className="w-full md:w-[45%] pl-12 md:pl-0">
                    <div className="group bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 hover:border-primary/30 transition-all duration-500">
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">
                        <span className="flex items-center gap-1 text-primary"><FaClock /> 09:00 AM</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-red-400" /> {event.location}</span>
                      </div>

                      <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>

                      <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                        {event.description}
                      </p>

                      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <FaUsers className="text-primary" />
                          <span>{event.maxAttendees || "50+"} Spots</span>
                        </div>
                        <Link
                          to={`/eventDetails/${event._id}`}
                          className="px-6 py-3 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-primary transition-all shadow-lg shadow-slate-900/20 active:scale-95"
                        >
                          JOIN NOW
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEventsTimeline;