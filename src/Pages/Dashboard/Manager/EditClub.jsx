import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaUpload, FaSave, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

const EditClub = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch club data
  const { data: club, isLoading } = useQuery({
    queryKey: ["club", clubId],
    queryFn: async () => {
      const response = await fetch(`/api/clubs/${clubId}`);
      if (!response.ok) throw new Error("Failed to fetch club");
      return response.json();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: club,
  });

  const bannerImage = watch("bannerImage");

  // Preview image
  React.useEffect(() => {
    if (bannerImage && bannerImage[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(bannerImage[0]);
    }
  }, [bannerImage]);

  // Update club mutation
  const updateClubMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(`/api/clubs/${clubId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update club");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["club", clubId]);
      queryClient.invalidateQueries(["managerClubs"]);
      toast.success("Club updated successfully");
      navigate("/dashboard/manager/clubs");
    },
    onError: () => {
      toast.error("Failed to update club");
    },
  });

  const onSubmit = (data) => {
    updateClubMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
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
            <div className="flex items-start gap-6">
              <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                {imagePreview || club?.bannerImage ? (
                  <img
                    src={imagePreview || club?.bannerImage}
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
            </div>
            <label className="mt-3 cursor-pointer inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm">
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
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Category and Location */}
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
                <option value="Sports & Fitness">Sports & Fitness</option>
                <option value="Arts & Culture">Arts & Culture</option>
                <option value="Technology">Technology</option>
                <option value="Music">Music</option>
                <option value="Food & Drink">Food & Drink</option>
                <option value="Outdoor">Outdoor</option>
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
              <p className="text-red-600 text-sm mt-1">
                {errors.membershipFee.message}
              </p>
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
