import { motion } from "framer-motion";
import { FaStar, FaQuoteRight } from "react-icons/fa";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Photography Club Member",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      text: "ClubSphere helped me find an amazing photography community. I've made lifelong friends and improved my skills tremendously!",
      color: "bg-primary/5"
    },
    {
      name: "Michael Chen",
      role: "Tech Meetup Organizer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      text: "As an organizer, ClubSphere makes it incredibly easy to manage events and connect with members. The dashboard is a game changer.",
      color: "bg-warning/5"
    },
    {
      name: "Emily Rodriguez",
      role: "Book Club Enthusiast",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      text: "I've joined three different clubs through this platform. The community is welcoming and the events are always high quality.",
      color: "bg-secondary/5"
    },
  ];

  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-4"
          >
            Voice of the Community
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
            Real Stories from <span className="text-primary">Real Members</span>
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-warning rounded-full" />
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className={`relative p-10 rounded-[3rem] ${item.color} border border-slate-50 group hover:bg-white hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500`}
            >
              {/* Massive Decorative Quote Icon */}
              <FaQuoteRight className="absolute top-10 right-10 text-6xl opacity-5 group-hover:opacity-10 transition-opacity text-primary" />

              {/* Rating */}
              <div className="flex gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-warning text-sm" />
                ))}
              </div>

              {/* Quote Text */}
              <blockquote className="text-xl font-medium text-slate-800 leading-relaxed mb-10 relative z-10">
                "{item.text}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity" />
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-full object-cover relative z-10 border-2 border-white shadow-md"
                  />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">
                    {item.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Proof Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 flex flex-col items-center"
        >
          <p className="text-slate-400 font-medium mb-4">Trusted by 500+ Local Clubs</p>
          <div className="flex gap-8 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            {/* You can add partner/sponsor logos here */}
            <span className="font-black text-2xl italic">EVENTBRITE</span>
            <span className="font-black text-2xl italic">MEETUP</span>
            <span className="font-black text-2xl italic">NOTION</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;