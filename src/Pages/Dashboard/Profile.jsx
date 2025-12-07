import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../Context/AuthContext";
import { FaUser, FaEnvelope, FaCamera, FaSave, FaShieldAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [imagePreview, setImagePreview] = useState(user?.photoURL);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
    },
  });

  const photoFile = watch("photo");

  // Preview image
  React.useEffect(() => {
    if (photoFile && photoFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(photoFile[0]);
    }
  }, [photoFile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      // Upload image if changed
      let photoURL = user?.photoURL;
      if (data.photo && data.photo[0]) {
        // Upload to your storage service
        const formData = new FormData();
        formData.append("image", data.photo[0]);
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadResponse.json();
        photoURL = uploadData.url;
      }

      // Update user profile
      await updateUserProfile(data.name, photoURL);

      // Update in database
      const response = await fetch(`/api/users/${user.email}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          photoURL,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      toast.success("Profile updated successfully");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <img
                  src={imagePreview || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                />
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                  <FaCamera className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...register("photo")}
                  />
                </label>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {user?.displayName}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{user?.email}</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                <FaShieldAlt />
                <span className="capitalize">{user?.role || "member"}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium text-gray-900">
                    {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Account Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Personal Information
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 3,
                        message: "Name must be at least 3 characters",
                      },
                    })}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    value={user?.email}
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Role (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Role
                </label>
                <div className="relative">
                  <FaShieldAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed capitalize"
                    value={user?.role || "member"}
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Contact admin to change your role
                </p>
              </div>

              {/* Save Button */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isLoading}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave />
                  {updateProfileMutation.isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Account Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Clubs Joined</p>
              <p className="text-2xl font-bold text-gray-900">
                {user?.clubsCount || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Events Attended</p>
              <p className="text-2xl font-bold text-gray-900">
                {user?.eventsCount || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                ${user?.totalSpent || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
