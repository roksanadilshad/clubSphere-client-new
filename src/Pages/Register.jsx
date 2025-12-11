import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../Context/AuthContext";
import { FaEye, FaEyeSlash, FaUpload } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { imageUpload } from "../utils";
import { saveUser } from "../api/saveUser";
import { auth } from "../firebase/firebase.init";

const Registration = () => {
  const { createUser, setUser, signInWithGoogle, updateUserProfile, loading } =
    useContext(AuthContext);
  const [nameError, setNameError] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const imageFile = watch("image");

  // Preview selected image
  React.useEffect(() => {
    if (imageFile && imageFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(imageFile[0]);
    }
  }, [imageFile]);

  const onSubmit = async (data) => {
    const { name, image, email, password, terms } = data;

    if (!terms) {
      setError("You must accept terms & conditions");
      return;
    }

    if (name.length < 5) {
      setNameError("Name should contain at least 5 characters");
      return;
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-[\]{};':"\\|,.<>/?`~]).{6,}$/;
    if (!passwordPattern.test(password)) {
      setError(
        "Password must contain at least 6 characters, 1 uppercase, 1 lowercase, and 1 special character."
      );
      return;
    }

    setError("");
    setNameError("");
    setSuccess(false);

    try {
      //  Upload image
      const photoURL = await imageUpload(image[0]);

      //  Create Firebase user
      const result = await createUser(email, password);

      //  Update Firebase profile
      await updateUserProfile(name, photoURL);

      //  Reload user to ensure displayName/photoURL exist
      await auth.currentUser.reload();
      const updatedUser = auth.currentUser;

      // Set user in context
      setUser(updatedUser);

      //  Save user to your MongoDB
      await saveUser({
        uid: updatedUser.uid,
        displayName: updatedUser.displayName,
        email: updatedUser.email,
        photoURL: updatedUser.photoURL,
      });

      toast.success("Signup Successful");
      setSuccess(true);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const googleUser = result.user;

      // Save Google user to MongoDB
      await saveUser({
        uid: googleUser.uid,
        displayName: googleUser.displayName,
        email: googleUser.email,
        photoURL: googleUser.photoURL,
      });

      setUser(googleUser);
      toast.success("Google Login Successful");
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Join ClubSphere
          </h1>
          <p className="text-gray-600 text-sm">
            Create your account and start connecting with communities
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {(error || success) && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              }`}
            >
              <p className={`text-sm text-center ${success ? "text-green-700" : "text-red-700"}`}>
                {success ? "Account Created Successfully!" : error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
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
                      {...register("image", { required: "Profile picture is required" })}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (Max 2MB)</p>
                </div>
              </div>
              {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image.message}</p>}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.name || nameError
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                } focus:outline-none focus:ring-2 transition-colors`}
                {...register("name", { required: "Name is required", maxLength: { value: 20, message: "Name cannot exceed 20 characters" } })}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
              {nameError && <p className="text-red-600 text-sm mt-1">{nameError}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"} focus:outline-none focus:ring-2 transition-colors`}
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/, message: "Enter a valid email address" },
                })}
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Create a strong password"
                  className={`w-full px-4 py-3 rounded-lg border ${errors.password ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"} focus:outline-none focus:ring-2 transition-colors pr-12`}
                  {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">
                  {showPass ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" {...register("terms", { required: true })} />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Google Login */}
          <div className="relative my-6 text-center">
            <span className="px-4 bg-white text-gray-500">Or continue with</span>
          </div>
          <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg border border-gray-300 transition-colors duration-200 shadow-sm hover:shadow">
            <FcGoogle size={24} />
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
