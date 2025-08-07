import React, { useState, useEffect } from "react";
import PageTitle from "../../components/common/PageTitle";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import guest from "../../assets/images/icons/guest.png";
import { BASE_URL } from "../../config/Config";

function ProfileUpdate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    password: "",
    address: {
      houseNumber: "",
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
    profile_picture: "",
  });

  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("broom_auth"));
    const userId = authData?.user?.id;
    if (!userId) {
      toast.error("User not found, please login again.");
      return navigate("/login");
    }
    fetchAdminDetails(userId);
  }, []);

  const fetchAdminDetails = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem("broom_auth"))?.token;
      if (!token) {
        toast.error("Token not found! please login again");
        return;
      }
      const res = await axios.get(`${BASE_URL}/admin/get-admin-byId/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const data = res.data.data;
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          dob: data.dob?.slice(0, 10) || "",
          gender: data.gender || "",
          password: "",
          profile_picture: data.profile_picture || "",
          address: {
            houseNumber: data.address?.houseNumber || "",
            street: data.address?.street || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            country: data.address?.country || "",
            zipCode: data.address?.zipCode || "",
          },
        });
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "failed to load !";
      toast.error(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const authData = JSON.parse(localStorage.getItem("broom_auth"));
    const token = authData?.token;
    const userId = authData?.user?.id;

    const data = new FormData();
    data.append("first_name", formData.first_name);
    data.append("last_name", formData.last_name);
    data.append("phone", formData.phone);
    data.append("dob", formData.dob);
    data.append("gender", formData.gender);
    if (formData.password) {
      data.append("password", formData.password);
    }

    data.append("address[houseNumber]", formData.address.houseNumber);
    data.append("address[street]", formData.address.street);
    data.append("address[city]", formData.address.city);
    data.append("address[state]", formData.address.state);
    data.append("address[country]", formData.address.country);
    data.append("address[zipCode]", formData.address.zipCode);

    if (profileImage) {
      data.append("profile_picture", profileImage);
    }

    try {
      const token = JSON.parse(localStorage.getItem("broom_auth"))?.token;
      if (!token) {
        toast.error("Token not found! please login again");
        return;
      }
      await axios.patch(
        `${BASE_URL}/admin/update-admin-profile/${userId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "failed to update profile !";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main main_page">
      <PageTitle title={"Update Profile"} />
      <div className="w-full p-6 mt-4 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="mt-8 bg-white p-8 ">
          <div className="flex">
            <div className="w-3/4">
              <div className="flex gap-5 mb-8">
                <div className="relative w-1/2">
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="block w-full px-2.5 pb-2 pt-3 text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 peer"
                  />
                  <label className="absolute text-md text-gray-700 -top-3 left-2 px-2 bg-white">
                    First Name
                  </label>
                </div>
                <div className="relative w-1/2">
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="block w-full px-2.5 pb-2 pt-3 text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-0 peer"
                  />
                  <label className="absolute text-md text-gray-700 -top-3 left-2 px-2 bg-white">
                    Last Name
                  </label>
                </div>
              </div>

              <div className="flex gap-5 mb-8">
                <div className="w-1/2">
                  <label className="block mb-1 text-xs font-medium text-gray-700">
                    Phone
                  </label>
                  <PhoneInput
                    country={"us"}
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    inputStyle={{
                      width: "100%",
                      height: "38px",
                      fontSize: "14px",
                    }}
                    containerStyle={{ width: "100%" }}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block mb-1 text-xs font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md text-sm p-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-5 mb-8">
                <div className="w-1/2">
                  <label className="block mb-1 text-xs font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md text-sm p-2 focus:outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  { key: "street", label: "Street" },
                  { key: "houseNumber", label: "House No." },
                  { key: "city", label: "City" },
                  { key: "state", label: "State" },
                  { key: "country", label: "Country" },
                  { key: "zipCode", label: "Zip Code" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block mb-1 text-xs font-medium text-gray-700">
                      {label}
                    </label>
                    <input
                      type="text"
                      name={`address.${key}`}
                      value={formData.address[key]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md text-sm p-2 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="w-1/4">
              <div className="flex flex-col items-center">
                <h3 className="mb-3 font-semibold text-gray-800">
                  Profile Image
                </h3>
                <div className="relative group">
                  <img
                    src={
                      previewUrl
                        ? previewUrl
                        : formData.profile_picture
                        ? `${BASE_URL}/${formData.profile_picture.replace(
                            /^\/+/,
                            ""
                          )}`
                        : guest
                    }
                    alt="Profile"
                    className="w-40 h-40 object-cover rounded-lg border border-dashed border-gray-300"
                  />
                  <label
                    htmlFor="upload-photo"
                    className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-blue-700"
                  >
                    ✏️
                  </label>
                  <input
                    type="file"
                    id="upload-photo"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md shadow text-sm cursor-pointer ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileUpdate;
