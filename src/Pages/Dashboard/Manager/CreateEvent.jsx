import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { FaCalendarPlus, FaMapMarkerAlt, FaUsers, FaInfoCircle, FaDollarSign, FaLayerGroup } from "react-icons/fa";
import axiosSecure from "../../../api/axiosSecure";
import { AuthContext } from "../../../Context/AuthContext";

const CreateEvent = () => {
  const { user } = useContext(AuthContext);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clubId: "",
    title: "",
    description: "",
    eventDate: "",
    location: "",
    isPaid: false,
    eventFee: 0,
    maxAttendees: 0,
  });

  // Fetch manager's clubs
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await axiosSecure.get(`/manager/clubs?email=${user?.email}`);
        setClubs(res.data);
      } catch (err) {
        toast.error("Cloud sync failed: Could not fetch clubs");
      }
    };
    if (user?.email) fetchClubs();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clubId) return toast.error("Please assign this event to a club");

    setLoading(true);
    try {
      await axiosSecure.post("/events", formData);
      toast.success("Event is now live!");
      setFormData({
        clubId: "",
        title: "",
        description: "",
        eventDate: "",
        location: "",
        isPaid: false,
        eventFee: 0,
        maxAttendees: 0,
      });
    } catch (err) {
      toast.error("Publishing error. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-8 md:p-12">
          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <FaCalendarPlus size={20} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Draft <span className="text-blue-600">Event</span></h1>
            </div>
            <p className="text-slate-500 font-medium">Schedule a new gathering for your community members.</p>
          </header>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Identity Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                  <FaLayerGroup /> Organization
                </label>
                <select
                  value={formData.clubId}
                  onChange={(e) => setFormData({ ...formData, clubId: e.target.value })}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20"
                  required
                >
                  <option value="">Select Hosting Club</option>
                  {clubs.map((club) => (
                    <option key={club._id} value={club._id}>{club.clubName}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Event Title</label>
                <input
                  type="text"
                  placeholder="e.g., Summer Networking Gala"
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                <FaInfoCircle /> Experience Details
              </label>
              <textarea
                placeholder="What should attendees expect?"
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-medium text-slate-700 focus:ring-2 focus:ring-blue-500/20 min-h-[120px] resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            {/* Logistics Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Date of Event</label>
                <input
                  type="date"
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                  <FaMapMarkerAlt /> Venue Location
                </label>
                <input
                  type="text"
                  placeholder="Street address or Virtual link"
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Attendance & Finance */}
            <div className="p-8 bg-slate-50 rounded-[2rem] space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pricing Model</label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500/20 transition-all"
                        checked={formData.isPaid}
                        onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                      />
                      <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">Paid Admission</span>
                    </label>
                    
                    {formData.isPaid && (
                      <div className="relative flex-1 animate-in fade-in slide-in-from-left-2">
                        <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                        <input
                          type="number"
                          placeholder="0.00"
                          className="w-full bg-white border-none rounded-xl pl-10 pr-4 py-2 font-black text-slate-700 focus:ring-2 focus:ring-emerald-500/20"
                          value={formData.eventFee}
                          onChange={(e) => setFormData({ ...formData, eventFee: parseFloat(e.target.value) })}
                          required
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <FaUsers /> Audience Limit
                  </label>
                  <input
                    type="number"
                    placeholder="Maximum attendees"
                    className="w-full bg-white border-none rounded-xl px-5 py-2 font-black text-slate-700 focus:ring-2 focus:ring-blue-500/20"
                    value={formData.maxAttendees}
                    onChange={(e) => setFormData({ ...formData, maxAttendees: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Action */}
            <button
              type="submit"
              className={`w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-3 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>Publish Event <FaCalendarPlus /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;