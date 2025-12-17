import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { imageUpload } from "../../../utils";
import toast from "react-hot-toast";
import axiosSecure from "../../../api/axiosSecure";
import { FaImage, FaRocket, FaMapMarkerAlt, FaTag, FaMoneyBillWave } from "react-icons/fa";

const CreateClub = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  // Watch for image changes to show a preview
  const bannerFile = watch("bannerImage");
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const file = data.bannerImage[0];
      const uploadedUrl = await imageUpload(file);

      const clubData = {
        clubName: data.clubName,
        description: data.description,
        category: data.category,
        location: data.location,
        membershipFee: Number(data.membershipFee),
        bannerImage: uploadedUrl,
        status: "pending",
        managerEmail: user.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Used axiosSecure for protected routing
      await axiosSecure.post("/clubs", clubData);
      
      toast.success("Club submitted for review!", {
        icon: '🚀',
        style: { borderRadius: '15px', background: '#333', color: '#fff' }
      });
      
      reset();
      setPreview(null);
    } catch (error) {
      console.error(error);
      toast.error("submission failed. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          
          {/* Left Side: Branding/Preview */}
          <div className="lg:col-span-2 bg-slate-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4 leading-tight">Start Your <br/><span className="text-blue-400">Community.</span></h2>
              <p className="text-slate-400 text-sm font-medium">Join hundreds of managers growing their clubs on our platform.</p>
            </div>

            <div className="mt-10 relative z-10">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 block">Banner Preview</label>
                <div className="aspect-video w-full rounded-2xl bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden">
                    {preview ? (
                        <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                        <FaImage className="text-4xl text-slate-700" />
                    )}
                </div>
            </div>

            {/* Decorative background circle */}
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:col-span-3 p-10 md:p-14">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Club Identity</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    {...register("clubName")}
                    placeholder="Club Name"
                    className="w-full bg-slate-50 border-none rounded-xl px-5 py-3 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                  <select
                    {...register("category")}
                    className="w-full bg-slate-50 border-none rounded-xl px-5 py-3 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20"
                    required
                  >
                    <option value="">Category</option>
                    <option>Photography</option>
                    <option>Sports</option>
                    <option>Tech</option>
                    <option>Music</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Logistics</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    {...register("location")}
                    placeholder="Physical or Digital Location"
                    className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-5 py-3 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">About the Club</label>
                <textarea
                  {...register("description")}
                  placeholder="Describe the mission and activities..."
                  rows={3}
                  className="w-full bg-slate-50 border-none rounded-xl px-5 py-3 font-medium text-slate-700 focus:ring-2 focus:ring-blue-500/20 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Banner Upload</label>
                    <input
                        type="file"
                        {...register("bannerImage")}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Entry Fee (৳)</label>
                    <div className="relative">
                        <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input
                            type="number"
                            {...register("membershipFee")}
                            placeholder="0 for free"
                            className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-5 py-3 font-black text-slate-700 focus:ring-2 focus:ring-blue-500/20"
                            required
                        />
                    </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 text-white font-black uppercase tracking-[0.2em] py-4 rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center gap-3 transition-all active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-900 hover:shadow-none'}`}
              >
                {loading ? <span className="loading loading-spinner loading-xs"></span> : <FaRocket />}
                {loading ? "Processing..." : "Submit for Approval"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClub;