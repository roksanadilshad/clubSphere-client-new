import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      {/* 1. Icon Container */}
      <div className="relative flex items-center justify-center w-10 h-10 overflow-hidden rounded-xl bg-gradient-to-tr from-warning to-primary shadow-sm group-hover:shadow-primary/30 group-hover:shadow-lg transition-all duration-500 group-hover:-rotate-3">
        
        {/* Animated Circles Container */}
        <div className="flex items-end gap-1 mb-2">
          {/* Circle 1 */}
          <div className="w-2 h-2 bg-white rounded-full transition-all duration-500 group-hover:animate-bounce" 
               style={{ animationDelay: '0ms' }} />
          {/* Circle 2 */}
          <div className="w-2 h-2 bg-white/70 rounded-full transition-all duration-500 group-hover:animate-bounce" 
               style={{ animationDelay: '150ms' }} />
          {/* Circle 3 */}
          <div className="w-2 h-2 bg-white/40 rounded-full transition-all duration-500 group-hover:animate-bounce" 
               style={{ animationDelay: '300ms' }} />
        </div>

        {/* Decorative Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      {/* 2. Text Branding */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center">
          <span className="text-2xl font-black text-slate-800 tracking-tighter transition-colors group-hover:text-primary">
            Club
          </span>
          <span className="text-2xl font-medium text-slate-500 tracking-tighter">
            Sphere
          </span>
        </div>
        {/* Subtitle - Optional for extra pro feel */}
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 group-hover:text-warning transition-colors duration-500">
          Connect & Thrive
        </span>
      </div>
    </Link>
  );
};

export default Logo;