import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import profile_image from "../../assets/images/profile.avif";
import { USER_BASE_URL } from "../../config/Config";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav";

function CustomerProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("broom_auth"));
      const token = authData?.token;

      const res = await axios.get(`${USER_BASE_URL}/get-all-users?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data.data);
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Failed to load user!";
      toast.error(errorMsg);
    }
  };

  if (!user) return <div className="p-8">Loading user profile...</div>;

  const {
    first_name,
    last_name,
    email,
    phone,
    dob,
    gender,
    profile_picture,
    address,
    status,
  } = user;

  const fullAddress = `${address?.houseNumber || ""}, ${
    address?.street || ""
  }, ${address?.city || ""}, ${address?.state || ""}, ${
    address?.country || ""
  } - ${address?.zipCode || ""}`;

  return (
    <div className="main main_page flex flex-col ">
      <BreadcrumbsNav
  customTrail={[
    { label: "Users List", path: "/CustomerList" },
    { label: "User Profile", path: "/CustomerProfile/:id" },
  ]}
/>
      <div className="w-full flex justify-start translate-x-28">
        <h1 className="py-[10px] font-[600] text-[20px] flex justify-start">
          User Profile
        </h1>
      </div>
      <div className="w-5/6 p-8 mt-4 bg-white rounded-lg shadow-md pl-20">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left: Image */}
          <div className="flex flex-col items-center space-y-4 mr-[100px]">
            <img
              src={
                profile_picture
                  ? `${USER_BASE_URL}/${profile_picture}`
                  : profile_image
              }
              alt="Profile"
              className="w-50 h-50 rounded-full shadow-lg object-cover"
            />

            <div
              className={`px-3 py-1 w-1/2 text-sm font-semibold rounded-full
      ${
        status === "active"
          ? "bg-green-200 text-green-600"
          : status === "inactive"
          ? "bg-orange-200 text-orange-600"
          : "bg-red-200 text-red-600"
      }
    `}
            >
              {status}
            </div>
          </div>

          {/* Right: Details */}
          <div className="md:col-span-2 space-y-4 pr-0">
            <h2 className="text-lg font-semibold mb-5">Details</h2>
            <div className="grid grid-cols-2 border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-medium">Name</span>
              <span className="text-gray-800">
                {first_name} {last_name}
              </span>
            </div>
            <div className="grid grid-cols-2 border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-medium">Email</span>
              <span className="text-gray-800">{email}</span>
            </div>
            <div className="grid grid-cols-2 border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-medium">Mobile Number</span>
              <span className="text-gray-800">{phone}</span>
            </div>
            <div className="grid grid-cols-2 border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-medium">DOB</span>
              <span className="text-gray-800">{dob}</span>
            </div>
            <div className="grid grid-cols-2 border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-medium">Gender</span>
              <span className="text-gray-800">{gender}</span>
            </div>
            <div className="grid grid-cols-2 border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-medium">Address</span>
              <span className="text-gray-800">{fullAddress}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;
