import { motion } from "framer-motion";
import { 
  FaFutbol, FaPalette, FaMicrochip, 
  FaMusic, FaUtensils, FaCampground, FaArrowRight 
} from "react-icons/fa";
import { useNavigate } from "react-router";

const categories = [
  { name: "Sports & Fitness", count: 124, color: "bg-[#E7FBBE]", icon: <FaFutbol />, text: "text-green-800" },
  { name: "Arts & Culture", count: 85, color: "bg-[#D9D7F1]", icon: <FaPalette />, text: "text-purple-800" },
  { name: "Technology", count: 210, color: "bg-[#FFCBCB]", icon: <FaMicrochip />, text: "text-red-800" },
  { name: "Music", count: 96, color: "bg-[#FFFDDE]", icon: <FaMusic />, text: "text-yellow-800" },
  { name: "Food & Drink", count: 150, color: "bg-[#E7FBBE]", icon: <FaUtensils />, text: "text-green-800" },
  { name: "Outdoor", count: 72, color: "bg-[#D9D7F1]", icon: <FaCampground />, text: "text-purple-800" },
];

const PopularCategories = () => {
  const navigate = useNavigate();

const handleCategoryClick = (categoryName) => {
  // Redirect to your club listing page with the category filter
  navigate(`/clubs?category=${encodeURIComponent(categoryName)}`);
};
  return (
    <section className="bg-base-100 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-base-content">Popular Categories</h2>
            <p className="text-base-content/60 mt-2 text-lg">
              Explore the most active communities in ClubSphere.
            </p>
          </div>
          <button className="btn btn-ghost text-primary hidden md:flex items-center gap-2">
            View All Categories <FaArrowRight />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <motion.div
            onClick={() => handleCategoryClick(cat.name)}
              key={index}
              whileHover={{ y: -5 }}
              className={`group cursor-pointer p-8 rounded-[2rem] transition-all duration-300 ${cat.color} shadow-sm hover:shadow-xl`}
            >
              <div className="flex justify-between items-start">
                <div className={`p-4 rounded-2xl bg-white/50 text-2xl ${cat.text}`}>
                  {cat.icon}
                </div>
                <span className={`font-bold text-sm px-3 py-1 rounded-full bg-white/40 ${cat.text}`}>
                  {cat.count} Clubs
                </span>
              </div>

              <div className="mt-8">
                <h3 className={`text-2xl font-bold ${cat.text}`}>
                  {cat.name}
                </h3>
                <p className={`mt-2 opacity-70 ${cat.text} font-medium`}>
                  Browse trending events and meetups in {cat.name.split(' ')[0]}.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Now <FaArrowRight />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;