import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import axiosSecure from "../../../api/axiosSecure";
import { AuthContext } from "../../../Context/AuthContext";

const CreateEvent = () => {
  const { user } = useContext(AuthContext); // get logged-in manager
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
        console.error(err);
        toast.error("Failed to fetch clubs");
      }
    };
    if (user?.email) fetchClubs();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clubId) {
      return toast.error("Please select a club for the event");
    }

    setLoading(true);
    try {
      await axiosSecure.post("/events", formData);
      toast.success("Event created successfully!");
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
      console.error(err);
      toast.error("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 mt-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Create New Event</h1>
      <p className="text-gray-600 mb-6">
        Fill out the form below to create an event for your club.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Club Selector */}
        <select
          value={formData.clubId}
          onChange={(e) => setFormData({ ...formData, clubId: e.target.value })}
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Club</option>
          {clubs.map((club) => (
            <option key={club._id} value={club._id}>
              {club.clubName}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Event Title"
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Event Description"
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />

        <input
          type="date"
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.eventDate}
          onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Location"
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isPaid}
              onChange={(e) =>
                setFormData({ ...formData, isPaid: e.target.checked })
              }
            />
            Paid Event
          </label>

          {formData.isPaid && (
            <input
              type="number"
              placeholder="Event Fee ($)"
              className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.eventFee}
              onChange={(e) =>
                setFormData({ ...formData, eventFee: parseFloat(e.target.value) })
              }
              required
            />
          )}
        </div>

        <input
          type="number"
          placeholder="Max Attendees"
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.maxAttendees}
          onChange={(e) =>
            setFormData({ ...formData, maxAttendees: parseInt(e.target.value) })
          }
          required
        />

        <button
          type="submit"
          className={`w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
