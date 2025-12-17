import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-base-100">
      {/* Animated Logo or Icon Container */}
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsing Ring */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute w-24 h-24 rounded-full bg-primary"
        />

        {/* Inner Spinning Circle */}
        <div className="relative z-10 w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        
        {/* Center Dot or Logo */}
        <div className="absolute z-20 w-4 h-4 bg-secondary rounded-full" />
      </div>

      {/* Text with Fade-in Effect */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-center"
      >
        <h2 className="text-2xl font-bold tracking-widest text-base-content uppercase">
          Club<span className="text-primary">Sphere</span>
        </h2>
        
        {/* Loading Progress Bar Style */}
        <div className="w-48 h-1 bg-primary/10 rounded-full mt-4 overflow-hidden mx-auto">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-full h-full bg-primary shadow-[0_0_10px_var(--color-primary)]"
          />
        </div>
        <p className="text-sm opacity-60 mt-4 animate-pulse">Initializing experience...</p>
      </motion.div>
    </div>
  );
};

export default Loading;