import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaRocket, FaCompass } from "react-icons/fa";

const CTASection = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* High-End Gradient Background */}
      <div className="absolute inset-0 bg-[#0F172A]" /> {/* Deep Navy Base */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
        >
          {/* Decorative Rings */}
          <div className="absolute -top-24 -right-24 w-64 h-64 border-2 border-white/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 border-2 border-white/5 rounded-full pointer-events-none" />

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
              Ready to find your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary animate-gradient-x">
                perfect community?
              </span>
            </h2>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
              Join 5,000+ members already building connections, sharing skills, 
              and creating memories through ClubSphere.
            </p>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link
              to="/register"
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-primary text-white font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20"
            >
              <FaRocket className="group-hover:rotate-12 transition-transform" />
              Get Started for Free
            </Link>

            <Link
              to="/clubs"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl transition-all border border-white/10"
            >
              <FaCompass className="group-hover:spin-slow" />
              Browse All Clubs
            </Link>
          </motion.div>

          {/* Trust Badge */}
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-slate-500 text-xs font-bold uppercase tracking-[0.4em]"
          >
            No credit card required • Cancel anytime
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;