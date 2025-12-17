import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { FaEye, FaEyeSlash, FaCamera, FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { imageUpload } from "../utils";
import { saveUser } from "../api/saveUser";
import { auth } from "../firebase/firebase.init";

const Registration = () => {
  const { createUser, setUser, signInWithGoogle, updateUserProfile, loading } = useContext(AuthContext);
  const [showPass, setShowPass] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const imageFile = watch("image");

  // Handle Image Preview
  React.useEffect(() => {
    if (imageFile && imageFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(imageFile[0]);
    }
  }, [imageFile]);

  const onSubmit = async (data) => {
    const { name, image, email, password } = data;

    try {
      const photoURL = await imageUpload(image[0]);
      await createUser(email, password);
      await updateUserProfile(name, photoURL);
      
      // Syncing state
      await auth.currentUser.reload();
      const updatedUser = auth.currentUser;
      setUser(updatedUser);

      // Save to DB
      await saveUser({
        uid: updatedUser.uid,
        displayName: updatedUser.displayName,
        email: updatedUser.email,
        photoURL: updatedUser.photoURL,
      });

      toast.success("Welcome to ClubSphere!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      await saveUser({
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
      });
      setUser(result.user);
      toast.success("Google Signup Successful");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-8 md:p-12 border border-slate-100 relative z-10"
      >
        <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-sm mb-8 transition-colors group">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Already have an account?
        </Link>

        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Create Account</h1>
          <p className="text-slate-500 font-medium">Join the most active community hub online.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Enhanced Image Upload UI */}
          <div className="flex flex-col items-center md:items-start gap-4 mb-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary group-hover:bg-slate-50">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover shadow-inner" />
                ) : (
                  <FaCamera className="text-slate-400 text-2xl group-hover:scale-110 transition-transform" />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <FaCamera size={14} />
                <input type="file" className="hidden" accept="image/*" {...register("image", { required: "Avatar required" })} />
              </label>
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Profile Image</span>
              {errors.image && <p className="text-rose-500 text-[10px] font-bold mt-1">{errors.image.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Full Name</label>
              <input
                type="text"
                {...register("name", { required: "Name required", minLength: { value: 5, message: "Min 5 chars" } })}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-medium"
                placeholder="Alex Carter"
              />
              {errors.name && <p className="text-rose-500 text-xs mt-1 ml-1 font-bold">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email</label>
              <input
                type="email"
                {...register("email", { 
                  required: "Email required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                })}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-medium"
                placeholder="alex@example.com"
              />
              {errors.email && <p className="text-rose-500 text-xs mt-1 ml-1 font-bold">{errors.email.message}</p>}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Security Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                {...register("password", { 
                  required: "Password required",
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/,
                    message: "Must include Upper, Lower & Special Char"
                  }
                })}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-medium"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                {showPass ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-rose-500 text-xs mt-1 ml-1 font-bold">{errors.password.message}</p>}
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <input type="checkbox" id="terms" {...register("terms", { required: true })} className="w-5 h-5 rounded-lg border-slate-300 text-primary focus:ring-primary" />
            <label htmlFor="terms" className="text-xs font-medium text-slate-500 leading-tight">
              I agree to the <Link to="/terms" className="text-primary font-bold">Terms</Link> and have read the <Link to="/privacy" className="text-primary font-bold">Privacy Policy</Link>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-950 hover:bg-slate-800 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Establishing Profile..." : "Create Account"}
          </button>
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <span className="relative px-4 bg-white text-xs font-black text-slate-400 uppercase tracking-widest">Or Fast Track</span>
        </div>

        <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-bold py-4 rounded-2xl border-2 border-slate-100 transition-all">
          <FcGoogle size={24} /> Sign up with Google
        </button>
      </motion.div>
    </div>
  );
};

export default Registration;