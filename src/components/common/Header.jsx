import { useEffect, useState } from "react";
import { HiMenu, HiX, HiBell } from "react-icons/hi";
import { FaChevronDown } from "react-icons/fa";
import profile_image from "../../assets/images/icons/guest.png";
import UserDropdown from "./UserDropdown";
import { BASE_URL } from "../../config/Config";

const Header = ({ setIs_Toggle, isToggle }) => {
  const [userDropdown, setUserDropdown] = useState(false);

  const [isAnimating, setIsAnimating] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const broomAuth = localStorage.getItem("broom_auth");
    if (broomAuth) {
      try {
        const parsed = JSON.parse(broomAuth);
        setUser(parsed.user);
      } catch (error) {
        console.error("Error parsing broom_auth from localStorage:", error);
      }
    }
  }, []);

  const handleUserDropdown = () => {
    // setUserDropdown(!userDropdown);
    if (isAnimating) return; 

    setIsAnimating(true); 
    setUserDropdown((prev) => !prev);

    setTimeout(() => setIsAnimating(false), 1000);
  };

  const onCloseDropdown = () => {
    setUserDropdown(false);
  };

  const handleToggle = () => {
    setIs_Toggle(!isToggle);
  };

  const fullName = user ? `${user.first_name} ${user.last_name}` : "Loading...";
  const roleName = user?.role?.name || "Role";
  const storedPath = localStorage.getItem("profile_photo");
  const profilePhoto =
    storedPath &&
    storedPath !== "null" &&
    storedPath !== "undefined" &&
    storedPath.trim() !== ""
      ? `${BASE_URL}/${storedPath}`
      : profile_image;

  return (
    <>
      <div className="header header_top_menu fixed top-0 left-0 z-10 flex w-full py-2 items-center justify-between bg-white p-4 shadow-sm">
        <span>
          {isToggle ? (
            <HiMenu size={18} onClick={handleToggle} />
          ) : (
            <HiX size={18} onClick={handleToggle} />
          )}
        </span>

        <div className="flex justify-end">
          <div className="flex items-center space-x-3">
            {/* bell icon  */}
            {/* <div className="flex relative">
              <HiBell className="text-blue-600" size={24} />
              <div className="w-4 h-4 rounded-full bg-[#F93C65] absolute -right-1 -top-1 flex items-center justify-center text-white">
                <span className="text-[10px]">6</span>
              </div>
            </div> */}

            {/* User Profile Dropdown */}
            <div className="flex items-center space-x-3 cursor-pointer px-3 py-1 rounded-[8px]">
              <div className="rounded-full bg-[#D8D8D8] overflow-hidden">
                <img
                  src={profilePhoto}
                  className="w-11 h-11 object-cover"
                  alt="profile_pic"
                />
              </div>
              <div>
                <p className="text-[14px] font-Montserrat font-[500] text-[#000000]">
                  {fullName}
                </p>
                {/* <p className="text-[12px] font-Montserrat font-[400] text-[#9C9C9C]">
                  {roleName}
                </p> */}
              </div>
              <div
                className="w-5 h-5 rounded-full border border-[#9C9C9C] flex items-center justify-center transition-all duration-300 ease-out"
                onClick={handleUserDropdown}
              >
                <span>
                  <FaChevronDown
                    className={`${!userDropdown && "rotate-180"}`}
                    size={9}
                  />
                </span>
              </div>
            </div>

            <UserDropdown
              userDropdown={userDropdown}
              handleuserDropdown={handleUserDropdown}
              onClosedropdown={onCloseDropdown}
              user={user}
            />
          </div>
        </div>
      </div>

      <div className="mt-12"></div>
    </>
  );
};

export default Header;
