import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { FaUsers, FaChevronRight } from "react-icons/fa";

const FeaturedClubs = () => {
  // Fetch featured clubs with TanStack Query
  const { data: featuredClubs, isLoading } = useQuery({
    queryKey: ["featuredClubs"],
    queryFn: async () => {
      const response = await fetch("/api/clubs/featured?limit=6");
      if (!response.ok) throw new Error("Failed to fetch clubs");
      return response.json();
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

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Featured Clubs
            </h2>
            <p className="text-gray-600">
              Popular clubs with the most active members
            </p>
          </div>
          <Link
            to="/clubs"
            className="text-gray-900 font-semibold hover:underline flex items-center gap-2"
          >
            See all
            <FaChevronRight />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200" />
                <div className="p-5">
                  <div className="h-6 bg-gray-200 rounded mb-3" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featuredClubs?.map((club) => (
              <motion.div
                key={club.id}
                variants={itemVariants}
                className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <Link to={`/clubs/${club.id}`}>
                  <div className="relative h-48 bg-[#D9D7F1] overflow-hidden">
                    {club.image ? (
                      <img
                        src={club.image}
                        alt={club.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaUsers className="text-5xl text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700">
                      {club.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {club.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaUsers className="text-xs" />
                          {club.memberCount} members
                        </span>
                        {club.category && (
                          <span className="px-2 py-1 bg-[#E7FBBE] text-gray-700 rounded text-xs font-medium">
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
  );
};

export default FeaturedClubs;
