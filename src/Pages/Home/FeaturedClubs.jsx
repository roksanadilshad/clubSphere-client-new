import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FaUsers, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import Club from "../Clubs/Club";
import SearchBar from "./SearchBar";
import { LocateIcon } from "lucide-react";
import axiosPublic from "../../api/axiosPublic";

const FeaturedClubs = () => {
  
  const { data: featuredClubs, isLoading } = useQuery({
    queryKey: ["featuredClubs"],
    queryFn: async () => {
      const response = await axiosPublic.get(
        "/featuredClubs?status=approved"
      );
      return response.data;
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };
//console.log(...featuredClubs);

  return (
    <div>

      {/* <SearchBar /> */}
    <section className="py-16 px-4 bg-gray-50 dark:bg-neutral">

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Featured Clubs
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Popular clubs with the most active members
            </p>
          </div>
          <Link
            to="/clubs"
            className="text-gray-900 dark:text-white font-semibold hover:underline flex items-center gap-2"
          >
            See all
            <FaChevronRight />
          </Link>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 overflow-hidden animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700" />
                <div className="p-5">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {featuredClubs.map((club) => (
              <motion.div
                key={club._id}
                variants={itemVariants}
                className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <Link to={`/clubDetail/${club._id}`}>
                  {/* Club Image */}
                  <div className="relative h-48 bg-[#D9D7F1] dark:bg-blue-900 overflow-hidden">
                    {club.bannerImage ? (
                      <img
                        src={club.bannerImage
}
                        alt={club.clubName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaUsers className="text-5xl text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Club Info */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                      {club.clubName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {club.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <LocateIcon className="text-xs text-warning" />
                          {club.location}
                        </span>
                        {club.category && (
                          <span className="px-2 py-1 bg-[#E7FBBE] dark:bg-yellow-700 text-gray-700 dark:text-white rounded text-xs font-medium">
                            {club.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
    </div>
  );
};

export default FeaturedClubs;
