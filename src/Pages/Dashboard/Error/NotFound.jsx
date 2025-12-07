import { Link } from "react-router";
import { FaHome, FaSearch } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <FaSearch className="text-8xl text-gray-300 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist. It might have been
            moved or deleted.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FaHome />
              Go Home
            </Link>
            <Link
              to="/clubs"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <FaSearch />
              Browse Clubs
            </Link>
          </div>
        </div>

        {/* Helpful Links */}
        <div className="mt-8">
          <p className="text-sm text-gray-600 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/events"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Events
            </Link>
            <Link
              to="/about"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Contact
            </Link>
            <Link
              to="/dashboard"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
