import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaInfoCircle, FaArrowLeft, FaDollarSign } from "react-icons/fa";
import toast from "react-hot-toast";
import axiosSecure from "../../../api/axiosSecure";
import { AuthContext } from "../../../Context/AuthContext";

const EditEvent = () => {
  const { user } = useContext(AuthContext);
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [eventData, setEventData] = useState({
    clubId: "",
    title: "",
    description: "",
    eventDate: "",
    location: "",
    isPaid: false,
    eventFee: 0,
    maxAttendees: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clubsRes, eventRes] = await Promise.all([
          axiosSecure.get(`/manager/clubs?email=${user?.email}`),
          axiosSecure.get(`/events/${eventId}`)
        ]);
        
        setClubs(clubsRes.data);
        const event = eventRes.data;
        setEventData({
          clubId: event.clubId || "",
          title: event.title || "",
          description: event.description || "",
          eventDate: event.eventDate ? event.eventDate.split("T")[0] : "",
          location: event.location || "",
          isPaid: event.isPaid || false,
          eventFee: event.eventFee || 0,
          maxAttendees: event.maxAttendees || 0,
        });
      } catch (err) {
        toast.error("Failed to sync event records");
      } finally {
        setInitialLoading(false);
      }
    };
    if (user?.email && eventId) fetchData();
  }, [user, eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosSecure.put(`/events/${eventId}`, eventData);
      toast.success("Event updated in the cloud");
      navigate("/dashboard/manager/events");
    } catch (err) {
      toast.error("Update failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Metadata...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Navigation Header */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest mb-6 transition-colors"
      >
        <FaArrowLeft /> Return to Events
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-8 md:p-12">
          <header className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Refine <span className="text-blue-600">Event</span></h1>
            <p className="text-slate-500 font-medium">Modify schedules, capacity, or ticketing details.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Identity */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-blue-600 mb-4">
                <FaInfoCircle />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Core Identity</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Hosting Organization</label>
                  <select
                    value={eventData.clubId}
                    onChange={(e) => setEventData({ ...eventData, clubId: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20"
                    required
                  >
                    <option value="">Choose Club</option>
                    {clubs.map((club) => (
                      <option key={club._id} value={club._id}>{club.clubName}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Event Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. Annual Tech Summit"
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20"
                    value={eventData.title}
                    onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Context & Description</label>
                <textarea
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-medium text-slate-700 focus:ring-2 focus:ring-blue-500/20 min-h-[120px]"
                  value={eventData.description}
                  onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                  required
                />
              </div>
            </section>

            {/* Section 2: Logistics */}
            <section className="space-y-6 pt-6 border-t border-slate-50">
               <div className="flex items-center gap-2 text-blue-600 mb-4">
                <FaCalendarAlt />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Logistics & Capacity</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-1">
                    <FaCalendarAlt size={10}/> Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20"
                    value={eventData.eventDate}
                    onChange={(e) => setEventData({ ...eventData, eventDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-1">
                    <FaMapMarkerAlt size={10}/> Venue / Location
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20"
                    value={eventData.location}
                    onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                    required
                  />
                </div>
              </div>
            </section>

            {/* Section 3: Ticketing */}
            <section className="p-6 bg-slate-50 rounded-3xl space-y-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-800">
                    <FaDollarSign />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Ticketing Model</h2>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={eventData.isPaid}
                        onChange={(e) => setEventData({ ...eventData, isPaid: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-[10px] font-black uppercase text-slate-500 tracking-widest">{eventData.isPaid ? 'Paid' : 'Free Entry'}</span>
                  </label>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`space-y-2 transition-opacity duration-300 ${!eventData.isPaid ? 'opacity-30 pointer-events-none' : ''}`}>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Admission Fee (৳)</label>
                    <input
                        type="number"
                        className="w-full bg-white border-none rounded-2xl px-5 py-4 font-black text-blue-600 focus:ring-2 focus:ring-blue-500/20"
                        value={eventData.eventFee}
                        onChange={(e) => setEventData({ ...eventData, eventFee: parseFloat(e.target.value) })}
                        disabled={!eventData.isPaid}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-1">
                        <FaUsers size={10}/> Global Capacity
                    </label>
                    <input
                        type="number"
                        className="w-full bg-white border-none rounded-2xl px-5 py-4 font-black text-slate-700 focus:ring-2 focus:ring-blue-500/20"
                        value={eventData.maxAttendees}
                        onChange={(e) => setEventData({ ...eventData, maxAttendees: parseInt(e.target.value) })}
                        required
                    />
                  </div>
               </div>
            </section>

            <button
              type="submit"
              className={`w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Syncing Changes..." : "Push Updates to Live"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;