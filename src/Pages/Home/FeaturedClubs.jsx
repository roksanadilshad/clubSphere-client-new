import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FaUsers, FaChevronRight, FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";
import { motion as m } from "framer-motion";
import axiosPublic from "../../api/axiosPublic";

const FeaturedClubs = () => {
  const { data: featuredClubs = [], isLoading } = useQuery({
    queryKey: ["featuredClubs"],
    queryFn: async () => {
      const response = await axiosPublic.get("/featuredClubs?status=approved");
      return response.data;
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="py-24 px-6 bg-base-100 dark:bg-neutral transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <m.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-primary font-black uppercase tracking-[0.2em] text-sm block mb-2"
            >
              Community Favorites
            </m.span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
              Featured <span className="text-primary">Clubs</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg">
              Explore the most vibrant communities making an impact today.
            </p>
          </div>
          <Link
            to="/clubs"
            className="group flex items-center gap-3 bg-slate-900 dark:bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
          >
            See all clubs
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="skeleton h-56 w-full rounded-[2rem]"></div>
                <div className="skeleton h-6 w-3/4"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-10 w-full rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {featuredClubs.slice(0, 4).map((club) => (
              <motion.div
                key={club._id}
                variants={itemVariants}
                className="group relative bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2"
              >
                <Link to={`/clubDetail/${club._id}`}>
                  {/* Image Container with Badge */}
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                        {club.category || "General"}
                      </span>
                    </div>
                    
                    {club.bannerImage ? (
                      <img
                        src={club.bannerImage}
                        alt={club.clubName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <FaUsers className="text-4xl text-slate-300" />
                      </div>
                    )}
                    
                    {/* Dark Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Club Info */}
                  <div className="p-7">
                    <div className="flex items-center gap-2 mb-3 text-warning font-bold text-xs">
                      <FaMapMarkerAlt />
                      <span className="uppercase tracking-widest">{club.location}</span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                      {club.clubName}
                    </h3>
                    
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                      {club.description}
                    </p>

                    <div className="pt-5 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {/* Mock avatars for pro look */}
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 overflow-hidden">
                             <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="member" />
                          </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-primary text-[10px] flex items-center justify-center text-white font-bold">
                          +12
                        </div>
                      </div>
                      <span className="text-primary font-bold text-sm group-hover:underline flex items-center gap-1">
                        Join <FaChevronRight size={10} />
                      </span>
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