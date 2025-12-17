import { useForm } from "react-hook-form";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { imageUpload } from "../../../utils";
import toast from "react-hot-toast";

const CreateClub = () => {
  const { register, handleSubmit, reset } = useForm();
  const { user } = useContext(AuthContext);

  const onSubmit = async (data) => {
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

      await axios.post("http://localhost:3000/clubs", clubData);
      toast.success("Club created! Waiting for admin approval.");
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create club. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
          Create a New Club
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Fill in the details below to submit your club for approval
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            {...register("clubName")}
            placeholder="Club Name"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            required
          />

          <select
            {...register("category")}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            required
          >
            <option value="">Select Category</option>
            <option>Photography</option>
            <option>Sports</option>
            <option>Tech</option>
            <option>Music</option>
            <option>Arts</option>
          </select>
        </div>

        <input
          {...register("location")}
          placeholder="Location (City/Area)"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          required
        />

        <textarea
          {...register("description")}
          placeholder="Club Description"
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition resize-none"
          required
        />

        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Banner Image
          </label>
          <input
            type="file"
            {...register("bannerImage")}
            accept="image/*"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            required
          />
        </div>

        <input
          type="number"
          {...register("membershipFee")}
          placeholder="Membership Fee (0 = free)"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          required
        />

        <button
          type="submit"
          className="w-full bg-primary hover:bg-warning text-white font-bold py-3 rounded-xl shadow-lg transition-transform transform hover:scale-105"
        >
          Create Club
        </button>
      </form>
    </div>
  );
};

export default CreateClub;
