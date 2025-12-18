import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { FaUpload, FaSave, FaTimes, FaInfoCircle, FaMapMarkerAlt, FaTag, FaDollarSign } from "react-icons/fa";
import toast from "react-hot-toast";
import { imageUpload } from "../../../utils";
import axiosSecure from "../../../api/axiosSecure";

const EditClub = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState(null);

  const { data: club, isLoading } = useQuery({
    queryKey: ["club", clubId],
    queryFn: async () => {
      if (!clubId) return null;
      const res = await axiosSecure.get(`/clubs/${clubId}`);
      return res.data;
    },
    enabled: !!clubId,
  });

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  useEffect(() => {
    if (club) {
      reset({
        name: club.clubName,
        description: club.description,
        category: club.category,
        location: club.location,
        membershipFee: club.membershipFee,
      });
      setImagePreview(club.bannerImage || null);
    }
  }, [club, reset]);

  const bannerImage = watch("bannerImage");
  useEffect(() => {
    if (bannerImage && bannerImage[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(bannerImage[0]);
    }
  }, [bannerImage]);

  const updateClubMutation = useMutation({
    mutationFn: async (data) => {
      let bannerUrl = club.bannerImage;
      if (data.bannerImage && data.bannerImage[0]) {
        bannerUrl = await imageUpload(data.bannerImage[0]);
      }
      const payload = {
        clubName: data.name,
        description: data.description,
        category: data.category,
        location: data.location,
        membershipFee: Number(data.membershipFee),
        bannerImage: bannerUrl,
        updatedAt: new Date(),
      };
      const res = await axiosSecure.patch(`/clubs/${clubId}`, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Identity updated successfully");
      queryClient.invalidateQueries(["club", clubId]);
      navigate("/dashboard/manager/clubs");
    },
    onError: () => toast.error("Update failed. Check credentials."),
  });

  const onSubmit = (data) => updateClubMutation.mutate(data);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing Architecture...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-blue-600 rounded-lg text-white"><FaInfoCircle size={10}/></span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Administrative Suite</p>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Edit Club Identity</h1>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
          >
            <FaTimes /> Dismiss Changes
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Media Upload */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Branding</h3>
              <div className="relative group cursor-pointer overflow-hidden rounded-2xl bg-slate-100 aspect-video md:aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-400 transition-all">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <FaUpload className="text-white text-2xl" />
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <FaUpload className="text-3xl text-slate-300 mx-auto mb-2" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Drop New Banner</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" {...register("bannerImage")} />
              </div>
              <p className="mt-4 text-[10px] text-slate-400 font-medium leading-relaxed">
                Recommend 1200x600px. High resolution images increase engagement by up to 40%.
              </p>
            </div>
          </div>

          {/* Right: Core Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Club Name */}
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Organization Name</label>
                  <input
                    type="text"
                    className={`w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition-all ${errors.name ? 'ring-2 ring-red-500' : ''}`}
                    placeholder="e.g. Elite Tech Vanguard"
                    {...register("name", { required: "Name is required" })}
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Manifesto & Description</label>
                  <textarea
                    rows="4"
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 font-medium text-slate-600 transition-all"
                    placeholder="Define the purpose and vision of your club..."
                    {...register("description", { required: "Description is required" })}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block flex items-center gap-2">
                    <FaTag size={10} className="text-blue-500"/> Industry/Category
                  </label>
                  <select
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 appearance-none"
                    {...register("category", { required: true })}
                  >
                    <option>Sports & Fitness</option>
                    <option>Arts & Culture</option>
                    <option>Technology</option>
                    <option>Music</option>
                    <option>Food & Drink</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block flex items-center gap-2">
                    <FaMapMarkerAlt size={10} className="text-blue-500"/> Operational Base
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition-all"
                    placeholder="New York, NY"
                    {...register("location", { required: true })}
                  />
                </div>

                {/* Fee */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block flex items-center gap-2">
                    <FaDollarSign size={10} className="text-blue-500"/> Monthly Subscription
                  </label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full bg-slate-50 border-none rounded-2xl pl-10 pr-6 py-4 focus:ring-2 focus:ring-blue-500 font-black text-slate-800 transition-all"
                      {...register("membershipFee", { required: true, min: 0 })}
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row gap-4">
                <button
                  type="submit"
                  disabled={updateClubMutation.isLoading}
                  className="flex-1 bg-slate-900 text-white rounded-2xl py-4 font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  <FaSave /> {updateClubMutation.isLoading ? "Deploying..." : "Update Infrastructure"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClub;