import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosPublic from "../../api/axiosPublic";
import EventSidebar from "./EventSidebar";
import EventCard from "./EventCard";

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
        params: {
          ...filters,
          status: "upcoming",
        },
      });
      return res.data;
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-black">
          Upcoming Events
        </h1>
        <p className="text-gray-700 mt-2 max-w-2xl">
          Discover upcoming workshops, meetups, and conferences organized by clubs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <EventSidebar filters={filters} setFilters={setFilters} />
        </div>

        {/* Events */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <p className="text-center py-20">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-center text-gray-600 py-20">
              No events found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
