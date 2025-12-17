import {
  FaSearch,
  FaCalendarCheck,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

const steps = [
  {
    id: 1,
    title: "Discover Clubs & Events",
    description:
      "Browse clubs and events using smart search, category, and sorting options.",
    icon: <FaSearch />,
  },
  {
    id: 2,
    title: "Register Easily",
    description:
      "Choose an event and complete registration in just a few clicks.",
    icon: <FaCalendarCheck />,
  },
  {
    id: 3,
    title: "Attend & Participate",
    description:
      "Join events and actively engage with members and organizers.",
    icon: <FaUsers />,
  },
  {
    id: 4,
    title: "Grow Your Network",
    description:
      "Build connections, skills, and long-term community relationships.",
    icon: <FaCheckCircle />,
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Header */}
        <h2 className="text-4xl font-bold text-black">
          How It Works
        </h2>
        <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
          A simple, transparent process designed to help you discover
          and join meaningful events.
        </p>

        {/* Steps */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className="bg-gray-200 rounded-2xl p-8 transition hover:shadow-md"
            >
              {/* Icon */}
              <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-primary text-black text-xl">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-black mt-6">
                {step.title}
              </h3>

              <p className="text-sm text-gray-700 mt-3">
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
