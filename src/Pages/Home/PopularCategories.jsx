import { motion } from "framer-motion";
import { 
  FaFutbol, FaPalette, FaMicrochip, 
  FaMusic, FaUtensils, FaCampground, FaArrowRight 
} from "react-icons/fa";
import { useNavigate } from "react-router";

const categories = [
  { name: "Sports & Fitness", count: 124, color: "bg-emerald-50", icon: <FaFutbol />, accent: "text-emerald-600", border: "hover:border-emerald-200" },
  { name: "Arts & Culture", count: 85, color: "bg-indigo-50", icon: <FaPalette />, accent: "text-indigo-600", border: "hover:border-indigo-200" },
  { name: "Technology", count: 210, color: "bg-rose-50", icon: <FaMicrochip />, accent: "text-rose-600", border: "hover:border-rose-200" },
  { name: "Music", count: 96, color: "bg-amber-50", icon: <FaMusic />, accent: "text-amber-600", border: "hover:border-amber-200" },
  { name: "Food & Drink", count: 150, color: "bg-orange-50", icon: <FaUtensils />, accent: "text-orange-600", border: "hover:border-orange-200" },
  { name: "Outdoor", count: 72, color: "bg-sky-50", icon: <FaCampground />, accent: "text-sky-600", border: "hover:border-sky-200" },
];

const PopularCategories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/clubs?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="bg-white py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with modern typography */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-primary font-black uppercase tracking-[0.3em] text-xs block mb-3"
            >
              Curated Hubs
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Popular <span className="text-primary text-outline-sm">Categories</span>
            </h2>
          </div>
          <button 
            onClick={() => navigate('/clubs')}
            className="group flex items-center gap-3 font-bold text-slate-900 hover:text-primary transition-all pb-2 border-b-2 border-slate-100 hover:border-primary"
          >
            Explore all 12+ categories 
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid with staggered motion */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              onClick={() => handleCategoryClick(cat.name)}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className={`group cursor-pointer relative p-10 rounded-[2.5rem] transition-all duration-500 ${cat.color} border-2 border-transparent ${cat.border} overflow-hidden`}
            >
              {/* Massive background icon for texture */}
              <div className={`absolute -right-4 -bottom-4 text-9xl opacity-[0.03] group-hover:scale-110 transition-transform duration-700 ${cat.accent}`}>
                {cat.icon}
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-10">
                  <div className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-white shadow-sm text-3xl ${cat.accent}`}>
                    {cat.icon}
                  </div>
                  <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
                      {cat.count} Clubs
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                  {cat.name}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-[200px]">
                  Join trending {cat.name.toLowerCase()} activities and workshops.
                </p>

                <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-[0.2em] ${cat.accent} opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300`}>
                  Discover <FaArrowRight />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;