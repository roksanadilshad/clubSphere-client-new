import React, { useContext, useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../Context/AuthContext";
import { imageUpload } from "../../utils";
import { FaUser, FaEnvelope, FaCamera, FaSave, FaShieldAlt, FaCalendarAlt, FaUsers, FaGlassCheers, FaWallet } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axiosSecure from "../../api/axiosSecure";
import useRole from "../../hooks/useRole";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const { role } = useRole();

  const { data: dbUser, isLoading } = useQuery({
    queryKey: ["dbUser", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const [imagePreview, setImagePreview] = useState(user?.photoURL);

  const currentUser = useMemo(() => ({
    name: user?.displayName || "Anonymous",
    email: user?.email || "",
    photoURL: user?.photoURL || "",
    role: dbUser?.role || "member",
    createdAt: dbUser?.createdAt || null,
    clubsCount: dbUser?.clubsCount || 0,
    eventsCount: dbUser?.eventsCount || 0,
    totalSpent: dbUser?.totalSpent || 0,
  }), [user, dbUser]);

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: { name: currentUser.name },
  });

  useEffect(() => {
    reset({ name: currentUser.name });
    setImagePreview(currentUser.photoURL);
  }, [currentUser, reset]);

  const photoFile = watch("photo");
  useEffect(() => {
    if (photoFile?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(photoFile[0]);
    }
  }, [photoFile]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      let photoURL = currentUser.photoURL;
      if (data.photo?.[0]) photoURL = await imageUpload(data.photo[0]);

      await updateUserProfile(data.name, photoURL);
      const res = await axiosSecure.patch(`/users/${currentUser.email}`, {
        name: data.name,
        photoURL,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Profile synced successfully!");
      queryClient.invalidateQueries(["dbUser", user.email]);
    },
    onError: () => toast.error("Failed to update profile"),
  });

  if (isLoading) return <div className="flex justify-center items-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your public profile and club activities.</p>
        </div>
        <div className="flex gap-3">
          {role === "member" && (
            <Link to="/manager" className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-6 py-2 rounded-xl font-bold transition-all text-sm flex items-center gap-2">
              <FaShieldAlt /> Upgrade to Manager
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Identity Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/10 to-purple-500/10" />
            
            <div className="relative z-10">
              <div className="relative inline-block mb-6 group">
                <img
                  src={imagePreview}
                  className="w-32 h-32 rounded-[2.5rem] object-cover ring-4 ring-white shadow-2xl transition-transform group-hover:scale-105"
                  alt="Profile"
                />
                <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center cursor-pointer hover:bg-primary transition-colors shadow-lg">
                  <FaCamera size={14} />
                  <input type="file" className="hidden" {...register("photo")} />
                </label>
              </div>

              <h2 className="text-2xl font-black text-slate-900">{currentUser.name}</h2>
              <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-slate-600 mt-2">
                <FaShieldAlt className="text-primary" /> {currentUser.role}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-center gap-3 text-slate-400">
              <FaCalendarAlt />
              <span className="text-sm font-medium">Joined {new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <FaUsers className="text-primary mb-2" size={20} />
              <p className="text-2xl font-black text-slate-900">{currentUser.clubsCount}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Clubs</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <FaGlassCheers className="text-purple-500 mb-2" size={20} />
              <p className="text-2xl font-black text-slate-900">{currentUser.eventsCount}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Events</p>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl transition-all outline-none font-semibold text-slate-700"
                      {...register("name", { required: true })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email (Static)</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      className="w-full pl-12 pr-4 py-4 bg-slate-100 border-2 border-transparent rounded-2xl cursor-not-allowed font-semibold text-slate-400"
                      value={currentUser.email}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                  <FaWallet size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Total Community Investment</p>
                  <p className="text-lg font-black text-slate-900">${currentUser.totalSpent.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  disabled={updateMutation.isLoading}
                  type="submit"
                  className="bg-slate-950 hover:bg-slate-800 text-white font-black px-10 py-4 rounded-2xl transition-all flex items-center gap-3 shadow-xl shadow-slate-200 disabled:opacity-70 active:scale-95"
                >
                  <FaSave />
                  {updateMutation.isLoading ? "Saving Profile..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;