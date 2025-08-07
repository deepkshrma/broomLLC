import { useEffect } from "react";
import logo_image from "../../assets/images/broomllclogo.png";
import grid_image from "../../assets/images/gridimage.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";

import { loginAdmin } from "../../apis/Admin";
import { toast } from "react-toastify";
import ContextApi from "../../ContextApi";
import { Navigate, useNavigate } from "react-router-dom";

const Sign_in = () => {
  const { authData, setAuthData, authLoading } = useContext(ContextApi);
  const [show_password, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && authData?.token) {
      navigate("/dashboard");
    }
  }, [authLoading, authData, navigate]);

  if (authLoading || authData?.token) {
    return null; // prevents entire sign-in render
  }

  const handleChange = (e) => {
    setMessage("");
    const { name, value } = e.target;
    setFormdata({
      ...formdata,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!show_password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    for (const key in formdata) {
      if (formdata[key] === "") {
        newErrors[key] = `${key} is required`;
      }
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await loginAdmin(formdata);

      if (response?.status === 200) {
        toast.success(response?.data?.message);

        const user = response?.data?.user;
        const token = response?.data?.token;

        // Convert relative image path to full URL
        const profilePhoto =
          user?.profile_photo &&
          user.profile_photo !== "null" &&
          user.profile_photo !== "undefined" &&
          user.profile_photo.trim() !== ""
            ? user.profile_photo
            : null;

        const broom_Auth = { token, user };
        localStorage.setItem("broom_auth", JSON.stringify(broom_Auth));

        localStorage.setItem("profile_photo", profilePhoto);

        setAuthData(broom_Auth);
        navigate("/dashboard");
      } else {
        toast.error(response?.response?.data?.message);
      }
    } catch (error) {
      console.log("error", error.message);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col w-[70%] items-center justify-center   bg-white ">
      <div className="w-sm  p-4 ">
        <img src={logo_image} alt="logo" className="w-[270px] h-[48px] mb-9" />

        <form onSubmit={(e) => handleSubmit(e)} className="mt-15">
          <div className="space-y-8 mb-6">
            <div className=" relative">
              <label
                className="bg-white  opacity-[100%]  px-2 pb-1 text-[12px] text-[#9C9C9C]  font-Roboto leading-[16px] font-[400] absolute left-2 -top-3"
                htmlFor="email"
              >
                Username/ Email Id
              </label>
              <span>
                <EnvelopeIcon className="w-4 absolute left-3 top-4" />
              </span>

              <input
                type="email"
                id="email"
                name="email"
                value={formdata.email}
                placeholder="info@gmail.com"
                className={`w-full px-8 py-3 text-[14px] border border-gray-300 rounded-[8px] focus:outline-none focus:ring-1 focus:ring-[#9C9C9C] ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                onChange={(e) => handleChange(e)}
              />
              {errors.email && (
                <p className="text-red-500 text-[12px] mt-1">{errors.email}</p>
              )}
            </div>

            <div className=" relative">
              <label
                className="bg-white  opacity-[100%]  px-2 pb-1 text-[12px] text-[#9C9C9C]  font-Roboto leading-[16px] font-[400] absolute left-2 -top-3"
                htmlFor="password"
              >
                Password
              </label>
              <span>
                <LockClosedIcon className="w-4 absolute left-3 top-4" />
              </span>

              <input
                type={show_password ? "text" : "password"}
                id="password"
                name="password"
                value={formdata.password}
                placeholder="password"
                className={`w-full px-8 py-3 text-[14px] border border-gray-300 rounded-[8px] focus:outline-none focus:ring-1 focus:ring-[#9C9C9C] ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                onChange={(e) => handleChange(e)}
              />
              {errors.password && (
                <p className="text-red-500  text-[12px] mt-1">
                  {errors.password}
                </p>
              )}

              <span>
                {show_password ? (
                  <EyeSlashIcon
                    className="w-4 absolute right-3 top-3"
                    onClick={() => togglePasswordVisibility()}
                  />
                ) : (
                  <EyeIcon
                    className="w-4 absolute right-3 top-4"
                    onClick={() => togglePasswordVisibility()}
                  />
                )}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200 cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
      <div className="overflow-hidden relative ">
        <img
          src={grid_image}
          alt="grid_image"
          className="w-[681px] h-[120px] opacity-[60%] "
        />
      </div>
    </div>
  );
};

export default Sign_in;
