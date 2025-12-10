import { Link } from "react-router";
import { FaMapMarkerAlt, FaUsers, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const Club = ({ club }) => {
  // console.log(club);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
    >
      {/* Banner Image */}
      <div className="relative h-56 overflow-hidden ">
        <img
          src={club.bannerImage || "https://via.placeholder.com/400x300"}
          alt={club.clubName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-4 py-1.5 bg-secondary backdrop-blur-sm text-gray-900 rounded-full text-xs font-bold shadow-lg">
            {club.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Club Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#1B4242] transition-colors">
          {club.clubName}
        </h3>

        {/* Location */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          {/* Membership Fee */}
          <div>
            {club.membershipFee > 0 ? (
              <div>
                <span className="text-2xl font-bold text-gray-900">
                  ${club.membershipFee}
                </span>
                <span className="text-sm text-gray-500">/month</span>
              </div>
            ) : (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                Free
              </span>
            )}
          </div>
<div className="flex items-center gap-2 text-gray-600 ">
          <FaMapMarkerAlt className="text-gray-400 flex-shrink-0" />
          <span className="text-sm">{club.location}</span>
        </div>
         
          
        </div>
         {/* View More Button */}
        <Link
            to={`/clubDetail/${club._id}`}
            className="flex items-center gap-2 px-5 py-2 mt-4 bg-primary text-white font-semibold rounded-lg hover:bg-warning transition-colors group-hover:gap-3"
          >
            View More
            <FaArrowRight className="text-sm" />
          </Link>
      </div>
    </motion.div>
  );
};

export default Club;
