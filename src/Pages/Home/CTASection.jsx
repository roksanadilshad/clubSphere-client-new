import { Link } from "react-router";

const CTASection = () => {
  return (
    <section className="py-16 px-4 bg-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Find Your Community?
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Join thousands of members connecting through ClubSphere
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Sign Up Free
          </Link>
          <Link
            to="/clubs"
            className="inline-block px-8 py-3 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-gray-900 transition-colors"
          >
            Browse Clubs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
