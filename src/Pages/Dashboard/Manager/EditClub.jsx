import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom"; // use react-router-dom
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { FaUpload, FaSave, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { imageUpload } from "../../../utils"; // your utility to upload images
import axiosSecure from "../../../api/axiosSecure";

const EditClub = () => {
  const { clubId } = useParams(); // must match the router path param
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
  enabled: !!clubId, // only fetch if clubId exists
});

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });
//console.log(club);

  // Set default values once club data is loaded
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

  // Watch bannerImage file input for preview
  const bannerImage = watch("bannerImage");
  useEffect(() => {
    if (bannerImage && bannerImage[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(bannerImage[0]);
    }
  }, [bannerImage]);

  // Mutation to update club
  const updateClubMutation = useMutation({
    mutationFn: async (data) => {
      let bannerUrl = club.bannerImage;

      // Upload new image if selected
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
      toast.success("Club updated successfully!");
      queryClient.invalidateQueries(["club", clubId]);
      queryClient.invalidateQueries(["managerClubs"]);
      navigate("/dashboard/manager/clubs");
    },
    onError: (err) => toast.error("Failed to update club.", err),
  });

  const onSubmit = (data) => updateClubMutation.mutate(data);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Club</h1>
        <p className="text-gray-600">Update your club information</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Banner Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Club Banner
            </label>
            <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 mb-2">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <FaUpload className="text-4xl text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Upload banner image</p>
                </div>
              )}
            </div>
            <label className="cursor-pointer inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm">
              Choose Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register("bannerImage")}
              />
            </label>
          </div>

          {/* Club Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Club Name *
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter club name"
              {...register("name", { required: "Club name is required" })}
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your club..."
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("category", { required: "Category is required" })}
              >
                <option value="">Select category</option>
                <option>Sports & Fitness</option>
                <option>Arts & Culture</option>
                <option>Technology</option>
                <option>Music</option>
                <option>Food & Drink</option>
                <option>Outdoor</option>
              </select>
              {errors.category && (
                <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="City, State"
                {...register("location", { required: "Location is required" })}
              />
              {errors.location && (
                <p className="text-red-600 text-sm mt-1">{errors.location.message}</p>
              )}
            </div>
          </div>

          {/* Membership Fee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Membership Fee ($/month) *
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              {...register("membershipFee", {
                required: "Membership fee is required",
                min: { value: 0, message: "Fee must be positive" },
              })}
            />
            {errors.membershipFee && (
              <p className="text-red-600 text-sm mt-1">{errors.membershipFee.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={updateClubMutation.isLoading}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <FaSave />
              {updateClubMutation.isLoading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/manager/clubs")}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <FaTimes />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClub;
