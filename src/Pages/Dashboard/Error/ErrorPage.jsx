import { Link, useRouteError } from "react-router";
import { FaExclamationTriangle, FaHome, FaRedo } from "react-icons/fa";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaExclamationTriangle className="text-5xl text-red-600" />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Oops! Something Went Wrong
          </h1>
          <p className="text-gray-600 mb-6">
            We encountered an unexpected error. Don't worry, our team has been
            notified and we're working on it.
          </p>

          {/* Error Details (Development) */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <p className="text-sm font-semibold text-red-900 mb-2">
                Error Details:
              </p>
              <p className="text-sm text-red-700 font-mono">
                {error.statusText || error.message}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FaRedo />
              Try Again
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <FaHome />
              Go Home
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8">
          <p className="text-sm text-gray-600 mb-4">
            If this problem persists, please contact our support team
          </p>
          <Link
            to="/contact"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Contact Support →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
