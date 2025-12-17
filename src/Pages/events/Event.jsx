import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarPlus, FaFilter, FaSearch } from "react-icons/fa";
import axiosPublic from "../../api/axiosPublic";
import EventSidebar from "./EventSidebar";
import EventCard from "./EventCard";
import Loading from "../../Components/Loading";

const EventsPage = () => {
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    sort: "date-desc",
  });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events", filters],
    queryFn: async () => {
      const res = await axiosPublic.get("/api/events", {
        params: { ...filters, status: "upcoming" },
      });
      return res.data;
    },
  });

  //if(isLoading) return <Loading/>

  return (
    <div className="bg-base-100 min-h-screen">
      {/* 1. Dynamic Hero Section */}
      <section className="bg-neutral text-neutral-content py-20 px-6 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/10 rounded-full -ml-20 -mb-20 blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-center gap-8"
          >
            <div className="text-center md:text-left">
              <span className="badge text-gray-600 badge-primary font-bold px-4 py-3 mb-4">DISCOVER</span>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 uppercase">
                Explore <span className="text-primary">Events</span>
              </h1>
              <p className="text-lg opacity-70 max-w-xl">
                From tech hackathons to art galleries, find the next experience that will define your year.
              </p>
            </div>
            <div className="hidden lg:block">
               <FaCalendarPlus className="text-9xl text-primary/20 rotate-12" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Professional Sidebar Filter */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <FaFilter className="text-primary" />
                <h3 className="font-black text-lg uppercase tracking-wider">Refine Search</h3>
              </div>
              <div className="bg-base-200/50 p-6 rounded-3xl border border-base-300 backdrop-blur-sm">
                <EventSidebar filters={filters} setFilters={setFilters} />
              </div>
            </div>
          </aside>

          {/* Events Display Area */}
          <main className="lg:col-span-3">
            {/* Search Stats */}
            <div className="flex justify-between items-center mb-8 border-b border-base-200 pb-4">
               <h2 className="font-bold text-xl opacity-60">
                 {isLoading ? "Fetching..." : `${events.length} Upcoming Events`}
               </h2>
               <div className="hidden md:flex gap-2">
                 <div className="badge badge-ghost capitalize">{filters.category}</div>
                 <div className="badge badge-ghost uppercase">{filters.sort.replace('-', ' ')}</div>
               </div>
            </div>

            {isLoading ? (
              // 3. Skeleton Loader
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="flex flex-col gap-4 w-full">
                    <div className="skeleton h-64 w-full rounded-3xl"></div>
                    <div className="skeleton h-6 w-28"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                  </div>
                ))}
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {events.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 bg-base-200/30 rounded-[3rem] border-2 border-dashed border-base-300"
                  >
                    <FaSearch className="text-5xl opacity-20 mb-4" />
                    <h3 className="text-2xl font-bold">No events found</h3>
                    <p className="opacity-50">Try resetting your filters or search terms.</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    {events.map((event, idx) => (
                      <motion.div
                        key={event._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <EventCard event={event} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;