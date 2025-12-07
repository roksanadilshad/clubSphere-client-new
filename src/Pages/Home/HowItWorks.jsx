import { motion } from "framer-motion";

const HowItWorks = () => {
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

  const steps = [
    {
      number: "1",
      title: "Sign Up",
      description:
        "Create your free account and complete your profile in minutes",
    },
    {
      number: "2",
      title: "Find Clubs",
      description:
        "Browse and discover clubs that match your interests and location",
    },
    {
      number: "3",
      title: "Get Involved",
      description: "Join clubs, attend events, and connect with members",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            How ClubSphere Works
          </h2>
          <p className="text-gray-600">Join a community in three simple steps</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={itemVariants} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 text-white text-2xl font-bold rounded-full mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
