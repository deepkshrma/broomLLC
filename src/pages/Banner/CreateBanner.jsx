import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import { toast } from "react-toastify";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { USER_BASE_URL } from "../../config/Config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const bannerTypes = [
  "advt_banner",
  "offer_banner",
  "promo_banner",
  "coupon_banner",
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

function CreateBanner() {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingImage, setExistingImage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "",
    image: null,
  });
  const { id } = useParams();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (id) {
      const fetchBanner = async () => {
        try {
          const authData = JSON.parse(localStorage.getItem("broom_auth"));
          const token = authData?.token;

          const response = await axios.get(
            `${USER_BASE_URL}/admin/get-banners?id=${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const banner = response.data.data[0];
          console.log("Banner fetch response:", response.data);

          setFormData({
            name: banner.name || "",
            type: banner.type || "",
            status: banner.status || "",
            image: null, 
          });

          if (banner.image) {
            setExistingImage(`${USER_BASE_URL}/${banner.image}`);
          }
        } catch (error) {
          toast.error("Failed to load banner for editing.");
        }
      };

      fetchBanner();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image && !existingImage) {
      toast.error("Please upload a banner image.");
      return;
    }

    setLoading(true);

    try {
      const authData = JSON.parse(localStorage.getItem("broom_auth"));
      const token = authData?.token;
      if (!token) {
        toast.error("Login expired. Please log in again.");
        return;
      }

      const data = new FormData();
      data.append("name", formData.name);
      data.append("type", formData.type);
      data.append("status", formData.status);
      if (formData.image) {
        data.append("image", formData.image);
      }

      if (id) {
        // UPDATE
        await axios.patch(`${USER_BASE_URL}/admin/edit-banner/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Banner updated successfully!");
      } else {
        // CREATE
        await axios.post(`${USER_BASE_URL}/admin/create-banner`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Banner created successfully!");
      }

      setTimeout(() => navigate("/BannerList"), 1000);
    } catch (error) {
      console.error("Error submitting banner:", error);
      toast.error(
        error?.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main main_page">
      <PageTitle title={id ? "Edit Banner" : "Create Banner"} />

      <form
        onSubmit={handleSubmit}
        className="mt-10 bg-white p-8 rounded-lg shadow-md"
      >
        <div className="flex flex-col gap-y-6">
          {/* Name Field */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label
              htmlFor="name"
              className="w-full md:w-1/4 text-md font-semibold text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter banner name"
              className="w-full md:w-3/4 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Type Field */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="w-full md:w-1/4 text-md font-semibold text-gray-700">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full md:w-3/4 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Type</option>
              {bannerTypes.map((type) => (
                <option key={type} value={type}>
                  {type
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Status Field */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="w-full md:w-1/4 text-md font-semibold text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full md:w-3/4 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Status</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div className="w-full max-w-sm mx-auto">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <CloudArrowUpIcon className="w-10 h-10 text-gray-400 mb-2" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click or drag to upload</span>
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, JPEG</p>
              </div>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            {(imagePreview || existingImage) && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img
                  src={imagePreview || existingImage}
                  alt="Preview"
                  className="w-40 h-auto mx-auto rounded border"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="w-full flex justify-end mb-4">
            <button
              type="submit"
              className="bg-blue-600 px-6 py-3 rounded-lg text-white font-semibold hover:bg-blue-700 transition-colors duration-200 w-full cursor-pointer"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateBanner;
