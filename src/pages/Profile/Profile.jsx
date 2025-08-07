import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import profile_image from "../../assets/images/profile.avif";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config/Config";


function Profile() {
  const [profile, setProfile] = useState(null);
  const [roleName, setRoleName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("broom_auth"));
      const token = authData?.token;
      const userId = authData?.user?._id || authData?.user?.id;

      if (!token || !userId) {
        toast.error("User not logged in properly!");
        return;
      }

      const profileRes = await axios.get(
        `${BASE_URL}/admin/get-admin-byId/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const profileData = profileRes.data.data;
      setProfile(profileData);

      // Fetch role name
      const roleRes = await axios.get(
        `${BASE_URL}/admin/get-role-by-id/${profileData.role}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const roleName = roleRes.data.data.name;
      setRoleName(roleName);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to load profile!";
      toast.error(errorMessage);
    }
  };

  if (!profile) return <div className="p-8">Loading profile...</div>;

  const {
    first_name,
    last_name,
    email,
    phone,
    dob,
    gender,
    profile_picture,
    address,
  } = profile;

  const fullAddress = `${address?.houseNumber || ""}, ${
    address?.street || ""
  }, ${address?.city || ""}, ${address?.state || ""}, ${
    address?.country || ""
  } - ${address?.zipCode || ""}`;

  return (
    <div className="main main_page flex flex-col items-center">
      <div className="w-full flex justify-start translate-x-28">
        <h1 className="py-[10px] font-[600] text-[20px] flex justify-start">
          Profile
        </h1>
      </div>
      <div className="w-5/6 p-8 mt-4 bg-white rounded-lg shadow-md pl-20">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left Section - Profile Image and Role */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <img
              src={
                profile_picture
                  ? `${BASE_URL}/${profile_picture}`
                  : profile_image
              }
              alt="Profile"
              className="w-32 h-32 rounded-full shadow-lg object-cover"
            />
            <h2 className="text-2xl font-bold text-gray-800">
              {roleName || "N/A"}
            </h2>
            <button
              className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer"
              onClick={() => navigate("/ProfileUpdate")}
            >
              Edit Profile
            </button>
          </div>

          {/* Right Section - User Details */}
          <div className="md:col-span-2 space-y-4 pr-0">
            <h2 className="text-lg font-semibold mb-5">Details</h2>
            <div className="grid grid-cols-2  border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-medium">Name</span>
              <span className="text-gray-800">
                {first_name} {last_name}
              </span>
            </div>
            <div className="grid grid-cols-2  border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-medium">Email</span>
              <span className="text-gray-800">{email}</span>
            </div>
            <div className="grid grid-cols-2  border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-medium">Mobile Number</span>
              <span className="text-gray-800">{phone}</span>
            </div>
            <div className="grid grid-cols-2  border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-medium">DOB</span>
              <span className="text-gray-800">{dob}</span>
            </div>
            <div className="grid grid-cols-2  border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-medium">Gender</span>
              <span className="text-gray-800">{gender}</span>
            </div>
            <div className="grid grid-cols-2  border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-medium">Address</span>
              <span className="text-gray-800">{fullAddress}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
