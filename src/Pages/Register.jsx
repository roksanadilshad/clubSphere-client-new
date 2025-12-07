import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../Context/AuthContext";
import { LuEyeClosed } from "react-icons/lu";
import { FaEye, FaEyeSlash, FaUpload } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { imageUpload } from "../utils";

const Registration = () => {
  const {
    createUser,
    setUser,
    signInWithGoogle,
    updateUserProfile,
    loading,
  } = useContext(AuthContext);
  const [nameError, setNameError] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const imageFile = watch("image");

  // Preview image
  React.useEffect(() => {
    if (imageFile && imageFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(imageFile[0]);
    }
  }, [imageFile]);

  const onSubmit = async (data) => {
    const { name, image, email, password, terms } = data;

    if (!terms) {
      setError("You must accept terms & conditions");
      return;
    }

    // Validate password
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-[\]{};':"\\|,.<>/?`~]).{6,}$/;
    if (!passwordPattern.test(password)) {
      setError(
        "Password must contain at least 6 characters, 1 uppercase, 1 lowercase, and 1 special character."
      );
      return;
    }

    if (name.length < 5) {
      setNameError("Name should contain at least 5 characters");
      return;
    }

    setNameError("");
    setError("");
    setSuccess(false);

    try {
      // 1. Upload image
      const uploadedImage = image[0];
      const imageURL = await imageUpload(uploadedImage);

      // 2. Create User
      const result = await createUser(email, password);

      // 3. Update Profile
      await updateUserProfile(name, imageURL);
      setUser({ ...result.user, displayName: name, photoURL: imageURL });

      setSuccess(true);
      toast.success("Signup Successful");
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then(() => {
        toast.success("Google Login Successful");
        navigate(from, { replace: true });
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div>
        <title>ClubSphere - Sign Up</title>
      </div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Join ClubSphere
          </h1>
          <p className="text-gray-600 text-sm">
            Create your account and start connecting with communities
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Error/Success Alert */}
          {(error || success) && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                success
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <p
                className={`text-sm text-center ${
                  success ? "text-green-700" : "text-red-700"
                }`}
              >
                {success ? "Account Created Successfully!" : error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Profile Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUpload className="text-gray-400 text-2xl" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="cursor-pointer inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      {...register("image", {
                        required: "Profile picture is required",
                      })}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG or GIF (Max 2MB)
                  </p>
                </div>
              </div>
              {errors.image && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.name || nameError
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                } focus:outline-none focus:ring-2 transition-colors`}
                placeholder="John Doe"
                {...register("name", {
                  required: "Name is required",
                  maxLength: {
                    value: 20,
                    message: "Name cannot exceed 20 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
              {nameError && (
                <p className="text-red-600 text-sm mt-1">{nameError}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                } focus:outline-none focus:ring-2 transition-colors`}
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  } focus:outline-none focus:ring-2 transition-colors pr-12`}
                  placeholder="Create a strong password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPass ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Must contain uppercase, lowercase, and special character
              </p>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                {...register("terms", { required: true })}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg border border-gray-300 transition-colors duration-200 shadow-sm hover:shadow"
          >
            <FcGoogle size={24} />
            <span>Continue with Google</span>
          </button>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
