"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit2, FiLogOut, FiSave, FiX } from "react-icons/fi";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import { getUserProfile } from "../../../server/getUserProfile";
import { getSession } from "next-auth/react";
import updateUserProfile from "../../../server/updateUserProfile";
import { signOut } from "next-auth/react";
import TransactionLoading from "@/components/TransactionLoading";
import uploadToImgBB from "../../../server/uploadToImgBB";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import CSS for Toastify

export default function ProfilePage() {
  // State variables for managing component data and user interactions
  const [isFetching, setIsFetching] = useState(true); // Track if the profile data is being fetched
  const [isEditing, setIsEditing] = useState(false); // Track whether the user is in edit mode
  const [showEnlargedImage, setShowEnlargedImage] = useState(false); // Show/hide enlarged profile image modal
  const [ageError, setAgeError] = useState<string>(""); // Store age validation error message
  const fileInputRef = useRef<HTMLInputElement>(null); // Reference to the file input for photo upload
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    age: "",
    gender: "",
    photoURL: "",
  }); // Store the user's profile data

  // Fetch user profile data when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const session = await getSession(); // Get the current user session
        if (!session) {
          toast.error("No session found, please log in."); // Notify if session not found
          return;
        }
        toast.info("Fetching profile..."); // Show loading toast
        const response = await getUserProfile(session.user.email); // Fetch user profile data from the server
        setIsFetching(false); // Stop the fetching state
        if (response) {
          toast.success("Profile fetched successfully!"); // Show success toast
          setProfileData({
            username: response.username,
            email: response.email,
            age: response.age.toString(),
            gender: response.gender,
            photoURL: response.photoURL,
          });
        }
      } catch {
        toast.error("Failed to fetch profile. Please try again later."); // Show error if fetching fails
      }
    };

    fetchProfile(); // Call the fetch function
  }, []);

  // Handle profile photo click (open file input in edit mode or enlarge image in view mode)
  const handlePhotoClick = () => {
    if (isEditing) {
      fileInputRef.current?.click(); // Trigger file input click if in edit mode
    } else {
      setShowEnlargedImage(true); // Show enlarged image modal in view mode
    }
  };

  // Handle profile photo change (upload new image)
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the selected file
    if (file) {
      try {
        toast.info("Uploading photo..."); // Show upload toast
        const uploadedImageUrl = await uploadToImgBB(file); // Upload the photo to ImgBB
        setProfileData((prev) => ({ ...prev, photoURL: uploadedImageUrl })); // Update profile photo URL
        toast.success("Photo uploaded successfully."); // Show success toast
      } catch {
        toast.error("Error uploading image. Please try again."); // Show error toast if upload fails
      }
    }
  };

  // Handle form input change for editable fields (username, age, gender)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "username") {
      const cleanedValue = value.replace(/\s/g, ""); // Remove spaces from username
      setProfileData((prev) => ({ ...prev, [name]: cleanedValue })); // Update username
    } else if (name === "age") {
      setProfileData((prev) => ({ ...prev, age: value })); // Update age
      const ageValue = parseInt(value);
      // Validate age input (should be between 16 and 150)
      if (value && (ageValue < 16 || ageValue > 150)) {
        setAgeError("Age must be between 16 and 150"); // Set age error message
      } else {
        setAgeError(""); // Clear age error
      }
    } else {
      setProfileData((prev) => ({ ...prev, [name]: value })); // Update other fields
    }
  };

  // Function to update user profile on the server
  const updateProfile = async (credentials: {
    username: string;
    email: string;
    age: string;
    gender: string;
    photoURL: string;
  }) => {
    try {
      toast.info("Updating profile..."); // Show updating toast
      const response = await updateUserProfile(credentials); // Send update request to server
      if (response.success) {
        toast.success("Profile updated successfully."); // Show success toast
      }
    } catch {
      toast.error("Failed to update profile. Please try again."); // Show error toast if update fails
    }
  };

  // Handle save button click (validate age and update profile)
  const handleSave = () => {
    if (ageError) {
      toast.error("Please fix the age error before saving."); // Show error if age is invalid
      return;
    }
    setIsEditing(false); // Exit edit mode
    updateProfile(profileData); // Update profile
  };

  // Handle user logout
  const handleLogout = () => {
    const logout = async () => {
      try {
        toast.info("Logging out..."); // Show logout toast
        await signOut({ callbackUrl: "/" }); // Sign out the user
        toast.success("Logged out successfully."); // Show success toast
      } catch {
        toast.error("Failed to logout. Please try again."); // Show error toast if logout fails
      }
    };
    logout(); // Call logout function
  };

  return (
    <div className="flex">
      <ToastContainer /> {/* Display ToastContainer for toast notifications */}
      <Navigation /> {/* Navigation bar */}
      <div className="flex-1 md:ml-64 p-4">
        <div className="min-h-[95vh] bg-black flex items-center justify-center px-4">
          <div className="relative p-1 lg:p-1 rounded-2xl bg-gray-900 shadow-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl -m-[2px] animate-gradient-border bg-[length:200%_200%]"></div>
              <div className="relative bg-gray-900 rounded-2xl shadow-xl p-8 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Profile
                  </h1>
                  <div className="group relative">
                    <button
                      onClick={handleLogout}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <FiLogOut size={24} /> {/* Logout button */}
                    </button>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition">
                      Logout {/* Tooltip for logout */}
                    </span>
                  </div>
                </div>

                {/* Profile photo and edit/save button */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div
                      className={`w-32 h-32 rounded-full overflow-hidden ${
                        isEditing ? "cursor-pointer" : ""
                      } border-4 border-blue-500/30 hover:border-blue-500/50 transition`}
                      onClick={handlePhotoClick}
                    >
                      <Image
                        src={
                          profileData.photoURL ||
                          "https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png"
                        }
                        alt="Profile"
                        width={128}
                        height={128}
                        className="object-cover"
                      />
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  <button
                    onClick={() =>
                      isEditing ? handleSave() : setIsEditing(true)
                    }
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-400 transition"
                  >
                    {isEditing ? (
                      <>
                        <FiSave size={20} />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <FiEdit2 size={20} />
                        Edit Profile
                      </>
                    )}
                  </button>
                </div>

                {/* Profile fields (username, email, age, gender) */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm">Username</label>
                    {isFetching ? (
                      <TransactionLoading items={1} /> // Show loading spinner while fetching
                    ) : (
                      <input
                        type="text"
                        name="username"
                        value={profileData.username || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition disabled:opacity-50"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm">Email</label>
                    {isFetching ? (
                      <TransactionLoading items={1} /> // Show loading spinner for email
                    ) : (
                      <input
                        type="email"
                        value={profileData.email || ""}
                        disabled
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 opacity-50 cursor-not-allowed"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-gray-400 text-sm">Age</label>
                      {isFetching ? (
                        <TransactionLoading items={1} width="w-36" /> // Show loading spinner for age
                      ) : (
                        <input
                          type="number"
                          name="age"
                          value={profileData.age || ""}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full bg-gray-800 text-white rounded-lg px-4 py-3 border ${
                            ageError ? "border-red-500" : "border-gray-700"
                          } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition disabled:opacity-50`}
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-gray-400 text-sm">Gender</label>
                      {isFetching ? (
                        <TransactionLoading items={1} width="w-36" /> // Show loading spinner for gender
                      ) : (
                        <select
                          name="gender"
                          value={profileData.gender || ""}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition disabled:opacity-50"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      )}
                    </div>
                  </div>
                  {ageError && (
                    <p className="text-red-500 text-sm mt-1">{ageError}</p> // Show age error message
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enlarged Image Modal */}
          <AnimatePresence>
            {showEnlargedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={() => setShowEnlargedImage(false)}
              >
                <div className="relative max-w-2xl w-full">
                  <button
                    onClick={() => setShowEnlargedImage(false)}
                    className="absolute -top-10 right-0 text-white hover:text-gray-300"
                  >
                    <FiX size={24} /> {/* Close modal button */}
                  </button>
                  <Image
                    src={
                      profileData.photoURL ||
                      "https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png"
                    }
                    alt="Profile"
                    width={600}
                    height={600}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
