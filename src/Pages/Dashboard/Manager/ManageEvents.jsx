import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { FaPlus, FaEdit, FaTrash, FaUsers, FaCalendar, FaMapMarkerAlt, FaFilter, FaTicketAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axiosSecure from "../../../api/axiosSecure";

const ManageEvents = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [selectedClub, setSelectedClub] = useState("all");

  const { data: clubs } = useQuery({
    queryKey: ["managerClubs", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/manager/clubs?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["managerEvents", user?.email, selectedClub],
    queryFn: async () => {
      let url = `/manager/events?email=${user?.email}`;
      if (selectedClub !== "all") url += `&club=${selectedClub}`;
      const res = await axiosSecure.get(url);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId) => {
      const res = await axiosSecure.delete(`/events/${eventId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["managerEvents", user?.email, selectedClub]);
      toast.success("Event permanently removed");
    },
    onError: () => toast.error("Operational failure: Could not delete event"),
  });

  const handleDeleteEvent = (eventId, eventTitle) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-slate-800">
          Delete <b>{eventTitle}</b>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button 
            className="px-3 py-1 text-xs bg-slate-100 rounded-md" 
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button 
            className="px-3 py-1 text-xs bg-red-600 text-white rounded-md" 
            onClick={() => {
              deleteEventMutation.mutate(eventId);
              toast.dismiss(t.id);
            }}
          >
            Confirm Delete
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="loading loading-bars loading-lg text-blue-600"></div>
        <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing Event Calendars...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-2">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Events <span className="text-blue-600">Studio</span></h1>
          <p className="text-slate-500 font-medium">Coordinate, track, and scale your club gatherings</p>
        </div>
        <Link
          to="/dashboard/manager/events/create"
          className="btn btn-primary text-gray-700 shadow-lg shadow-blue-200 rounded-2xl normal-case h-14 px-8"
        >
          <FaPlus />
          Create New Event
        </Link>
      </header>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm mb-8 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-slate-400 px-4 border-r border-slate-100">
          <FaFilter size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">Filter By Club</span>
        </div>
        <select
          value={selectedClub}
          onChange={(e) => setSelectedClub(e.target.value)}
          className="select select-ghost select-sm font-bold text-slate-700 focus:bg-transparent"
        >
          <option value="all">All Organizations</option>
          {clubs?.map((club) => (
            <option key={club._id} value={club._id}>{club.clubName}</option>
          ))}
        </select>
      </div>

      {/* Events Grid */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {events.map((event) => {
            const isUpcoming = new Date(event.eventDate) > new Date();
            const fillRate = (event.registeredCount / event.maxAttendees) * 100;

            return (
              <div key={event._id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{event.clubName}</span>
                      <h3 className="text-2xl font-black text-slate-800 group-hover:text-blue-600 transition-colors tracking-tight">{event.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/dashboard/manager/editEvent/${event._id}`} className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <FaEdit size={16} />
                      </Link>
                      <button onClick={() => handleDeleteEvent(event._id, event.title)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-3 text-slate-500 bg-slate-50/50 p-3 rounded-2xl">
                      <FaCalendar className="text-blue-500" />
                      <span className="text-xs font-bold">{new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 bg-slate-50/50 p-3 rounded-2xl">
                      <FaMapMarkerAlt className="text-rose-500" />
                      <span className="text-xs font-bold truncate">{event.location}</span>
                    </div>
                  </div>

                  {/* Capacity Analytics */}
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                        <FaUsers /> Capacity Engagement
                      </p>
                      <p className="text-xs font-black text-slate-800">{event.registeredCount} / {event.maxAttendees}</p>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                      <div 
                        className={`h-full transition-all duration-1000 ${fillRate > 90 ? 'bg-rose-500' : 'bg-blue-600'}`} 
                        style={{ width: `${fillRate}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      {event.isPaid ? (
                        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100">
                          <FaTicketAlt /> ৳{event.eventFee}
                        </div>
                      ) : (
                        <div className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">Free</div>
                      )}
                      <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${
                        isUpcoming ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                      }`}>
                        {isUpcoming ? "Live" : "Ended"}
                      </div>
                    </div>
                    
                    <Link
                      to={`/dashboard/manager/eventRegistrations/${event._id}`}
                      className="group/btn flex items-center gap-2 text-xs font-black text-slate-800 hover:text-blue-600 transition-colors uppercase tracking-widest"
                    >
                      Audience List <FaPlus className="group-hover/btn:rotate-90 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100 mt-10">
          <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-bounce">
            <FaCalendar size={40} className="text-blue-600" />
          </div>
          <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">The Stage is Empty</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium">Your calendar is currently clear. Start by hosting a workshop, meet-up, or tournament to energize your members.</p>
          <Link
            to="/dashboard/manager/events/create"
            className="btn btn-primary px-10 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-200"
          >
            Draft First Event
          </Link>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;