import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { FaChevronRight, FaPlus, FaTachometerAlt, FaUserTie } from "react-icons/fa";
import useRole from "../../hooks/useRole";

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { role } = useRole();

  const heroSlides = [
    {
      title: "Discover Your Community",
      subtitle: "Join clubs that match your interests and passions. Your tribe is waiting for you.",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
      accent: "bg-[#D9D7F1]",
    },
    {
      title: "Connect & Grow Together",
      subtitle: "Build meaningful relationships through shared activities and constant collaboration.",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop",
      accent: "bg-[#E7FBBE]",
    },
    {
      title: "Attend Exciting Events",
      subtitle: "From workshops to social gatherings, never miss out on what's happening in your circle.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
      accent: "bg-[#FFCBCB]",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <section className={`relative min-h-[600px] lg:min-h-[700px] transition-colors duration-1000 ${heroSlides[currentSlide].accent} overflow-hidden flex items-center`}>
      {/* Decorative Background Circles */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-white/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-72 h-72 bg-white/20 rounded-full blur-2xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-16">
          
          {/* Left Side - Text Content */}
          <div className="text-left order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="inline-block px-4 py-1 rounded-full bg-black/5 text-black/60 text-sm font-bold tracking-widest uppercase mb-4"
                >
                  Welcome to ClubSphere
                </motion.span>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight">
                  {heroSlides[currentSlide].title}
                </h1>
                <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-lg leading-relaxed">
                  {heroSlides[currentSlide].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                to="/clubs"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                <span className="relative z-10 flex items-center">
                  Explore Clubs <FaChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              {role === "clubManager" ? (
                <Link to="/dashboard/manager/create-club" className="cta-secondary">
                  <FaPlus className="mr-2" /> Start a Club
                </Link>
              ) : role === "admin" ? (
                <Link to="/dashboard" className="cta-secondary">
                  <FaTachometerAlt className="mr-2" /> Dashboard
                </Link>
              ) : (
                <Link to="/manager" className="cta-secondary">
                  <FaUserTie className="mr-2" /> Be A Manager
                </Link>
              )}
            </div>

            {/* Slide Indicators */}
            <div className="flex gap-3">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === currentSlide ? "w-12 bg-gray-900" : "w-3 bg-gray-900/20 hover:bg-gray-900/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Image Section */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, rotate: 5, scale: 0.9 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -5, scale: 1.1 }}
                transition={{ duration: 0.7, ease: "circOut" }}
                className="relative w-full max-w-[500px] aspect-square"
              >
                {/* Floating Card Decorative Element */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/40 backdrop-blur-md rounded-3xl z-20 hidden md:block animate-bounce shadow-lg"></div>
                
                <img
                  src={heroSlides[currentSlide].image}
                  alt={heroSlides[currentSlide].title}
                  className="w-full h-full object-cover rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] border-8 border-white"
                />
                
                {/* Glass Card on Image */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-8 -left-8 bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-xl hidden md:block max-w-[200px]"
                >
                  <p className="text-xs font-black uppercase text-gray-400 mb-1">Trending</p>
                  <p className="text-sm font-bold text-gray-800">120+ Clubs Joined this week!</p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cta-secondary {
          @apply inline-flex items-center justify-center px-8 py-4 bg-white/50 backdrop-blur-md text-gray-900 font-bold rounded-2xl border-2 border-gray-900/10 hover:border-gray-900 hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-lg;
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;