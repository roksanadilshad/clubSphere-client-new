import { useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { AuthContext } from "../Context/AuthContext";
import axiosPublic from "../api/axiosPublic";
import toast from "react-hot-toast";

export default function ApplyManager() {
  const { user } = useContext(AuthContext);

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
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

  const onSubmit = async (data) => {
    if (!data.agree) {
      return toast.success("You must agree to the terms");
    }

    try {
      await axiosPublic.post("/manager/apply", {
        ...data,
        email: user?.email,
      });
      toast.success("Application submitted successfully");
    } catch (err) {
      toast.error("Something went wrong", err);
    }
  };

  const watchCategories = watch("preferredCategories", []);

  return (
    <div className="max-w-3xl mx-auto p-6  rounded-2xl shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Apply to Become a Manager
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
        <input
          {...register("fullName", { required: true })}
          type="text"
          placeholder="Full Name"
          className="w-full p-3 rounded  outline-1"
        />
        {errors.fullName && <p className="text-red-500">Full Name is required</p>}

        <input
          type="email"
          value={user?.email || ""}
          disabled
          className="w-full p-3 rounded  outline-1 bg-gray-100"
        />

        <input
          {...register("phone", { required: true })}
          type="text"
          placeholder="Phone Number"
          className="w-full p-3 rounded  outline-1"
        />
        {errors.phone && <p className="text-red-500">Phone Number is required</p>}

        <input
          {...register("occupation")}
          type="text"
          placeholder="Occupation"
          className="w-full p-3 rounded  outline-1"
        />

        <input
          {...register("organization")}
          type="text"
          placeholder="Organization / University (optional)"
          className="w-full p-3 rounded  outline-1"
        />

        <textarea
          {...register("experience")}
          placeholder="Your experience"
          className="w-full p-3 rounded  outline-1"
          rows={3}
        />

        <textarea
          {...register("reason", { required: true })}
          placeholder="Why do you want to be a manager?"
          className="w-full p-3 rounded  outline-1"
          rows={3}
        />
        {errors.reason && <p className="text-red-500">This field is required</p>}

        <div>
          <p className="font-medium text-[#850E35] mb-2">Preferred Club Categories</p>
          <div className="flex flex-wrap gap-2">
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
                        value.includes(cat)
                          ? value.filter((c) => c !== cat)
                          : [...value, cat]
                      );
                    }}
                    className={`px-3 py-1 rounded-full border ${
                      watchCategories.includes(cat) ? "bg-[#EE6983] text-white" : "bg-white"
                    }`}
                  >
                    {cat}
                  </button>
                )}
              />
            ))}
          </div>
        </div>

        <input
          {...register("idNumber", { required: true })}
          type="text"
          placeholder="NID / Student ID Number"
          className="w-full p-3 rounded  outline-1"
        />
        {errors.idNumber && <p className="text-red-500">ID Number is required</p>}

        <input
          {...register("idDocumentUrl", { required: true })}
          type="url"
          placeholder="ID Document Image URL"
          className="w-full p-3 rounded  outline-1"
        />
        {errors.idDocumentUrl && <p className="text-red-500">Document URL is required</p>}

        <label className="flex items-center gap-2">
          <input
            {...register("agree")}
            type="checkbox"
          />
          <span className="text-sm">I agree to the platform terms & rules</span>
        </label>

        <button
          type="submit"
          className="w-full bg-[#EE6983] text-white py-3 rounded font-semibold hover:opacity-90"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}