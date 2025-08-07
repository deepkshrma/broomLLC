import { useEffect, useRef, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import ContextApi from "../../ContextApi";
import DeleteModel from "../DeleteModel/DeleteModel";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";

const UserDropdown = ({
  userDropdown,
  handleuserDropdown,
  onClosedropdown,
  user,
}) => {
  const dropdownRef = useRef(null);
  const { authData, setAuthData } = useContext(ContextApi);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    // setSelectedAdmin(null);
  };
  const confirmDelete = async () => {
    setAuthData(null);
    localStorage.removeItem("broom_auth");
    localStorage.removeItem("profile_photo");
    localStorage.removeItem("sidebar_open_dropdown");
    localStorage.removeItem("sidebar_active_item");
    navigate("/");
    toast.success("Logged out successfully");
  };
  // const handleLogout = () => {
  //   setAuthData(null);
  //   localStorage.removeItem("broom_auth");
  //   localStorage.removeItem("profile_photo");
  //   navigate("/");
  //   toast.success("Logged out successfully");
  // };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest(".dropdown-toggle")
      ) {
        onClosedropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClosedropdown]);

  const fullName = user ? `${user.first_name} ${user.last_name}` : "User Name";
  const role = user?.role?.name || "User Role";

  return (
    <>
      <div
        ref={dropdownRef}
        className={`relative ${userDropdown ? "block" : "hidden"}`}
      >
        <div className="absolute right-0 top-2 mt-[17px] flex flex-col rounded-xl border border-gray-200 bg-white shadow-lg min-w-[220px]">
          {/* Center fullName and role */}
          <div className="w-full flex flex-col justify-center items-center text-center py-2">
            <span className="block font-medium text-gray-700 text-sm">
              {fullName}
            </span>
            <span className="mt-0.5 block text-sm text-gray-500">{role}</span>
          </div>

          <hr className="text-[#E0E0E0]" />
          <ul className="flex flex-col  ">
            <li onClick={handleuserDropdown}>
              <Link
                to="/Profile"
                className="flex items-center gap-3 py-2 px-5 text-gray-700  group text-[14px] hover:bg-gray-100"
              >
                <FaUser size={13} />
                <span className="whitespace-nowrap">My profile</span>
              </Link>
            </li>
            <hr className="text-[#E0E0E0]" />

            {/* <li onClick={handleuserDropdown}>
              <Link
                to="/ProfileUpdate"
                className="flex items-center gap-3 py-2 px-5 text-gray-700  group text-[14px] hover:bg-gray-100"
              >
                <FaUserEdit size={17} />
                <span className="whitespace-nowrap">Edit profile</span>
              </Link>
            </li>
            <hr className="text-[#E0E0E0]" /> */}

            <li>
              <button
                className="flex w-full items-center gap-3 py-2 px-5 text-red-700  group text-[14px] hover:bg-gray-100 cursor-pointer rounded-b-xl"
                onClick={() => setShowDeleteModal(true)}
              >
                <FiLogOut className="w-4" />
                <span className="whitespace-nowrap ">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <DeleteModel
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        redbutton="Confirm"
        para="Do you really want to logout? This action cannot be
            undone."
      />
    </>
  );
};

export default UserDropdown;
