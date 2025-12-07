import { motion } from "framer-motion";
import { FaUsers, FaCalendarAlt, FaGlobe, FaStar } from "react-icons/fa";

const StatsSection = () => {
  const stats = [
    {
      icon: <FaUsers className="text-4xl text-blue-600" />,
      value: "50,000+",
      label: "Active Members",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      icon: <FaCalendarAlt className="text-4xl text-purple-600" />,
      value: "1,000+",
      label: "Events Monthly",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      icon: <FaGlobe className="text-4xl text-green-600" />,
      value: "500+",
      label: "Active Clubs",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      icon: <FaStar className="text-4xl text-yellow-500" />,
      value: "4.8/5",
      label: "Average Rating",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
  ];

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
    <section className="py-16 px-4 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center"
            >
              <div
                className={`inline-flex items-center justify-center w-20 h-20 ${stat.bgColor} border-2 ${stat.borderColor} rounded-2xl mb-4 shadow-sm`}
              >
                {stat.icon}
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {stat.value}
              </h3>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
