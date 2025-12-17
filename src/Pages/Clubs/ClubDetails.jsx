import axios from 'axios';
import { useParams, useNavigate } from 'react-router';
import { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


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
  FaStar,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaTrophy,
  FaChartLine,
  FaArrowLeft,
  FaUserShield,
  FaGlobe,
  FaPhone,
  FaEye,
  FaBookmark,
  FaRegBookmark,
  FaExclamationTriangle,
  FaShieldAlt,
  FaCrown,
  FaAward,
  FaFireAlt,
  FaThumbsUp,
  FaComments,
  FaUserFriends,
  FaCalendarCheck,
  FaChevronRight,
  FaInfoCircle,
  FaLightbulb,
  FaRocket,
  FaHandshake,
  FaGraduationCap
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { AuthContext } from '../../Context/AuthContext';
import axiosSecure from '../../api/axiosSecure';
import axiosPublic from '../../api/axiosPublic';


const ClubDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!id) return;
    const fetchClub = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/clubs/${id}`)
        setClub(res.data)
      } catch (err) {
        setError('Error fetching club details');
        console.error(err);
      } finally {
        setLoading(false)
      }
    }
    fetchClub()
  }, [id])

  useEffect(() => {
  if (!club?._id) return;

  const fetchMembers = async () => {
    try {
      const res = await axiosPublic.get(`/memberships/club/${club._id}`, {
        params: { clubId: club._id.toString() }
      });
      setMembers(res.data); // assuming API returns an array of members
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  fetchMembers();
}, [club]);
//console.log(members);


   useEffect(() => {
    if (!user || !club?._id) return;

    const checkMembership = async () => {
      try {
        const res = await axios.get('http://localhost:3000/memberships/check',
           {
          params: { 
            userEmail: user.email, 
            clubId: club._id.toString()
          } // use clubName as clubId
        }
      );
        setIsJoined(res.data.isMember);
      } catch (err) {
        console.error('Membership check failed', err);
      }
    };
    checkMembership();
  }, [user, club]);


  const handleJoinClub = async () => {
  if (!user) {
    toast.error("Please login to join this club");
    navigate("/login");
    return;
  }

  // already joined safety
  if (isJoined) return;

  try {
    const fee = Number(club.membershipFee || 0);
    // FREE CLUB
    if (fee === 0) {
      const membershipData = {
        userEmail: user.email,
        clubId: club._id.toString(),
        clubName:club.clubName,
        status: "active",
        paymentId: null,
        joinedAt: new Date(),
        expiresAt: null,
        membershipFee: club.membershipFee,
      };
      
      

      const res = await axiosSecure.post(
        "/memberships",
        membershipData
      );
//console.log(res.data);

      if (res.data.success) {
        toast.success("Successfully joined the club!");
        setIsJoined(true);
      }
      return;
    }
//console.log(club.data.membershipFee);

    // PAID CLUB → STRIPE
    const paymentInfo = {
      membershipFee: fee,
      clubName: club.clubName,
       clubId: club._id.toString(),        // real MongoDB _id
      userEmail: user.email
    };

    const res = await axios.post(
      "http://localhost:3000/create-checkout-session",
      paymentInfo
    );

    // redirect to Stripe checkout
    window.location.href = res.data.url;

  } catch (err) {
    console.error(err);
    toast.error("Failed to start payment. Try again.");
  }
};

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${club?.data?.clubName} on ClubSphere!`;
    
    switch (platform) {
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
        break;
      case "whatsapp":
        window.open(`https://wa.me/?text=${text} ${url}`, "_blank");
        break;
    }
    setShowShareMenu(false);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Bookmark removed" : "Club bookmarked");
  };

  if (loading) {
    return (
      <>
     
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading club details...</p>
          </div>
        </div>
      
      </>
    );
  }

  if (error) {
    return (
      <>
        
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-4xl text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Club</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!club) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Club Not Found</h2>
            <p className="text-gray-600">The club you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }
//console.log(club);

  return (
    <>
   
      <div className="min-h-screen bg-gray-50">
        {/* Hero Banner */}
        <div className="relative h-[700px] bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={club.bannerImage}
              alt={club.clubName}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30" />
          </div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
            />
          </div>

          {/* Navigation Bar */}
          <div className="absolute top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 text-white font-medium"
              >
                <FaArrowLeft className="text-sm" />
                <span className="hidden sm:inline">Back to Clubs</span>
              </button>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <FaEye className="text-white/80 text-sm" />
                <span className="text-white/90 text-sm font-medium">
                  {Math.floor(Math.random() * 1000) + 500} views
                </span>
              </div>
            </div>
          </div>

          {/* Floating Action Buttons */}
          <div className="absolute top-20 right-6 flex flex-col gap-3 z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBookmark}
              className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-2xl"
            >
              {isBookmarked ? (
                <FaBookmark className="text-yellow-400 text-lg" />
              ) : (
                <FaRegBookmark className="text-white/90 text-lg" />
              )}
            </motion.button>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-2xl"
              >
                <FaShare className="text-white/90 text-lg" />
              </motion.button>
              
              {/* Enhanced Share Menu */}
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                    className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50"
                  >
                    <div className="p-2">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900 text-sm">Share this club</h3>
                      </div>
                      <div className="py-2">
                        {[
                          { key: "copy", icon: FaShare, label: "Copy Link", color: "text-gray-600" },
                          { key: "facebook", icon: FaFacebook, label: "Facebook", color: "text-blue-600" },
                          { key: "twitter", icon: FaTwitter, label: "Twitter", color: "text-blue-400" },
                          { key: "linkedin", icon: FaLinkedin, label: "LinkedIn", color: "text-blue-700" },
                          { key: "whatsapp", icon: FaWhatsapp, label: "WhatsApp", color: "text-green-500" }
                        ].map(({ key, icon: Icon, label, color }) => (
                          <motion.button
                            key={key}
                            whileHover={{ x: 4 }}
                            onClick={() => handleShare(key)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-all duration-200 flex items-center gap-3 rounded-lg mx-1"
                          >
                            <Icon className={`${color} text-lg`} />
                            <span className="text-sm font-medium text-gray-700">{label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFavorite}
              className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-2xl"
            >
              {isFavorite ? (
                <FaHeart className="text-red-400 text-lg" />
              ) : (
                <FaRegHeart className="text-white/90 text-lg" />
              )}
            </motion.button>
          </div>

          {/* Club Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8"
              >
                <div className="flex-1">
                  {/* Premium Badges */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex items-center gap-3 mb-6"
                  >
                    <div className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-bold shadow-xl border border-blue-400/30">
                      <div className="flex items-center gap-2">
                        <FaGlobe className="text-xs" />
                        {club.category}
                      </div>
                    </div>
                    {club.status === "approved" && (
                      <div className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full text-sm font-bold flex items-center gap-2 shadow-xl border border-emerald-400/30">
                        <FaShieldAlt className="text-xs" />
                        Verified Club
                      </div>
                    )}
                    <div className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-sm font-bold flex items-center gap-2 shadow-xl border border-amber-400/30">
                      <FaCrown className="text-xs" />
                      Premium
                    </div>
                    <div className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full shadow-xl border border-yellow-400/30">
                      <FaStar className="text-xs" />
                      <span className="text-sm font-bold">4.8</span>
                      <span className="text-xs opacity-90">(156 reviews)</span>
                    </div>
                  </motion.div>

                  {/* Club Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl leading-tight"
                    style={{
                      textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.1)'
                    }}
                  >
                    {club.clubName}
                  </motion.h1>

                  {/* Enhanced Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
                  >
                    <div className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                      <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center">
                        <FaMapMarkerAlt className="text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-white/70 text-xs font-medium">Location</p>
                        <p className="text-white font-bold text-sm">{club.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                      <div className="w-10 h-10 bg-green-500/30 rounded-xl flex items-center justify-center">
                        <FaUsers className="text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-white/70 text-xs font-medium">Members</p>
                        <p className="text-white font-bold text-sm">{members.length}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                      <div className="w-10 h-10 bg-purple-500/30 rounded-xl flex items-center justify-center">
                        <FaCalendarAlt className="text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-white/70 text-xs font-medium">Founded</p>
                        <p className="text-white font-bold text-sm">{new Date(club.createdAt).getFullYear()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                      <div className="w-10 h-10 bg-orange-500/30 rounded-xl flex items-center justify-center">
                        <FaFireAlt className="text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-white/70 text-xs font-medium">Activity</p>
                        <p className="text-white font-bold text-sm">Very High</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Enhanced Join Section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="flex flex-col gap-4"
                >
                  <div className="text-right mb-2">
                    <p className="text-white/80 text-sm font-medium">
                      {club.membershipFee > 0 ? 'Premium Membership' : 'Free to Join'}
                    </p>
                    <p className="text-white text-3xl font-black">
                      {club.membershipFee > 0 ? `৳${club.membershipFee}` : 'FREE'}
                      {club.membershipFee > 0 && <span className="text-lg font-normal">/month</span>}
                    </p>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleJoinClub}
                    disabled={isJoined || !club}
                    className={`px-10 py-4 rounded-2xl font-bold ${
    isJoined || !club
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-primary text-white"
  }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-info  to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center gap-3">
                      <FaRocket className="text-lg" />
                      <span className="text-lg">{isJoined ? "Already Joined" : "Join Club Now"}</span>
                      <FaChevronRight className="text-sm group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>
                  
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <FaInfoCircle className="text-xs" />
                    <span>Instant access • Cancel anytime</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Enhanced About Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white to-gray-50/50 rounded-3xl shadow-xl border border-gray-200/50 p-10 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                      <FaInfoCircle className="text-white text-lg" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900">
                      About This Club
                    </h2>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed text-lg mb-8 font-medium">
                    {club.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="flex items-center gap-3 font-bold text-gray-900 mb-4 text-xl">
                        <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                          <FaLightbulb className="text-emerald-600 text-sm" />
                        </div>
                        Member Benefits
                      </h3>
                      <ul className="space-y-3">
                        {[
                          { icon: FaCalendarCheck, text: "Access to all club events and activities" },
                          { icon: FaUserFriends, text: "Connect with like-minded members" },
                          { icon: FaGraduationCap, text: "Exclusive member-only content and resources" },
                          { icon: FaTrophy, text: "Priority registration for special events" }
                        ].map((benefit, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-4 text-gray-700 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <benefit.icon className="text-emerald-600 text-sm" />
                            </div>
                            <span className="font-medium">{benefit.text}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="flex items-center gap-3 font-bold text-gray-900 mb-4 text-xl">
                        <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                          <FaHandshake className="text-blue-600 text-sm" />
                        </div>
                        Community Values
                      </h3>
                      <div className="space-y-3">
                        {[
                          { label: "Collaboration", value: "95%", color: "bg-blue-500" },
                          { label: "Innovation", value: "88%", color: "bg-purple-500" },
                          { label: "Learning", value: "92%", color: "bg-emerald-500" },
                          { label: "Networking", value: "85%", color: "bg-orange-500" }
                        ].map((value, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-700">{value.label}</span>
                              <span className="text-sm font-bold text-gray-900">{value.value}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: value.value }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                                className={`h-2 ${value.color} rounded-full`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Activity & Engagement Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-xl border border-gray-200/50 p-10 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <FaChartLine className="text-white text-lg" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900">
                      Club Activity & Engagement
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {[
                      {
                        icon: FaComments,
                        title: "Active Discussions",
                        value: "24",
                        subtitle: "This week",
                        color: "from-blue-500 to-blue-600",
                        bgColor: "bg-blue-50"
                      },
                      {
                        icon: FaThumbsUp,
                        title: "Member Satisfaction",
                        value: "96%",
                        subtitle: "Positive feedback",
                        color: "from-emerald-500 to-emerald-600",
                        bgColor: "bg-emerald-50"
                      },
                      {
                        icon: FaFireAlt,
                        title: "Activity Score",
                        value: "9.2",
                        subtitle: "Out of 10",
                        color: "from-orange-500 to-red-500",
                        bgColor: "bg-orange-50"
                      }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${stat.bgColor} rounded-2xl p-6 border border-gray-100`}
                      >
                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                          <stat.icon className="text-white text-lg" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{stat.title}</h3>
                        <p className="text-3xl font-black text-gray-900 mb-1">{stat.value}</p>
                        <p className="text-gray-600 text-sm font-medium">{stat.subtitle}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Timeline */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 text-xl mb-4">Club Milestones</h3>
                    <div className="space-y-4">
                      {[
                        {
                          icon: FaRocket,
                          title: "Club Founded",
                          date: new Date(club.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }),
                          color: "from-blue-500 to-blue-600"
                        },
                        {
                          icon: FaAward,
                          title: "Achieved Verified Status",
                          date: "2 months ago",
                          color: "from-emerald-500 to-emerald-600"
                        },
                        {
                          icon: FaCheckCircle,
                          title: "Last Updated",
                          date: new Date(club.updatedAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }),
                          color: "from-purple-500 to-purple-600"
                        }
                      ].map((milestone, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          <div className={`w-12 h-12 bg-gradient-to-br ${milestone.color} rounded-2xl flex items-center justify-center`}>
                            <milestone.icon className="text-white text-lg" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{milestone.title}</h4>
                            <p className="text-gray-600 font-medium">{milestone.date}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Enhanced Club Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-white to-gray-50/50 rounded-3xl shadow-xl border border-gray-200/50 p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                      <FaChartLine className="text-white text-sm" />
                    </div>
                    <h3 className="font-black text-gray-900 text-xl">
                      Club Analytics
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      {
                        icon: FaUsers,
                        label: "Active Members",
                        value: members.length,
                        change: "+12%",
                        color: "from-blue-500 to-blue-600",
                        bgColor: "bg-blue-50"
                      },
                      {
                        icon: FaEye,
                        label: "Profile Views",
                        value: Math.floor(Math.random() * 1000) + 500,
                        change: "+8%",
                        color: "from-purple-500 to-purple-600",
                        bgColor: "bg-purple-50"
                      },
                      {
                        icon: FaTrophy,
                        label: "Club Rating",
                        value: "4.8",
                        change: "+0.2",
                        color: "from-emerald-500 to-emerald-600",
                        bgColor: "bg-emerald-50"
                      },
                      {
                        icon: FaFireAlt,
                        label: "Engagement",
                        value: "94%",
                        change: "+5%",
                        color: "from-orange-500 to-red-500",
                        bgColor: "bg-orange-50"
                      }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${stat.bgColor} rounded-2xl p-4 border border-gray-100`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                              <stat.icon className="text-white text-sm" />
                            </div>
                            <div>
                              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                              <p className="font-black text-gray-900 text-xl">{stat.value}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-emerald-600 text-sm font-bold bg-emerald-100 px-2 py-1 rounded-full">
                              {stat.change}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Premium Membership Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                      <FaCrown className="text-white text-lg" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm font-medium">
                        {club.membershipFee > 0 ? 'Premium Membership' : 'Free Membership'}
                      </p>
                      <p className="text-white text-2xl font-black">
                        {club.membershipFee === 0 ? "FREE" : `৳${club.membershipFee}`}
                        {club.membershipFee > 0 && <span className="text-lg font-normal opacity-80">/month</span>}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {[
                      "Full access to all club features",
                      "Priority event registration",
                      "Exclusive member benefits",
                      "24/7 community support"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                          <FaCheckCircle className="text-white text-xs" />
                        </div>
                        <span className="text-white/90 text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleJoinClub}
                    disabled={isJoined || !club}
                    className={`px-10 py-4 rounded-2xl font-bold ${
    isJoined || !club
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-primary text-white"
  }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                    <div className="relative flex items-center justify-center gap-3">
                      <FaRocket className="text-lg" />
                      <span className="text-lg">{isJoined ? "Already Joined" : "Join Club Now"}</span>
                    </div>
                  </motion.button>

                  <div className="flex items-center justify-center gap-2 mt-4 text-white/70 text-xs">
                    <FaShieldAlt className="text-xs" />
                    <span>Secure payment • Cancel anytime</span>
                  </div>
                </div>
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
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <FaUserShield className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Club Admin</p>
                    <p className="text-sm text-gray-600">{club.managerEmail}</p>
                  </div>
                </div>
                <a
                  href={`mailto:${club.managerEmail}`}
                  className="flex items-center justify-center gap-2 w-full py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FaEnvelope />
                  Contact Manager
                </a>
              </motion.div>

              {/* Quick Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
              >
                <h3 className="font-bold text-gray-900 mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-400" />
                      Location
                    </span>
                    <span className="font-semibold text-gray-900">{club.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <FaGlobe className="text-gray-400" />
                      Category
                    </span>
                    <span className="font-semibold text-gray-900">{club.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <FaCheckCircle className="text-gray-400" />
                      Status
                    </span>
                    <span className={`font-semibold capitalize ${
                      club.status === 'approved' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {club.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
 
    </>
  );
};

export default ClubDetails;