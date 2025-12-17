import { motion } from "framer-motion";
import {
  FaSearch,
  FaCalendarCheck,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

const steps = [
  {
    id: "01",
    title: "Discover Clubs",
    description: "Browse curated communities using smart search and categories tailored to your interests.",
    icon: <FaSearch />,
    color: "from-blue-500 to-cyan-400",
  },
  {
    id: "02",
    title: "Register Easily",
    description: "Secure your spot in upcoming events with a seamless, one-click registration process.",
    icon: <FaCalendarCheck />,
    color: "from-purple-500 to-pink-400",
  },
  {
    id: "03",
    title: "Attend & Engage",
    description: "Participate in meaningful workshops and meetups with passionate community members.",
    icon: <FaUsers />,
    color: "from-orange-500 to-yellow-400",
  },
  {
    id: "04",
    title: "Grow Network",
    description: "Build lasting professional and social connections that help you thrive long-term.",
    icon: <FaCheckCircle />,
    color: "from-emerald-500 to-teal-400",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative bg-white py-24 overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-primary font-black uppercase tracking-[0.3em] text-xs"
          >
            The Process
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 mb-6 tracking-tight">
            How it <span className="text-primary">Works</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            We’ve streamlined the path to community engagement. Follow these four 
            simple steps to start your journey with ClubSphere.
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-1/4 left-0 w-full h-0.5 bg-slate-100 -z-10">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-primary/20 via-primary to-primary/20"
            />
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative flex flex-col items-center text-center"
            >
              {/* Step Number Overlay */}
              <span className="absolute -top-6 text-7xl font-black text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 select-none">
                {step.id}
              </span>

              {/* Icon Circle */}
              <div className="relative mb-8">
                <div className={`w-20 h-20 flex items-center justify-center rounded-3xl bg-white shadow-2xl shadow-slate-200 group-hover:shadow-primary/20 group-hover:-translate-y-2 transition-all duration-500 relative z-10 border border-slate-50`}>
                  <div className={`text-2xl text-slate-900 group-hover:text-primary transition-colors`}>
                    {step.icon}
                  </div>
                </div>
                {/* Decorative background pulse */}
                <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-xl group-hover:scale-150 transition-transform duration-500 opacity-0 group-hover:opacity-100" />
              </div>

              {/* Text Content */}
              <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">
                {step.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed px-4">
                {step.description}
              </p>

              {/* Bottom Accent */}
              <div className="mt-8 w-12 h-1 bg-slate-100 group-hover:w-24 group-hover:bg-primary transition-all duration-500 rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;