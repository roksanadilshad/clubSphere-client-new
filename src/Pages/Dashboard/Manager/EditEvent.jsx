import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosSecure from "../../../api/axiosSecure";
import { AuthContext } from "../../../Context/AuthContext";

const EditEvent = () => {
  const { user } = useContext(AuthContext);
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
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

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axiosSecure.get(`/events/${eventId}`);
        const event = res.data;
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
        console.error(err);
        toast.error("Failed to fetch event data");
      }
    };
    if (eventId) fetchEvent();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventData.clubId) {
      return toast.error("Please select a club for the event");
    }

    setLoading(true);
    try {
      await axiosSecure.put(`/events/${eventId}`, eventData);
      toast.success("Event updated successfully!");
      navigate("/dashboard/manager/events");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update event");
    } finally {
      setLoading(false);
    }
  };
//console.log(eventData);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 mt-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Edit Event</h1>
      <p className="text-gray-600 mb-6">
        Update the details of your event below.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Club Selector */}
        <select
          value={eventData.clubId}
          onChange={(e) => setEventData({ ...eventData, clubId: e.target.value })}
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
          value={eventData.title}
          onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Event Description"
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          value={eventData.description}
          onChange={(e) =>
            setEventData({ ...eventData, description: e.target.value })
          }
          required
        />

        <input
          type="date"
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={eventData.eventDate}
          onChange={(e) => setEventData({ ...eventData, eventDate: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Location"
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={eventData.location}
          onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
          required
        />

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={eventData.isPaid}
              onChange={(e) =>
                setEventData({ ...eventData, isPaid: e.target.checked })
              }
            />
            Paid Event
          </label>

          {eventData.isPaid && (
            <input
              type="number"
              placeholder="Event Fee ($)"
              className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={eventData.eventFee}
              onChange={(e) =>
                setEventData({ ...eventData, eventFee: parseFloat(e.target.value) })
              }
              required
            />
          )}
        </div>

        <input
          type="number"
          placeholder="Max Attendees"
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={eventData.maxAttendees}
          onChange={(e) =>
            setEventData({ ...eventData, maxAttendees: parseInt(e.target.value) })
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
          {loading ? "Updating..." : "Update Event"}
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
