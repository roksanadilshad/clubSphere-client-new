import { useContext } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FaCalendar, FaMapMarkerAlt, FaUsers } from "react-icons/fa";

import axiosPublic from "../../api/axiosPublic";
import axiosSecure from "../../api/axiosSecure";
import { AuthContext } from "../../Context/AuthContext";

const EventDetails = () => {
  const { id: eventId } = useParams();
  const { user } = useContext(AuthContext);
  const userEmail = user?.email;
  const queryClient = useQueryClient();

  // 1️⃣ Fetch event details
  const { data: event, isLoading, error } = useQuery({
    queryKey: ["eventDetails", eventId],
    queryFn: async () => {
      const res = await axiosPublic.get(`/events/${eventId}`);
      return res.data;
    },
  });

  // 2️⃣ Fetch registrations for this event
  const { data: registrations } = useQuery({
    queryKey: ["eventRegistrations", eventId],
    queryFn: async () => {
      const res = await axiosPublic.get(`/events/${eventId}/registrations`);
      return res.data; // array of registrations
    },
    enabled: !!event, // only run after event is loaded
  });

  // 3️⃣ Register mutation
  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post(`/events/${eventId}/register`, {
        userEmail, // ✅ backend expects userEmail
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["eventRegistrations", eventId]);
      queryClient.invalidateQueries(["eventDetails", eventId]);
      toast.success("Successfully registered!");
    },
    onError: (err) => {
      console.error(err);
      toast.error(
        err.response?.data?.error || "Failed to register. You may already be registered."
      );
    },
  });

  const handleRegister = () => {
    if (!userEmail) {
      toast.error("You must be logged in to register!");
      return;
    }

    if (registrations?.length >= event.maxAttendees) {
      toast.error("Event is full!");
      return;
    }

    const isRegistered = registrations?.some(
      (reg) => reg.userEmail === userEmail
    );

    if (isRegistered) {
      toast("You are already registered for this event!");
      return;
    }

    registerMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !event) {
    return <p className="text-center text-red-500">Failed to load event.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="text-gray-600 mb-4">{event.description}</p>

      <div className="space-y-2 mb-6 text-gray-700">
        <div className="flex items-center gap-2">
          <FaCalendar className="text-gray-400" />
          <span>{new Date(event.eventDate).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-gray-400" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaUsers className="text-gray-400" />
          <span>
            {registrations?.length ?? 0} / {event.maxAttendees} registered
          </span>
        </div>
        {event.isPaid && (
          <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full inline-block text-sm">
            Fee: ${event.eventFee}
          </div>
        )}
      </div>

      <button
        onClick={handleRegister}
        className={`w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors ${
          registerMutation.isLoading || (registrations?.length ?? 0) >= event.maxAttendees
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
        disabled={registerMutation.isLoading || (registrations?.length ?? 0) >= event.maxAttendees}
      >
        {(registrations?.length ?? 0) >= event.maxAttendees
          ? "Event Full"
          : registerMutation.isLoading
          ? "Registering..."
          : "Register"}
      </button>
    </div>
  );
};

export default EventDetails;
