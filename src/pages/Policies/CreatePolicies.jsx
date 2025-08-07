import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config/Config";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

const policyTypes = [
  "Privacy",
  "Terms_of_Service",
  "Refund",
  // "Cancellation",
  // "Payment",
  // "EULA",
];

const policyForOptions = ["User", "Service_Provider"];

const CreatePolicies = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const policyData = location.state?.policyData || null;
  const isEditMode = !!policyData;

  const [formData, setFormData] = useState({
    policyType: "",
    policyFor: "",
    title: "",
    description: "",
  });

  const authData = JSON.parse(localStorage.getItem("broom_auth"));
  const token = authData?.token;
  if (!token) {
    toast.error("login again , token not found");
    return;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isEditMode
      ? `${BASE_URL}/admin/update-policy/${policyData._id}`
      : `${BASE_URL}/admin/create-policy`;

    const method = isEditMode ? "patch" : "post";

    try {
      const authData = JSON.parse(localStorage.getItem("broom_auth"));
      const token = authData?.token;
      if (!token) {
        toast.error("login again , token not found");
        return;
      }
      const res = await axios[method](endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        toast.success(
          isEditMode
            ? "Policy updated successfully!"
            : "Policy created successfully!"
        );
        if (!isEditMode) {
          setFormData({
            policyType: "",
            policyFor: "",
            title: "",
            description: "",
          });
        }
        navigate("/PoliciesList");
      } else {
        toast.error(res.data?.message || "Something went wrong.");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to submit policy";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        policyType: policyData.policyType || "",
        policyFor: policyData.policyFor || "",
        title: policyData.title || "",
        description: policyData.description || "",
      });
    }
  }, [isEditMode, policyData]);

  return (
    <div className="main main_page">
      <PageTitle title={isEditMode ? "Edit Policy" : "Create Policy"} />

      <form
        onSubmit={handleSubmit}
        className="mt-10 bg-white p-8 rounded-lg shadow-md  "
      >
        <div className="flex flex-col gap-y-6">
          {/* Policy Type */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="w-full md:w-1/4 text-md font-semibold text-gray-700">
              Policy Type
            </label>
            <select
              name="policyType"
              value={formData.policyType}
              onChange={handleChange}
              className="w-full md:w-3/4 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Policy Type</option>
              {policyTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          {/* Policy For */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="w-full md:w-1/4 text-md font-semibold text-gray-700">
              Policy For
            </label>
            <select
              name="policyFor"
              value={formData.policyFor}
              onChange={handleChange}
              className="w-full md:w-3/4 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Target</option>
              {policyForOptions.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label
              htmlFor="title"
              className="w-full md:w-1/4 text-md font-semibold text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder=" "
              className="w-full md:w-3/4 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* SunEditor Description */}
          <div className="flex flex-col gap-2">
            <label className="text-md font-semibold text-gray-700">
              Description
            </label>
            <SunEditor
              height="250px"
              placeholder="Write your policy content here..."
              setOptions={{
                buttonList: [
                  ["undo", "redo"],
                  ["formatBlock", "fontSize"],
                  ["bold", "underline", "italic"],
                  ["fontColor", "hiliteColor"],
                  ["align", "list", "table"],
                  ["link", "image", "video"],
                  ["codeView"],
                ],
              }}
              setContents={formData.description}
              onChange={(content) =>
                setFormData((prev) => ({ ...prev, description: content }))
              }
            />
          </div>

          {/* Submit Button */}
          <div className="w-full flex justify-end mb-4">
            <button
              type="submit"
              className="bg-blue-600 px-6 py-3 rounded-lg text-white font-semibold hover:bg-blue-700 transition-colors duration-200 w-full cursor-pointer"
            >
              {isEditMode ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePolicies;
