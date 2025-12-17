import React, { useEffect, useRef } from "react";

const AboutPage = () => {
  const sectionsRef = useRef([]);
   const featureRefs = useRef([]);

  // Scroll-triggered animation
  useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fadeInUpVisible");
        }
      });
    },
    { threshold: 0.2 }
  );

  sectionsRef.current.forEach((section) => {
    if (section) observer.observe(section);
  });

  return () => observer.disconnect();
}, []);
useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeInUpVisible");
            observer.unobserve(entry.target); // stop observing after visible
          }
        });
      },
      { threshold: 0.2 }
    );

    featureRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      title: "Find Clubs Easily",
      text: "Discover clubs that match your interests in just a few clicks.",
    },
    {
      title: "Manage Memberships",
      text: "Keep track of your memberships, payments, and event registrations effortlessly.",
    },
    {
      title: "Engage & Connect",
      text: "Join events, meet like-minded people, and grow your network.",
    },
  ];



  return (
    <section className="bg-secondary dark:bg-neutral min-h-screen text-gray-800 dark:text-white py-16 px-4">
      {/* Header */}
      <div
        ref={(el) => (sectionsRef.current[0] = el)}
        className="max-w-5xl mx-auto text-center mb-16 opacity-0 transition-all duration-1000"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-accent">
          About ClubSphere
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
          Connecting communities, empowering clubs, and creating unforgettable experiences for everyone.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 mb-16">
        <div
          ref={(el) => (sectionsRef.current[1] = el)}
          className="bg-primary dark:bg-blue-900 rounded-xl p-8 shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl opacity-0"
        >
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-accent">
            Our Mission
          </h2>
          <p className="text-gray-700 dark:text-gray-200">
            ClubSphere aims to unite people through clubs, events, and shared interests. We make it simple for members to find the perfect club, participate in events, and engage with like-minded communities.
          </p>
        </div>
        <div
          ref={(el) => (sectionsRef.current[2] = el)}
          className="bg-info dark:bg-blue-800 rounded-xl p-8 shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl opacity-0"
        >
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-accent">
            Our Vision
          </h2>
          <p className="text-gray-700 dark:text-gray-200">
            We envision a world where everyone has access to vibrant communities, where collaboration and connection create meaningful experiences for all.
          </p>
        </div>
      </div>

      
     {/* Features Section */}
 <div className="max-w-6xl mx-auto mb-16">
      <h2 className="text-3xl font-bold mb-8 text-center text-black dark:text-accent opacity-0 transition-all duration-1000"
          ref={(el) => featureRefs.current.push(el)}
      >
        Why Choose ClubSphere?
      </h2>
      <div className="grid md:grid-cols-3 gap-8 text-center">
        {features.map((feature, index) => (
          <div
            key={index}
            ref={(el) => featureRefs.current.push(el)}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow transform transition duration-500 hover:scale-105 hover:shadow-2xl opacity-0"
          >
            <h3 className="text-xl font-semibold mb-2 text-black dark:text-accent">
              {feature.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{feature.text}</p>
          </div>
        ))}
      </div>

      {/* Animations */}
      <style jsx>{`
        .animate-fadeInUpVisible {
          opacity: 1 !important;
          transform: translateY(0px) !important;
          transition: all 0.8s ease-out;
        }
        .opacity-0 {
          opacity: 0;
          transform: translateY(20px);
        }
      `}</style>
    </div>


      {/* Call to Action */}
      <div
        ref={(el) => (sectionsRef.current[4] = el)}
        className="max-w-3xl mx-auto text-center opacity-0"
      >
        <h2 className="text-3xl font-bold mb-6 text-black dark:text-accent">
          Ready to Join the Community?
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Sign up today and explore a world of clubs and events designed just for you.
        </p>
        <a
          href="/clubs"
          className="btn btn-primary btn-lg px-8 py-3 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Get Started
        </a>
      </div>

      {/* Animations CSS */}
      <style jsx>{`
        .animate-fadeInUpVisible {
          opacity: 1 !important;
          transform: translateY(0px) !important;
          transition: all 0.8s ease-out;
        }
        .opacity-0 {
          opacity: 0;
          transform: translateY(20px);
        }
      `}</style>
    </section>
  );
};

export default AboutPage;
