import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../Context/AuthContext";
import { LuEyeClosed } from "react-icons/lu";
import { FaEye } from "react-icons/fa";
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

  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  const handlePasswordShow = (e) => {
    e.preventDefault();
    setShowPass(!showPass);
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
    <div className="hero base-200 min-h-screen">
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Register Now!</h1>
          <p className="py-6">
            Welcome! Sign up to keep your pets warm, safe & stylish.
          </p>
        </div>

        <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset className="fieldset">
                {/* Name */}
                <label className="label">Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Name"
                  {...register("name", {
                    required: true,
                    maxLength: {
                      value: 20,
                      message: "Name cannot be too long",
                    },
                  })}
                />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
                {nameError && <p className="text-red-500">{nameError}</p>}

                {/* Image */}
                <label className="label">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="input border p-2"
                  {...register("image", {
                    required: "Profile picture is required",
                  })}
                />
                {errors.image && (
                  <p className="text-red-500">{errors.image.message}</p>
                )}

                {/* Email */}
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
                      message: "Enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}

                {/* Password */}
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    className="input w-full"
                    placeholder="Password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Minimum 6 characters",
                      },
                    })}
                  />
                  <button
                    onClick={handlePasswordShow}
                    className="text-2xl absolute top-2 right-4"
                  >
                    {showPass ? <FaEye /> : <LuEyeClosed />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}

                {/* Terms */}
                <label className="label flex gap-2">
                  <input
                    type="checkbox"
                    className="checkbox"
                    {...register("terms", { required: true })}
                  />
                  Accept our terms and conditions
                </label>

                {/* Error and Success */}
                {success && (
                  <p className="text-green-500">
                    Account Created Successfully!
                  </p>
                )}

                {error && <p className="text-red-500">{error}</p>}

                {/* Register Button */}
                <button type="submit" className="btn btn-success text-white">
                  Register
                </button>

                {/* Google */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="btn bg-white border mt-2"
                >
                  <FcGoogle /> Login with Google
                </button>

                <p className="mt-2">
                  Already have an account?{" "}
                  <Link className="text-amber-700" to="/login">
                    Sign in
                  </Link>
                </p>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
