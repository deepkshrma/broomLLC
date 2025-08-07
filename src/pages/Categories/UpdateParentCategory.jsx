import React, { useState, useEffect } from "react";
import PageTitle from "../../components/common/PageTitle";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config/Config";
import { toast } from "react-toastify";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav";

function UpdateParentCategory() {
  const location = useLocation();
  const navigate = useNavigate();
  const category = location.state;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  const authData = JSON.parse(localStorage.getItem("broom_auth"));
  const token = authData?.token;

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.categoryName || "",
        description: category.description || "",
        image: null,
      });
      if (category.icon) {
        setPreview(`${BASE_URL}/${category.icon}`);
      }
    }
  }, [category]);

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
      if (formData.image) {
        payload.append("icon", formData.image);
      }

      const res = await axios.patch(
        `${BASE_URL}/admin/update-category/${category.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Parent category updated successfully!");
      navigate("/MainCategories");
    } catch (error) {
      console.log("update error", error.message);
      toast.error("Something went wrong !");
    }
  };

  return (
    <div className="main main_page">
      <BreadcrumbsNav
        customTrail={[
          { label: "Main Categories", path: "/MainCategories" },
          { label: "Update Main Category", path: "/UpdateParentCategory" },
        ]}
      />
      <PageTitle title="Edit Parent Category" />
      <form
        onSubmit={handleSubmit}
        className="w-full h-auto mt-5 bg-white py-10 px-10 rounded"
      >
        <div className="mb-8 mt-5 flex gap-5">
          <div className="mb-8 mt-5 w-1/2 flex flex-col gap-5">
            <div className="relative w-full mb-10">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder=" "
                className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-600 peer pl-12"
              />
              <label
                htmlFor="role_name"
                className="absolute text-lg font-semibold text-gray-700 duration-300 transform -translate-y-4 scale-75 top-[-10px] left-[-4px] origin-[0] px-2 peer-focus:px-2 peer-focus:text-gray-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Name
              </label>
            </div>
            <div className="relative w-full">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="1"
                className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-600 peer pl-12"
              />
              <label
                htmlFor="description"
                className="absolute text-lg text-gray-700 font-semibold duration-300 transform -translate-y-4 scale-75 top-[-10px] left-[-4px] origin-[0] px-2 peer-focus:px-2 peer-focus:text-gray-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Description
              </label>
            </div>
          </div>

          <div className="w-full flex justify-start gap-5 mb-10">
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
                      <span className="font-semibold">
                        Click to upload Image
                      </span>
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
        </div>

        <div className="w-full flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 w-full rounded px-4 py-2 text-white cursor-pointer"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateParentCategory;
