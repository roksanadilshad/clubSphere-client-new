import { FaSearch, FaCalendarCheck, FaUsers, FaCheckCircle } from "react-icons/fa";

const steps = [
  {
    id: 1,
    title: "Discover Clubs & Events",
    description:
      "Browse clubs and upcoming events that match your interests using smart search and filters.",
    icon: <FaSearch />,
  },
  {
    id: 2,
    title: "Choose & Register",
    description:
      "Select your preferred event and register instantly. Paid and free events supported.",
    icon: <FaCalendarCheck />,
  },
  {
    id: 3,
    title: "Join & Participate",
    description:
      "Attend events physically or virtually and engage with community members.",
    icon: <FaUsers />,
  },
  {
    id: 4,
    title: "Grow Your Network",
    description:
      "Build connections, gain experience, and grow your personal or professional network.",
    icon: <FaCheckCircle />,
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-[#FCF5EE] py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Header */}
        <h2 className="text-4xl font-bold text-black">
          How It Works
        </h2>
        <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
          Getting started is simple. Follow these easy steps to explore clubs,
          join events, and grow your community experience.
        </p>

        {/* Steps */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#EE6983] text-white text-xl mx-auto">
                {step.icon}
              </div>

              <h3 className="text-xl font-semibold text-black mt-6">
                {step.title}
              </h3>

              <p className="text-gray-600 mt-3 text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
