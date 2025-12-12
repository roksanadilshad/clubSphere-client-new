import { useForm } from "react-hook-form";
import axios from "axios";
import { use } from "react";
import { AuthContext } from "../Context/AuthContext";
import { imageUpload } from "../utils";
 // your auth hook

const CreateClub = () => {
  const { register, handleSubmit, reset } = useForm();
  const { user } = use(AuthContext); // logged-in user

  const onSubmit = async (data) => {
    const file = data.bannerImage[0];

    // Upload image to your server or imgbb/cloudinary
    const uploadedUrl = await imageUpload(file)

    const clubData = {
    clubName: data.clubName,
    description: data.description,
    category: data.category,
    location: data.location,
    membershipFee: Number(data.membershipFee),
    bannerImage: uploadedUrl,  // <<--- use this
    status: "pending",
    managerEmail: user.email,
    createdAt: new Date(),
    updatedAt: new Date(),
  };


    await axios.post("http://localhost:3000/clubs", clubData);

    alert("Club created! Waiting for admin approval.");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl mx-auto">

      <input {...register("clubName")} placeholder="Club Name" className="input" required />

      <textarea {...register("description")} placeholder="Club Description" className="input" required />

      <select {...register("category")} className="input" required>
        <option value="">Select category</option>
        <option>Photography</option>
        <option>Sports</option>
        <option>Tech</option>
        <option>Music</option>
        <option>Arts</option>
      </select>

      <input {...register("location")} placeholder="Location (City/Area)" className="input" required />

      <input type="file" {...register("bannerImage")} required />

      <input
        type="number"
        {...register("membershipFee")}
        placeholder="Membership Fee (0 = free)"
        className="input"
        required
      />

      <button className="btn-primary">Create Club</button>
    </form>
  );
};

export default CreateClub;
