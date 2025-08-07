import React, { useContext, useState, useEffect } from "react";
import logo from "../../assets/images/broomllclogo.png";
import {
  Squares2X2Icon,
  CalendarIcon,
  ChevronDownIcon,
  UserIcon,
  TagIcon,
  TicketIcon,
  WalletIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import ContextApi from "../../ContextApi";
import { Navigate, useNavigate , useLocation } from "react-router-dom";

const Sidebar = ({ isToggle }) => {
  const { authData, setAuthData } = useContext(ContextApi);

  const userRole = authData?.user?.role?.name?.toLowerCase();

  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const location = useLocation();
  const navigate = useNavigate();

  const activePath = location.pathname;
  const filteredSidebarData = [
    {
      section: null,
      items: [
        {
          name: "Dashboard",
          icon: <Squares2X2Icon className="w-4" />,
          link: "/dashboard",
          dropdown: false,
        },
      ],
      border: true,
    },
    ...(userRole === "admin" || userRole === "superadmin"
      ? [
          {
            section: "Admin Management",
            items: [
              {
                name: "Admin Roles",
                icon: <Cog6ToothIcon className="w-4" />,
                dropdown: true,
                link: "#",
                subItems: [
                  { name: "Admin Role Setup", link: "/RoleUpdate" },
                  { name: "Roles", link: "/Roles" },
                ],
              },
              {
                name: "Admin List",
                icon: <Bars3Icon className="w-4" />,
                dropdown: false,
                link: "/admin_list",
              },
              {
                name: "Create Admin",
                icon: <Bars3Icon className="w-4" />,
                dropdown: false,
                link: "/CreateAdmin",
              },
            ],
            border: true,
          },
        ]
      : []),
    {
      section: "Category Management",
      items: [
        {
          name: "Main Categories",
          icon: <CalendarIcon className="w-4" />,
          dropdown: false,
          link: "/MainCategories",
        },
        {
          name: "Sub Categories",
          icon: <CalendarIcon className="w-4" />,
          dropdown: true,
          link: "#",
          subItems: [
            { name: "Add Categories", link: "/AddCategories" },
            { name: "Category List", link: "/Categories" },
          ],
        },
      ],
      border: true,
    },
    {
      section: "User Management",
      items: [
        {
          name: "Provider",
          icon: <CalendarIcon className="w-4" />,
          dropdown: true,
          link: "#",
          subItems: [
            { name: "Provider List", link: "/ProviderList" },
            { name: "Pending Request", link: "/PendingRequest" },
          ],
        },
        {
          name: "User",
          icon: <CalendarIcon className="w-4" />,
          dropdown: true,
          link: "#",
          subItems: [{ name: "User List", link: "/CustomerList" }],
        },
      ],
      border: true,
    },
    {
      section: "Report Management",
      items: [
        {
          name: "Policies",
          icon: <CalendarIcon className="w-4" />,
          dropdown: true,
          link: "#",
          subItems: [
            { name: "Policies List", link: "/PoliciesList" },
            { name: "Create Policies", link: "/CreatePolicies" },
          ],
        },
      ],
      border: true,
    },
    {
      section: "Promotion Management",
      items: [
        {
          name: "Banners",
          icon: <CalendarIcon className="w-4" />,
          dropdown: true,
          link: "#",
          subItems: [
            { name: "Banner List", link: "/BannerList" },
            { name: "Create Banner", link: "/Createbanner" },
          ],
        },
      ],
      border: true,
    },
    {
      section: "Booking Management",
      items: [
        {
          name: "Booking",
          icon: <CalendarIcon className="w-4" />,
          dropdown: true,
          link: "#",
          subItems: [{ name: "Booking Requests", link: "/BookingRequest" }],
        },
      ],
      border: true,
    },
  ];

  const handleMainClick = (item) => {
    const newDropdown = openDropdown === item.name ? null : item.name;
    setOpenDropdown(newDropdown);
    localStorage.setItem("sidebar_open_dropdown", newDropdown || "");
  };

  useEffect(() => {
    //dropdown
    const savedDropdown = localStorage.getItem("sidebar_open_dropdown");
    if (savedDropdown) {
      setOpenDropdown(savedDropdown);
    }

    //subitems
    const savedActiveItem = localStorage.getItem("sidebar_active_item");
    if (savedActiveItem) {
      setActiveItem(savedActiveItem);
    }
  }, []);

  const handleSubClick = (link) => {
    setActiveItem(link);
    localStorage.setItem("sidebar_active_item", link);
  };

  return (
    <>
      <div
        className={`sidebar bg-[#ffffff] h-screen fixed left-0 top-0   ${
          isToggle ? "block" : "hidden"
        } transition-all duration-800`}
      >
        {/* Logo */}
        <div className="logo-container top-0 left-0 bg-white px-4 py-5 z-10">
          <img src={logo} alt="Logo" className="logo w-[150px]  ms-4" />
        </div>

        {/* Navigation */}
        <nav className="relative">
          <ul className="flex flex-col h-[82vh] overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
            {filteredSidebarData.map((section, sectionIndex) => (
              <React.Fragment key={sectionIndex}>
                {section.section && (
                  <span className="text-[12px] mx-4 text-[#929292] my-2">
                    {section.section}
                  </span>
                )}
                {section.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className={`text-sm   mx-4 rounded-sm  leading-[100%] tracking-[0.3px] transition-colors duration-200 group relative`}
                  >
                    {item.dropdown ? (
                      <div
                        onClick={() => handleMainClick(item)}
                        className={`flex justify-between items-center pl-3 py-4 pr-3 rounded cursor-pointer  hover:bg-blue-50 text-gray-800`}
                      >
                        <div className="flex items-center gap-3 font-medium">
                          {item.icon}
                          {item.name}
                        </div>
                        <FaChevronDown
                          className={`w-2 transition-transform duration-200 ${
                            openDropdown === item.name ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    ) : (
                      <Link
                        to={item.link}
                        onClick={() => handleMainClick(item)}
                        className={`flex justify-between items-center pl-3 py-4 pr-3 rounded cursor-pointer hover:bg-blue-50 text-gray-800 
                          `}
                      >
                        <div className="flex items-center gap-3 font-medium">
                          {item.icon}
                          {item.name}
                        </div>
                      </Link>
                    )}

                    {item.dropdown &&
                      openDropdown === item.name &&
                      item.subItems && (
                        <ul className="ml-6 mt-2 flex flex-col gap-1 list-disc pl-6">
                          {item.subItems.map((subItem, subIndex) => (
                            <li
                              key={subIndex}
                              className={` font-medium  cursor-pointer rounded ${
                                activePath === subItem.link
                                  ? "text-blue-600 font-semibold"
                                  : "text-black hover:text-blue-600"
                              }`}
                              onClick={() => handleSubClick(subItem.link)}
                            >
                              <Link
                                to={subItem.link}
                                className="block px-3 py-4"
                              >
                                {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                  </li>
                ))}
                {section.border && (
                  <span className="flex my-2 border-t-1 border-gray-200"></span>
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
