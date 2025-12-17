import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { FaChevronRight } from "react-icons/fa";
import useRole from "../../hooks/useRole";

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
const {role} = useRole()
  // Hero slider content
  const heroSlides = [
    {
      title: "Discover Your Community",
      subtitle: "Join clubs that match your interests and passions",
      image:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
    },
    {
      title: "Connect With Like-Minded People",
      subtitle: "Build meaningful relationships through shared activities",
      image:
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop",
    },
    {
      title: "Attend Exciting Events",
      subtitle: "Participate in workshops, meetups, and social gatherings",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    },
  ];

  // Auto-slide every 2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative bg-[#D9D7F1] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[500px] py-12">
          {/* Left Side - Text Content */}
          <div className="z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                  {heroSlides[currentSlide].title}
                </h1>
                <p className="text-lg md:text-xl text-gray-700 mb-8">
                  {heroSlides[currentSlide].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                to="/clubs"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Explore Clubs
                <FaChevronRight className="ml-2" />
              </Link>
              {
                role === "clubManager" ? (
                  <Link
                to="/create-club"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-900 hover:bg-gray-50 transition-colors"
              >
                Start a Club
              </Link>

                ) :  role === "admin" ? (
                  <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-900 hover:bg-gray-50 transition-colors"
              >
                Dashboard
              </Link>
                ):(
              <Link
                to="/manager"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-900 hover:bg-gray-50 transition-colors"
              >
                Be A Manager
              </Link>
                )
              }
              
            </div>

            {/* Slide Indicators */}
            <div className="flex gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1 rounded-full transition-all ${
                    index === currentSlide
                      ? "w-8 bg-gray-900"
                      : "w-4 bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Sliding Images */}
          <div className="relative h-[400px] lg:h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <img
                  src={heroSlides[currentSlide].image}
                  alt={heroSlides[currentSlide].title}
                  className="w-full h-full object-cover rounded-2xl shadow-2xl"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
