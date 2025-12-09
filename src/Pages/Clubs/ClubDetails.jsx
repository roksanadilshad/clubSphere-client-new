import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaCalendarAlt,
  FaDollarSign,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaShare,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { Link } from "react-router";
import toast from "react-hot-toast";

const ClubDetails = () => {
  const { clubId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch club details
  const { data: club, isLoading } = useQuery({
    queryKey: ["club", clubId],
    queryFn: async () => {
      const response = await fetch(`/api/clubs/${clubId}`);
      if (!response.ok) throw new Error("Failed to fetch club");
      return response.json();
    },
  });

  // Fetch club events
  const { data: events } = useQuery({
    queryKey: ["clubEvents", clubId],
    queryFn: async () => {
      const response = await fetch(`/api/clubs/${clubId}/events`);
      if (!response.ok) throw new Error("Failed to fetch events");
      return response.json();
    },
  });

  // Check if user is already a member
  const { data: membership } = useQuery({
    queryKey: ["membership", clubId, user?.email],
    queryFn: async () => {
      if (!user) return null;
      const response = await fetch(
        `/api/memberships?clubId=${clubId}&userEmail=${user.email}`
      );
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!user,
  });

  const handleJoinClub = () => {
    if (!user) {
      toast.error("Please login to join this club");
      navigate("/login");
      return;
    }

    if (club.membershipFee > 0) {
      navigate(`/payment/membership/${clubId}`);
    } else {
      // Free club - join directly
      // API call to create membership
      toast.success("Successfully joined the club!");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isMember = membership?.status === "active";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-96 bg-gradient-to-br from-blue-600 to-purple-600">
        <img
          src={club?.bannerImage}
          alt={club?.clubName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Floating Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-3">
          <button
            onClick={handleShare}
            className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
          >
            <FaShare className="text-gray-700" />
          </button>
          <button
            onClick={handleFavorite}
            className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
          >
            {isFavorite ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart className="text-gray-700" />
            )}
          </button>
        </div>

        {/* Club Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-4 py-1 bg-blue-500 text-white rounded-full text-sm font-semibold">
                    {club?.category}
                  </span>
                  {club?.status === "approved" && (
                    <span className="px-4 py-1 bg-green-500 text-white rounded-full text-sm font-semibold flex items-center gap-1">
                      <FaCheckCircle />
                      Verified
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                  {club?.clubName}
                </h1>
                <div className="flex items-center gap-6 text-white/90">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt />
                    <span>{club?.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUsers />
                    <span>{club?.memberCount || 0} members</span>
                  </div>
                </div>
              </div>

              {/* Join Button */}
              {!isMember && (
                <button
                  onClick={handleJoinClub}
                  className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-xl"
                >
                  {club?.membershipFee > 0
                    ? `Join for $${club?.membershipFee}/month`
                    : "Join for Free"}
                </button>
              )}
              {isMember && (
                <div className="px-8 py-4 bg-green-500 text-white font-bold rounded-xl flex items-center gap-2">
                  <FaCheckCircle />
                  Member
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Club
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {club?.description}
              </p>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">
                  What You'll Get:
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3 text-gray-700">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    Access to all club events and activities
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    Connect with like-minded members
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    Exclusive member-only content and resources
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    Priority registration for special events
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Upcoming Events
                </h2>
                {isMember && (
                  <Link
                    to={`/clubs/${clubId}/events`}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    View All →
                  </Link>
                )}
              </div>

              <div className="space-y-4">
                {events?.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div className="w-16 h-16 bg-blue-50 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-xs text-blue-600 font-semibold">
                        {new Date(event.eventDate).toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {new Date(event.eventDate).getDate()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaClock />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt />
                          {event.location}
                        </span>
                      </div>
                    </div>
                    {event.isPaid && (
                      <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        ${event.eventFee}
                      </div>
                    )}
                  </div>
                ))}

                {(!events || events.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <FaCalendarAlt className="text-4xl mx-auto mb-3 text-gray-300" />
                    <p>No upcoming events yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Club Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="font-bold text-gray-900 mb-4">Club Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Members</span>
                  <span className="font-bold text-gray-900">
                    {club?.memberCount || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Events</span>
                  <span className="font-bold text-gray-900">
                    {events?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-bold text-gray-900">{club?.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-bold text-gray-900">{club?.location}</span>
                </div>
              </div>
            </motion.div>

            {/* Membership Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg p-6 text-white"
            >
              <div className="flex items-center gap-3 mb-4">
                <FaDollarSign className="text-3xl" />
                <div>
                  <p className="text-blue-100 text-sm">Membership Fee</p>
                  <p className="text-3xl font-bold">
                    {club?.membershipFee > 0
                      ? `$${club?.membershipFee}`
                      : "Free"}
                  </p>
                  {club?.membershipFee > 0 && (
                    <p className="text-blue-100 text-sm">per month</p>
                  )}
                </div>
              </div>
              {!isMember && (
                <button
                  onClick={handleJoinClub}
                  className="w-full py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Join Now
                </button>
              )}
            </motion.div>

            {/* Contact Manager */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="font-bold text-gray-900 mb-4">Club Manager</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <FaUsers className="text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Club Admin</p>
                  <p className="text-sm text-gray-600">{club?.managerEmail}</p>
                </div>
              </div>
              <a
                href={`mailto:${club?.managerEmail}`}
                className="flex items-center justify-center gap-2 w-full py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaEnvelope />
                Contact Manager
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetails;
