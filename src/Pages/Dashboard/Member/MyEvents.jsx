import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaHistory, FaArrowRight, FaTicketAlt } from "react-icons/fa";
import { Link } from "react-router";
import axiosSecure from "../../../api/axiosSecure";
import { motion, AnimatePresence } from "framer-motion";

const MyEvents = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("upcoming");

  //console.log(user);
  
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["myEvents", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const response = await axiosSecure.get(`/member/events?email=${user?.email}`);
      return response.data;
    },
  });


  // Precise filtering logic
  const now = new Date();
  const upcomingEvents = events.filter(e => e.date && new Date(e.date) > now);
  const pastEvents = events.filter(e => e.date && new Date(e.date) <= now);
  const displayedEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 mb-4"></div>
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Loading your schedule...</p>
      </div>
    );
  }
//console.log(events);
//console.log(displayedEvents);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Event <span className="text-blue-600">Pass</span></h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-[0.3em]">Managed Registrations & Access</p>
        </div>
        
        {/* Tab Controls */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
          <button 
            onClick={() => setActiveTab("upcoming")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "upcoming" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Upcoming ({upcomingEvents.length})
          </button>
          <button 
            onClick={() => setActiveTab("past")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "past" ? "bg-white text-slate-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            History ({pastEvents.length})
          </button>
        </div>
      </div>

      {/* Grid Display */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {displayedEvents.length > 0 ? (
            displayedEvents.map((event) => (
              <div key={event.id} className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col md:flex-row">
                {/* Left Side: Date Banner */}
                <div className={`w-full md:w-32 flex flex-col items-center justify-center p-6 text-white transition-colors ${
                  activeTab === "upcoming" ? "bg-gradient-to-br from-blue-600 to-indigo-700" : "bg-slate-400"
                }`}>
                  <span className="text-xs font-black uppercase tracking-tighter opacity-80">
                    {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                  </span>
                  <span className="text-4xl font-black leading-none my-1">
                    {new Date(event.date).getDate()}
                  </span>
                  <span className="text-[10px] font-bold opacity-60">
                    {new Date(event.date).getFullYear()}
                  </span>
                  <FaTicketAlt className="mt-4 opacity-20 text-2xl" />
                </div>

                {/* Right Side: Details */}
                <div className="flex-1 p-8">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h3>
                  </div>
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-4">
                    Organized by: {event.clubName}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                        <FaClock size={14} />
                      </div>
                      {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                        <FaMapMarkerAlt size={14} />
                      </div>
                      {event.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex gap-2">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                        event.status === "registered" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-50 text-slate-400"
                       }`}>
                         {event.status}
                       </span>
                       {event.eventFee > 0 && (
                        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                          Paid: ${event.eventFee}
                        </span>
                       )}
                    </div>
                    {/* <Link to={`/eventDetails/${event.id}`} className="text-slate-300 hover:text-blue-600 transition-colors">
                       <FaArrowRight />
                    </Link> */}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center">
              <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                {activeTab === "upcoming" ? <FaCalendarAlt className="text-slate-200 text-4xl" /> : <FaHistory className="text-slate-200 text-4xl" />}
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">No events found</h3>
              <p className="text-slate-400 font-medium mb-8">It looks like your schedule is empty here.</p>
              <Link to="/events" className="btn btn-primary rounded-2xl px-8 shadow-xl shadow-blue-200">
                Explore Events
              </Link>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MyEvents;