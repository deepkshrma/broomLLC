import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_BASE_URL } from "../../config/Config";
import PageTitle from "../../components/common/PageTitle";
import { toast } from "react-toastify";

const ViewBanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem("broom_auth"));
        const token = authData?.token;

        if (!token) {
          toast.error("Login expired. Please log in again.");
          return;
        }

        const response = await axios.get(`${USER_BASE_URL}/admin/get-banners`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { id },
        });

        const data = response.data.data?.[0];
        if (data) {
          setBanner(data);
        } else {
          toast.error("Banner not found.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load banner.");
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <PageTitle title="View Banner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="p-6">
        <PageTitle title="View Banner" />
        <p className="text-gray-500">No banner data found.</p>
      </div>
    );
  }

  return (
    <div className="px-[20px] mb-[100px] main main_page">
      <PageTitle title="View Banner" />

      <div className="bg-white p-6 rounded shadow w-full max-w-2xl mx-auto mt-4">
        {/* Name and Type on the same line */}
        
        <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-4 mb-4">
          <div className="w-full md:w-auto">
            <p className="text-gray-800">
              <span className="font-semibold text-gray-600">Name: </span>
              {banner.name}
            </p>
          </div>
          <div className="w-full md:w-auto">
            <p className="text-gray-800 capitalize">
              <span className="font-semibold text-gray-600">Type: </span>
              {banner.type.replace("_", " ")}
            </p>
          </div>
        </div>

        {/* Status */}
        {/* Status */}
        <div className="mb-4">
          <p className="text-gray-800">
            <span className="font-semibold text-gray-600">Status: </span>
            <span
              className={`px-3 py-1 rounded text-sm font-medium inline-block ${
                banner.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {banner.status}
            </span>
          </p>
        </div>

        {/* Image */}
        {/* Image */}
        <div className="mb-4">
          <label className="block font-semibold text-gray-600 mb-2">
            Image:
          </label>
          <div className="w-full max-w-md h-[200px] rounded border overflow-hidden">
            <img
              src={`${USER_BASE_URL}/${banner.image}`}
              alt={banner.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Go Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ViewBanner;
