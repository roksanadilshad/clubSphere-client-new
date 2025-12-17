import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaRegLightbulb, FaRocket, FaGlobe, FaTrophy, FaHandshake } from "react-icons/fa";

const AboutPage = () => {
  const stats = [
    { label: "Active Clubs", value: "500+", icon: <FaRocket /> },
    { label: "Happy Members", value: "25k+", icon: <FaUsers /> },
    { label: "Events Hosted", value: "1,200+", icon: <FaTrophy /> },
  ];

  const features = [
    {
      title: "Find Clubs Easily",
      text: "Discover clubs that match your interests in just a few clicks.",
      icon: <FaGlobe className="text-primary text-3xl" />,
    },
    {
      title: "Manage Memberships",
      text: "Keep track of your memberships and events registrations effortlessly.",
      icon: <FaHandshake className="text-secondary-focus text-3xl" />,
    },
    {
      title: "Engage & Connect",
      text: "Join events, meet like-minded people, and grow your network.",
      icon: <FaRegLightbulb className="text-accent text-3xl" />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <div className="bg-base-100 min-h-screen overflow-hidden">
      {/* 1. Hero Section with Gradient Background */}
      <section className="relative py-24 bg-gradient-to-br from-primary/20 via-base-100 to-secondary/20">
        <motion.div 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="max-w-5xl mx-auto text-center px-6"
        >
          <span className="badge badge-outline badge-primary px-4 py-3 mb-6 font-bold tracking-widest uppercase">Our Story</span>
          <h1 className="text-5xl md:text-7xl font-black text-base-content mb-6 tracking-tight">
            Building the <span className="text-primary">Future</span> of Community.
          </h1>
          <p className="text-xl opacity-70 max-w-2xl mx-auto leading-relaxed">
            ClubSphere is more than a platform; it's a digital ecosystem designed to bring people together and empower local leaders.
          </p>
        </motion.div>
      </section>

      {/* 2. Stats Section - Professional Credibility */}
      <section className="max-w-6xl mx-auto -mt-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="card bg-base-100 shadow-xl p-8 flex flex-row items-center gap-6 border border-primary/10"
            >
              <div className="text-4xl text-primary">{stat.icon}</div>
              <div>
                <h4 className="text-3xl font-black">{stat.value}</h4>
                <p className="opacity-60 font-medium uppercase text-xs tracking-widest">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Mission & Vision - Split Content */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-4xl font-bold">Driven by Purpose, <br/>Led by Community</h2>
          <p className="text-lg opacity-70">
            Our mission is simple: to unite people. We believe that technology should serve to strengthen real-world connections, not replace them.
          </p>
          <div className="collapse collapse-plus bg-secondary/10 rounded-2xl">
            <input type="radio" name="my-accordion-3" defaultChecked /> 
            <div className="collapse-title text-xl font-bold">Our Core Philosophy</div>
            <div className="collapse-content">
              <p>We prioritize transparency, user safety, and the growth of grassroots organizations across the globe.</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-primary/20 w-full h-80 rounded-[3rem] absolute -rotate-6 scale-105"></div>
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" 
            className="rounded-[3rem] shadow-2xl relative z-10 w-full h-80 object-cover" 
            alt="Teamwork" 
          />
        </motion.div>
      </section>

      {/* 4. Features Section - Grid of Values */}
      <section className="bg-secondary/5 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose ClubSphere?</h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          </div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="card bg-base-100 p-10 shadow-lg border-b-4 border-primary hover:shadow-2xl transition-all group"
              >
                <div className="mb-6 transform group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="opacity-70 leading-relaxed">{feature.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. Modern Call to Action */}
      <section className="py-24 px-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="max-w-5xl mx-auto bg-neutral text-neutral-content p-12 md:p-20 rounded-[4rem] text-center relative overflow-hidden"
        >
          {/* Background Decorative Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-8 relative z-10">
            Ready to Find Your <span className="text-primary">Tribe?</span>
          </h2>
          <p className="text-xl mb-10 opacity-80 max-w-xl mx-auto relative z-10">
            Join thousands of others who have already found their community. Your next adventure starts here.
          </p>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <a href="/clubs" className="btn btn-primary btn-lg rounded-full px-12 text-lg">Explore Clubs</a>
            <a href="/register" className="btn btn-outline btn-lg rounded-full px-12 text-white border-white hover:bg-white hover:text-black">Join Now</a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;