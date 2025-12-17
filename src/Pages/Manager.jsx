import { useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { AuthContext } from "../Context/AuthContext";
import axiosPublic from "../api/axiosPublic";
import toast from "react-hot-toast";
import { FaUserShield, FaPhone, FaBriefcase, FaIdCard, FaCheckCircle } from "react-icons/fa";

export default function ApplyManager() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, watch, formState: { errors }, reset } = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      occupation: "",
      organization: "",
      experience: "",
      reason: "",
      preferredCategories: [],
      idNumber: "",
      idDocumentUrl: "",
      agree: false
    }
  });

  const categories = ["Tech", "Photography", "Sports", "Cultural", "Business"];
  const watchCategories = watch("preferredCategories", []);

  const onSubmit = async (data) => {
    if (!data.agree) {
      return toast.error("You must agree to the terms to proceed");
    }

    setLoading(true);
    try {
      await axiosPublic.post("/manager/apply", {
        ...data,
        email: user?.email,
        status: "pending",
        appliedAt: new Date(),
      });
      toast.success("Application sent! Our admins will review it soon.");
      reset();
    } catch (err) {
      toast.error("Submission failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-8 md:p-12">
          {/* Header */}
          <header className="mb-10 text-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaUserShield size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Manager <span className="text-rose-500">Onboarding</span></h1>
            <p className="text-slate-500 font-medium">Verify your identity and tell us about your vision for club leadership.</p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Section 1: Basic Info */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Legal Name</label>
                <input
                  {...register("fullName", { required: "Name is required" })}
                  placeholder="As it appears on ID"
                  className={`w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-700 focus:ring-2 ${errors.fullName ? 'ring-2 ring-rose-500/20' : 'focus:ring-slate-200'}`}
                />
                {errors.fullName && <p className="text-rose-500 text-[10px] font-bold uppercase ml-2">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Phone Connection</label>
                <div className="relative">
                  <FaPhone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    {...register("phone", { required: "Phone is required" })}
                    placeholder="+880..."
                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-5 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Professional Background */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Current Occupation</label>
                <input
                  {...register("occupation")}
                  placeholder="e.g. Student, Software Engineer"
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Organization</label>
                <input
                  {...register("organization")}
                  placeholder="University or Workplace"
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-slate-200"
                />
              </div>
            </section>

            {/* Section 3: Experience & Reason */}
            <section className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Leadership Experience</label>
                <textarea
                  {...register("experience")}
                  placeholder="Describe any previous clubs or teams you've managed..."
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-medium text-slate-700 focus:ring-2 focus:ring-slate-200 min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Vision for Leadership</label>
                <textarea
                  {...register("reason", { required: "Please provide a reason" })}
                  placeholder="Why do you want to lead clubs on this platform?"
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-medium text-slate-700 focus:ring-2 focus:ring-slate-200 min-h-[100px]"
                />
              </div>
            </section>

            {/* Section 4: Categories */}
            <div className="p-8 bg-slate-50 rounded-[2rem] space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <FaBriefcase size={12}/> Target Club Categories
              </label>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <Controller
                    key={cat}
                    name="preferredCategories"
                    control={control}
                    render={({ field }) => (
                      <button
                        type="button"
                        onClick={() => {
                          const value = field.value || [];
                          field.onChange(
                            value.includes(cat) ? value.filter((c) => c !== cat) : [...value, cat]
                          );
                        }}
                        className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
                          watchCategories.includes(cat) 
                          ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200" 
                          : "bg-white border-transparent text-slate-400 hover:border-slate-200"
                        }`}
                      >
                        {cat}
                      </button>
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Section 5: Verification */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                  <FaIdCard /> Identification Number
                </label>
                <input
                  {...register("idNumber", { required: true })}
                  placeholder="NID / Student ID"
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">ID Document Link</label>
                <input
                  {...register("idDocumentUrl", { required: true })}
                  placeholder="Cloud storage link to ID scan"
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-700"
                />
              </div>
            </section>

            {/* Footer Consent */}
            <div className="flex flex-col items-center gap-6 pt-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  {...register("agree")}
                  type="checkbox"
                  className="w-5 h-5 rounded-lg border-slate-300 text-rose-500 focus:ring-rose-500/20"
                />
                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800 transition-colors">I certify that all provided info is legal and accurate</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-rose-500 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {loading ? <span className="loading loading-spinner loading-sm"></span> : <FaCheckCircle />}
                {loading ? "Verifying..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}