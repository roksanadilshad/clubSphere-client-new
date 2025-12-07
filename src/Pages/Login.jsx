import { use, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { AuthContext } from "../Context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Loder from "../Components/Loder";
import toast from "react-hot-toast";

const Login = () => {
  const { signInUser, signInWithGoogle, loading } = use(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState(null);

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const emailValue = watch("email");

  const onSubmit = async (data) => {
     
    const { email, password } = data;
    setErr(null);
    try {
      await signInUser(email, password);
      navigate(from, { replace: true });
    } catch (error){
      setErr("Invalid email or password.");
      console.log(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setErr(err.message);
      toast.error(err.message);
    }
  };

  const handleForgetPassword = () => {
    navigate("/forgetPassword", {
      state: { email: emailValue || "", from },
    });
  };

  if (loading) return <Loder />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4 py-12">
      <div>
        <title>WarmPaws - Log in</title>
      </div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-900 mb-3">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-sm">
            Log in to keep your pets warm, safe, and stylish this winter
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Error Alert */}
          {err && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm text-center">{err}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-red-500 focus:ring-red-500"
                } focus:outline-none focus:ring-2 transition-colors`}
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-red-500 focus:ring-red-500"
                  } focus:outline-none focus:ring-2 transition-colors pr-12`}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPass ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
              
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgetPassword}
                className="text-sm text-red-700 hover:text-red-900 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}

            {
              err && (
                <p className="text-red-600">{err}</p>
              )
            }
            <button
              type="submit"
              className="w-full bg-red-900 hover:bg-red-800 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Log In
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg border border-gray-300 transition-colors duration-200 shadow-sm hover:shadow"
          >
            <FcGoogle size={24} />
            <span>Continue with Google</span>
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-red-700 hover:text-red-900 font-semibold transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
