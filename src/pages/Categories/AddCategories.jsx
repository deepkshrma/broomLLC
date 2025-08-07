import React, { useState, useEffect } from "react";
import PageTitle from "../../components/common/PageTitle";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config/Config";
import { toast } from "react-toastify";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav";


const currencies = [
  { code: "USD", name: "United States Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
];


function AddCategories() {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0].code);
  const [preview, setPreview] = useState(null);
  const [parentCategories, setParentCategories] = useState([]);
  const [selectedParentCategoryId, setSelectedParentCategoryId] = useState("");
  const location = useLocation();
  const isEdit = location.state?.mode === "edit";
  const subCategory = location.state?.subCategory;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentCategory: "",
    rate: "",
    gst: "",
    equipmentCost: "",
    miscellaneousCost: "",
    image: null,
  });

  const authData = JSON.parse(localStorage.getItem("broom_auth"));
  const token = authData?.token;
  if (!token) {
    toast.error("No token found in localStorage. Redirecting to login.");
    return; 
  }
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/admin/get-parent-categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setParentCategories(res.data.data || []);
      } catch (err) {
       toast.error("Error fetching parent categories:", err);
      }
    };

    fetchParentCategories();
  }, [token]);
  useEffect(() => {
  if (isEdit && subCategory) {
    setFormData({
      name: subCategory.name || "",
      description: subCategory.description || "",
      rate: subCategory.rate || "",
      gst: subCategory.gst_percentage || "",
      equipmentCost: subCategory.equipment_cost || "",
      miscellaneousCost: subCategory.misc_cost || "",
      image: null, 
    });
    setSelectedCurrency(subCategory.currency || "INR");
    setSelectedParentCategoryId(subCategory.parentCategory?._id || subCategory.parentCategory || "");
    setPreview(`${BASE_URL}/${subCategory.icon}`); // for image preview
  }
}, [isEdit, subCategory]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("parentCategoryId", selectedParentCategoryId);
      payload.append("currency", selectedCurrency);
      payload.append("rate", formData.rate);
      payload.append("gst_percentage", formData.gst);
      payload.append("equipment_cost", formData.equipmentCost);
      payload.append("misc_cost", formData.miscellaneousCost);
      if (formData.image) {
        payload.append("icon", formData.image);
      }

      const endpoint = isEdit
        ? `${BASE_URL}/admin/update-sub-category/${subCategory._id}`
        : `${BASE_URL}/admin/create-sub-category`;

      const method = isEdit ? "patch" : "post";

      const res = await axios[method](endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(
        isEdit
          ? "Sub Category updated successfully!"
          : "Sub Category created successfully!"
      );
      navigate("/Categories");
    } catch (err) {
      console.error("Submit error:", err.response || err);
      toast.error(err?.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="main main_page">
      <BreadcrumbsNav
        customTrail={[
          { label: "All SubCategories", path: "/Categories" },
          { label: "Add SubCategory", path: "/AddCategories" },
        ]}
      />
      <PageTitle
        title={isEdit ? "Edit Sub Category" : "Add New Sub Category"}
      />

      <form
        onSubmit={handleSubmit}
        className="mt-10 bg-white py-20 px-10 rounded"
      >
        <div className="w-full flex gap-5 h-auto mb-8">
          <div className="relative w-1/2">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder=" "
              className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-gray-600 peer pl-12"
            />
            <label
              for="floating_outlined"
              htmlFor="role_name"
              className="absolute text-lg font-semibold text-gray-700  duration-300 transform -translate-y-4 scale-75  top-[-10px] left-[-4px]  origin-[0]   px-2 peer-focus:px-2 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Name
            </label>
          </div>
          <div className="relative w-1/2">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="1"
              className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-gray-600 peer pl-12"
            />
            <label
              for="floating_outlined"
              htmlFor="role_name"
              className="absolute text-lg text-gray-700  duration-300 transform -translate-y-4 scale-75 font-semibold top-[-10px] left-[-4px]  origin-[0]   px-2 peer-focus:px-2 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Description
            </label>
          </div>
        </div>

        <div className="w-full flex gap-5 h-auto mb-10">
          <div className="relative w-1/2">
            <label className="block mb-0.5 text-sm font-semibold text-gray-700">
              Parent Category
            </label>
            <select
              value={selectedParentCategoryId}
              onChange={(e) => setSelectedParentCategoryId(e.target.value)}
              className="block w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-gray-500"
            >
              <option value="">Select Parent Category</option>
              {parentCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative w-1/2">
            <label
              htmlFor="currency"
              className="block mb-0.5 text-sm font-semibold text-gray-700"
            >
              Select Currency
            </label>
            <select
              id="currency"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.symbol} - {currency.name} (
                  {currency.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full flex gap-5 h-auto mb-10">
          <InputField
            name="rate"
            label="Rate"
            value={formData.rate}
            className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-gray-600 peer pl-12"
            onChange={handleChange}
          />
          <InputField
            name="gst"
            label="GST %"
            value={formData.gst}
            onChange={handleChange}
          />
        </div>

        <div className="w-full flex gap-5 h-auto mb-10">
          <InputField
            name="equipmentCost"
            label="Equipment Cost"
            value={formData.equipmentCost}
            onChange={handleChange}
          />
          <InputField
            name="miscellaneousCost"
            label="Miscellaneous Cost"
            value={formData.miscellaneousCost}
            onChange={handleChange}
          />
        </div>

        <div className="w-full flex gap-5 mb-10">
          <div className="w-full max-w-sm mx-auto">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Uploaded Preview"
                  className="object-cover w-full h-full rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <CloudArrowUpIcon className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload Image</span>
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG</p>
                </div>
              )}
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        <div className="w-full flex justify-end mb-10">
          <button
            type="submit"
            className="bg-blue-500 w-full rounded px-4 py-2 text-white cursor-pointer"
          >
            {isEdit ? "Update" : "Submit"}
          </button>
        </div>
      </form>
      
      
    </div>
    
  );
}

function InputField({ name, label, value, onChange }) {
  return (
    <div className="relative w-1/2">
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-gray-600 peer pl-12"
      />
      <label
        htmlFor={name}
        className="absolute text-lg text-gray-700  duration-300 transform -translate-y-4 scale-75 font-semibold top-[-10px] left-[-4px]  origin-[0]   px-2 peer-focus:px-2 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
      >
        {label}
      </label>
    </div>
    
  );
}

export default AddCategories;
