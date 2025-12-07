import React from "react";
import { Link } from "react-router";
import { FaCircle } from "react-icons/fa";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 group">
        <style>{`
        @keyframes bounce-random-1 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes bounce-random-2 {
          0%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
        @keyframes bounce-random-3 {
          0%, 100% { transform: translateY(0); }
          60% { transform: translateY(-3px); }
        }
        .bounce-1 {
          animation: bounce-random-1 1.5s ease-in-out infinite;
        }
        .bounce-2 {
          animation: bounce-random-2 1.8s ease-in-out infinite;
          animation-delay: 0.3s;
        }
        .bounce-3 {
          animation: bounce-random-3 2s ease-in-out infinite;
          animation-delay: 0.6s;
        }
      `}</style>

      {/* Icon/Symbol */}
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br to-primary from-warning rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
          <div className="flex gap-0.5 items-end">
            <FaCircle className="text-white text-xs bounce-1" />
            <FaCircle className="text-white text-xs opacity-70 bounce-2" />
            <FaCircle className="text-white text-xs opacity-40 bounce-3" />
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-gray-900 tracking-tight">
          Club
        </span>
        <span className="text-2xl font-bold bg-gradient-to-r to-primary from-warning bg-clip-text text-transparent">
          Sphere
        </span>
      </div>
    </Link>
  );
};

export default Logo;
