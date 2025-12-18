import { use, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

import { FaEye, FaEyeSlash, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import toast from "react-hot-toast";
import { AuthContext } from "../Context/AuthContext";
import Loading from "../Components/Loading";

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
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const emailValue = watch("email");

  const onSubmit = async (data) => {
    const { email, password } = data;
    setErr(null);
    try {
      await signInUser(email, password);
      toast.success("Welcome back to ClubSphere!");
      navigate(from, { replace: true });
    } catch (error) {
      setErr("Invalid email or password. Please try again.", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google successfully!");
      navigate(from, { replace: true });
    } catch (err) {
      setErr(err.message);
      toast.error("Google Sign-In failed.");
    }
  };

  if (loading) return <Loading/>

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-8">
      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-primary font-bold transition-all group"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Back to home
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100"
      >
        
        {/* Left Side - Visual Branding */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-slate-950 relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <h2 className="text-white text-5xl font-black tracking-tight mb-6">
              The heartbeat of <br />
              <span className="text-primary">your community.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Reconnect with thousands of members, manage your events, and never miss a beat in your favorite clubs.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            {[
              "Real-time event tracking",
              "Exclusive club discussions",
              "Verified member network"
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <FaCheckCircle />
                </div>
                <span className="text-white font-semibold">{text}</span>
              </div>
            ))}
          </div>

          <p className="text-slate-500 text-sm font-medium relative z-10">
            © {new Date().getFullYear()} ClubSphere Inc.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
              <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h1>
              <p className="text-slate-500 font-medium">Enter your details to continue your journey.</p>
            </div>

            {err && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                {err}
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email", { required: "Required" })}
                  className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 transition-all outline-none font-medium ${
                    errors.email ? "border-rose-400 focus:border-rose-400" : "border-transparent focus:border-primary focus:bg-white"
                  }`}
                  placeholder="name@company.com"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400">
                    Password
                  </label>
                  <button 
                    type="button"
                    onClick={() => navigate("/forgetPassword", { state: { email: emailValue } })}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    {...register("password", { required: "Required" })}
                    className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 transition-all outline-none font-medium ${
                      errors.password ? "border-rose-400 focus:border-rose-400" : "border-transparent focus:border-primary focus:bg-white"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPass ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
                  </button>
                </div>
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-slate-950 hover:bg-slate-800 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Authenticating..." : "Sign In"}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-xs font-black uppercase tracking-[0.2em]"><span className="px-4 bg-white text-slate-400">Social Login</span></div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-bold py-4 rounded-2xl border-2 border-slate-100 transition-all active:scale-[0.98]"
            >
              <FcGoogle size={24} />
              Continue with Google
            </button>

            <p className="text-center text-slate-500 font-medium mt-10">
              New to ClubSphere?{" "}
              <Link to="/register" className="text-primary font-black hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;