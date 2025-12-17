import { useContext } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaTicketAlt, FaClock, FaCheckCircle } from "react-icons/fa";

import axiosPublic from "../../api/axiosPublic";
import axiosSecure from "../../api/axiosSecure";
import { AuthContext } from "../../Context/AuthContext";
import Loading from "../../Components/Loading";
 // Using the custom loader we built earlier

const EventDetails = () => {
  const { id: eventId } = useParams();
  const { user } = useContext(AuthContext);
  const userEmail = user?.email;
  const queryClient = useQueryClient();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ["eventDetails", eventId],
    queryFn: async () => {
      const res = await axiosPublic.get(`/events/${eventId}`);
      return res.data;
    },
  });

  const { data: registrations } = useQuery({
    queryKey: ["eventRegistrations", eventId],
    queryFn: async () => {
      const res = await axiosPublic.get(`/events/${eventId}/registrations`);
      return res.data;
    },
    enabled: !!event,
  });

  const isRegistered = registrations?.some(reg => reg.userEmail === userEmail);
  const isFull = (registrations?.length ?? 0) >= (event?.maxAttendees ?? 0);

  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post(`/events/${eventId}/register`, { userEmail });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["eventRegistrations", eventId]);
      toast.success("Spot reserved successfully!");
    },
  });

  const handleRegister = async () => {
    if (!userEmail) return toast.error("Please login first!");
    if (isFull) return toast.error("Event is full!");
    if (isRegistered) return toast("Already registered!");

    if (!event.isPaid) {
      registerMutation.mutate();
    } else {
      try {
        const { data } = await axiosSecure.post('/create-event-checkout-session', {
          eventFee: event.eventFee,
          eventTitle: event.title,
          eventId: event._id,
          userEmail
        });
        window.location.href = data.url;
      } catch (err) {
        toast.error("Payment initialization failed.", err);
      }
    }
  };

  if (isLoading) return <Loading />;
  if (error || !event) return <div className="text-center py-20 text-error">Event not found.</div>;

  return (
    <div className="min-h-screen bg-base-100 pb-20">
      {/* 1. Hero Header Section */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        <img 
          src={event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"} 
          className="w-full h-full object-cover brightness-50"
          alt={event.title}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center px-4"
          >
            <div className="badge badge-warning mb-4 px-4 py-3 font-bold uppercase tracking-widest">
              {event.isPaid ? `Premium Event` : 'Free Workshop'}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg">
              {event.title}
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 2. Main Description (Left) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card bg-base-100 shadow-2xl border border-primary/10 p-8 rounded-3xl">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-primary rounded-full"></span>
                About This Event
              </h2>
              <p className="text-lg leading-relaxed opacity-80 whitespace-pre-line">
                {event.description}
              </p>
              
              <div className="divider"></div>
              
              {/* Event Perks Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-2xl">
                  <FaCheckCircle className="text-primary" />
                  <span className="font-medium">Verified Community Event</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-2xl">
                  <FaCheckCircle className="text-primary" />
                  <span className="font-medium">Certificate of Attendance</span>
                </div>
              </div>
            </div>

            {/* 3. The Interactive Map Section */}
            <div className="card bg-base-100 shadow-2xl border border-primary/10 overflow-hidden rounded-3xl">
              <div className="p-6 border-b border-primary/10 flex justify-between items-center">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <FaMapMarkerAlt className="text-error" /> Location Details
                </h3>
                <span className="text-sm opacity-60">{event.location}</span>
              </div>
              <div className="h-[400px] w-full bg-base-300">
                <iframe
                  title="Event Map"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(event.location)}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>

          {/* 4. Action Sidebar (Right) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="card bg-secondary text-base-content p-8 shadow-2xl rounded-3xl border border-white/20">
                <h3 className="text-xl font-bold mb-6">Event Summary</h3>
                
                <div className="space-y-6">
                  <DetailItem icon={<FaCalendarAlt />} label="Date" val={new Date(event.eventDate).toLocaleDateString()} />
                  <DetailItem icon={<FaClock />} label="Time" val={new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                  <DetailItem icon={<FaUsers />} label="Capacity" val={`${registrations?.length ?? 0} / ${event.maxAttendees} Enrolled`} />
                  <DetailItem icon={<FaTicketAlt />} label="Admission" val={event.isPaid ? `$${event.eventFee}` : 'FREE'} />
                </div>

                <div className="divider opacity-20"></div>

                {isRegistered ? (
                  <div className="alert alert-success rounded-2xl shadow-inner font-bold">
                    <FaCheckCircle /> You're Going!
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={isFull || registerMutation.isLoading}
                    className={`btn btn-primary btn-lg text-gray-700 w-full rounded-2xl shadow-lg border-none hover:scale-[1.02] transition-transform ${isFull && 'btn-disabled'}`}
                  >
                    {isFull ? 'Event Full' : event.isPaid ? `Pay & Register` : 'Secure My Spot'}
                  </button>
                )}
                <p className="text-[10px] text-center mt-4 opacity-50 uppercase tracking-widest font-bold">
                  Secure checkout powered by ClubSphere
                </p>
              </div>

              {/* Share Section */}
              <div className="bg-base-200 p-6 rounded-3xl border border-primary/5 text-center">
                <p className="font-bold text-sm mb-3">Invite your friends!</p>
                <div className="flex justify-center gap-4">
                  <button className="btn btn-circle btn-sm btn-outline">f</button>
                  <button className="btn btn-circle btn-sm btn-outline">t</button>
                  <button className="btn btn-circle btn-sm btn-outline">in</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, val }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
      {icon}
    </div>
    <div>
      <p className="text-xs uppercase font-bold opacity-60">{label}</p>
      <p className="font-bold text-lg leading-tight">{val}</p>
    </div>
  </div>
);

export default EventDetails;