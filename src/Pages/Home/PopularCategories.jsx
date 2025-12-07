import { motion } from "framer-motion";
import { Link } from "react-router";

const PopularCategories = () => {
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const categories = [
    { name: "Sports & Fitness", count: 124, color: "bg-[#E7FBBE]" },
    { name: "Arts & Culture", count: 89, color: "bg-[#FFFDDE]" },
    { name: "Technology", count: 156, color: "bg-[#D9D7F1]" },
    { name: "Music", count: 67, color: "bg-[#FFCBCB]" },
    { name: "Food & Drink", count: 92, color: "bg-[#E7FBBE]" },
    { name: "Outdoor", count: 78, color: "bg-[#FFFDDE]" },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Popular Categories
          </h2>
          <p className="text-gray-600">Explore clubs by interest</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="cursor-pointer"
            >
              <Link
                to={`/clubs?category=${category.name}`}
                className={`block ${category.color} rounded-lg p-6 text-center hover:shadow-md transition-shadow`}
              >
                <h3 className="font-bold text-gray-900 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">{category.count} clubs</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PopularCategories;
