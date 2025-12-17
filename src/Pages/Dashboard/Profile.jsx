import React, { useContext, useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../Context/AuthContext";
import { imageUpload } from "../../utils";
import { FaUser, FaEnvelope, FaCamera, FaSave, FaShieldAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import axiosSecure from "../../api/axiosSecure";

const Profile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data: dbUser, isLoading } = useQuery({
    queryKey: ["dbUser", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`http://localhost:3000/users/${user.email}`);
     return res.data
    },
    enabled: !!user?.email,
  });

  const [imagePreview, setImagePreview] = useState(user?.photoURL);
//console.log(user);
  // Combine Firebase user + db user safely
  const currentUser = useMemo(() => {
    return {
      name: user?.displayName || "",
      email: user?.email || "",
      photoURL: user?.photoURL || "",
      role: dbUser?.role || "user",
      createdAt: dbUser?.createdAt || null,
      clubsCount: dbUser?.clubsCount || 0,
      eventsCount: dbUser?.eventsCount || 0,
      totalSpent: dbUser?.totalSpent || 0,
    };
  }, [user, dbUser]);


  // React Hook Form
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: { name: currentUser.name },
  });

  // Reset form when dbUser loads
  useEffect(() => {
    reset({ name: currentUser.name });
    setImagePreview(currentUser.photoURL);
  }, [currentUser, reset]);

  const photoFile = watch("photo");

  // Image preview
  useEffect(() => {
    if (photoFile && photoFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(photoFile[0]);
    }
  }, [photoFile]);

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      let photoURL = currentUser.photoURL;

      if (data.photo && data.photo[0]) {
        photoURL = await imageUpload(data.photo[0]);
      }

      // Update Firebase profile
      await updateUserProfile(data.name, photoURL);

      // Update DB user
      const res = await fetch(`http://localhost:3000/users/${currentUser.email}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          photoURL,
        }),
      });

      if (!res.ok) throw new Error("Failed to update DB user");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries(["dbUser", user.email]);
    },
    onError: () => toast.error("Something went wrong"),
  });

  if (isLoading) return <p>Loading...</p>;
//console.log(currentUser);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <img
                src={imagePreview}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                alt="Profile"
              />
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer">
                <FaCamera className="text-white" />
                <input type="file" className="hidden" {...register("photo")} />
              </label>
            </div>

            <h2 className="text-xl font-bold">{currentUser.name}</h2>
            <p className="text-gray-600">{currentUser.email}</p>

            <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
              <FaShieldAlt />
              {currentUser.role}
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="font-medium">
              {currentUser.createdAt
                ? new Date(currentUser.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="bg-white p-8 rounded-xl shadow lg:col-span-2">
          <form
            onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
            className="space-y-6"
          >
            {/* Name */}
            <div>
              <label className="block mb-2 font-medium">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-12 pr-4 py-3 border rounded-lg"
                  {...register("name", { required: true })}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 font-medium">Email</label>
              <input
                className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                value={currentUser.email}
                disabled
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              <FaSave className="inline mr-2" />
              {updateMutation.isLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
