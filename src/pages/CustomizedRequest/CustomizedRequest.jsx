import React, { useState, useRef, useEffect } from "react";
import {
  FaSearch,
  FaCaretDown,
  FaCaretLeft,
  FaCaretRight,
} from "react-icons/fa";
import { MdDownload, MdFilterList } from "react-icons/md";
import PageTitle from "../../components/common/PageTitle";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { CiExport } from "react-icons/ci";

// Dummy data for now

function CustomizedRequest() {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [customizedRequest, setCustomizedRequest] = useState([
    {
      id: 1,
      bookingId: "#78953",
      customerName: "Karington Hezekiah",
      customerPhone: "+254519786547",
      requestTimeDate: "2025-06-02",
      requestTime: "05:36pm",
      serviceTimeDate: "02-06-2025",
      serviceTime: "02:36pm",
      category: "House Cleaning",
      providerOffering: "1 Providers",
      action: "active",
    },
    {
      id: 2,
      bookingId: "#78953",
      customerName: "Karington Hezekiah",
      customerPhone: "+254519786547",
      requestTimeDate: "2025-06-02",
      requestTime: "05:36pm",
      serviceTimeDate: "02-06-2025",
      serviceTime: "02:36pm",
      category: "House Cleaning",
      providerOffering: "1 Providers",
      action: "active",
    },
    {
      id: 3,
      bookingId: "#78953",
      customerName: "Karington Hezekiah",
      customerPhone: "+254519786547",
      requestTimeDate: "2025-06-02",
      requestTime: "05:36pm",
      serviceTimeDate: "02-06-2025",
      serviceTime: "02:36pm",
      category: "House Cleaning",
      providerOffering: "1 Providers",
      action: "active",
    },
    {
      id: 4,
      bookingId: "#78953",
      customerName: "Karington Hezekiah",
      customerPhone: "+254519786547",
      requestTimeDate: "2025-06-02",
      requestTime: "05:36pm",
      serviceTimeDate: "02-06-2025",
      serviceTime: "02:36pm",
      category: "House Cleaning",
      providerOffering: "1 Providers",
      action: "active",
    },
    {
      id: 5,
      bookingId: "#78953",
      customerName: "Karington Hezekiah",
      customerPhone: "+254519786547",
      requestTimeDate: "2025-06-02",
      requestTime: "05:36pm",
      serviceTimeDate: "02-06-2025",
      serviceTime: "02:36pm",
      category: "House Cleaning",
      providerOffering: "1 Providers",
      action: "active",
    },
    {
      id: 6,
      bookingId: "#78953",
      customerName: "Karington Hezekiah",
      customerPhone: "+254519786547",
      requestTimeDate: "2025-06-02",
      requestTime: "05:36pm",
      serviceTimeDate: "02-06-2025",
      serviceTime: "02:36pm",
      category: "House Cleaning",
      providerOffering: "1 Providers",
      action: "active",
    },
    {
      id: 7,
      bookingId: "#78953",
      customerName: "Karington Hezekiah",
      customerPhone: "+254519786547",
      requestTimeDate: "2025-06-02",
      requestTime: "05:36pm",
      serviceTimeDate: "02-06-2025",
      serviceTime: "02:36pm",
      category: "House Cleaning",
      providerOffering: "1 Providers",
      action: "active",
    },
    {
      id: 8,
      bookingId: "#78953",
      customerName: "Karington Hezekiah",
      customerPhone: "+254519786547",
      requestTimeDate: "2025-06-02",
      requestTime: "05:36pm",
      serviceTimeDate: "02-06-2025",
      serviceTime: "02:36pm",
      category: "House Cleaning",
      providerOffering: "1 Providers",
      action: "active",
    },
    {
      id: 9,
      bookingId: "#78953",
      customerName: "Karington Hezekiah",
      customerPhone: "+254519786547",
      requestTimeDate: "2025-06-02",
      requestTime: "05:36pm",
      serviceTimeDate: "02-06-2025",
      serviceTime: "02:36pm",
      category: "House Cleaning",
      providerOffering: "1 Providers",
      action: "active",
    },
    {
      id: 10,
      bookingId: "#78953",
      customerName: "Karington Hezekiah",
      customerPhone: "+254519786547",
      requestTimeDate: "2025-06-02",
      requestTime: "05:36pm",
      serviceTimeDate: "02-06-2025",
      serviceTime: "02:36pm",
      category: "House Cleaning",
      providerOffering: "1 Providers",
      action: "active",
    },
  ]);
  const [isAnimating, setIsAnimating] = useState(false);
  const filterDropdownRef = useRef(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!filterDropdownRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleFilterDropdown = () => {
    if (isAnimating) return; // Prevent toggling during animation

    setIsAnimating(true);
    setIsFilterDropdownOpen((prev) => !prev);

    // Unlock after animation duration (300ms)
    setTimeout(() => setIsAnimating(false), 1000);
  };

  // Handll filter submit button
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    // Perform filter logic here
    setIsFilterDropdownOpen(false);
  };

  // delete button handling in table
  const handleDelete = (id) => {
    const updatedCustomizedRequest = customizedRequest.filter(
      (cat) => cat.id !== id
    );
    setCustomizedRequest(updatedCustomizedRequest);
  };
  return (
    <>
      <div className="px-[20px] mb-[100px] main main_page">
        <PageTitle title={"Customized Booking Request"} />
        <div className="flex justify-end text-[14px] text-[#979797] font-medium">
          Total Request:{" "}
          <span className="text-[14px] text-[black] ml-1">
            {customizedRequest.length}
          </span>
        </div>

        <div className="w-[100%] h-auto p-2 mt-2 bg-white rounded-lg">
          {/* Search + Filter */}
          <div className="flex relative justify-between w-[100%] h-auto">
            <form action="" className="flex gap-1">
              <div className="relative flex gap-2 px-3 bg-blue-50">
                <FaSearch className="absolute opacity-40 top-3" size={15} />
                <input
                  type="search"
                  placeholder="Search here"
                  className="ml-6 text-[14px] outline-none "
                />
              </div>
              <button
                type="submit"
                className="px-[15px] py-[8px] text-[14px] bg-blue-500 rounded text-white cursor-pointer"
              >
                Search
              </button>
            </form>
            <div className="flex gap-2">
              <div
                className="flex gap-2 justify-center items-center rounded px-4 border-[1px] cursor-pointer"
                onClick={toggleFilterDropdown}
              >
                <MdFilterList />
                <span className="text-[14px]">Filter</span>
                <span className="text-[14px]">0</span>
              </div>
              <div className="flex gap-2 justify-center items-center rounded px-4 border-[1px] cursor-pointer">
                <CiExport className="text-black" />
                <span className="text-[14px]">Export</span>
              </div>
            </div>
            {/* filter dropdown form */}
            {isFilterDropdownOpen && (
              <div
                ref={filterDropdownRef}
                className="absolute w-[90%] max-w-md bg-white rounded-xl p-6 shadow-lg left-[54%] top-[100%]"
              >
                <form className="space-y-5">
                  <div className="flex gap-8">
                    <div className="w-full flex gap-5">
                      <div className="w-1/2">
                        <label htmlFor="" className="font-medium text-sm">
                          Select Categories
                        </label>
                        <select
                          name=""
                          id=""
                          className="w-full border border-gray-300 p-2 rounded-md mt-2 text-sm"
                        >
                          <option value="">option1</option>
                          <option value="">option1</option>
                          <option value="">option1</option>
                          <option value="">option1</option>
                        </select>
                      </div>
                      <div className="w-1/2">
                        <label htmlFor="" className="font-medium text-sm">
                          Select Date Range
                        </label>
                        <select
                          name=""
                          id=""
                          className="w-full border border-gray-300 p-2 rounded-md mt-2 text-sm"
                        >
                          <option value="">option1</option>
                          <option value="">option1</option>
                          <option value="">option1</option>
                          <option value="">option1</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center gap-2">
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
                      onClick={() => handleFilterSubmit()}
                    >
                      Apply Now
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* table */}
          <table className="mt-[10px] w-full overflow-x-scroll">
            <thead className="bg-blue-50">
              <tr className="text-gray-700">
                {[
                  "Booking ID",
                  "Customer Info",
                  "Booking Request Time",
                  "Service Time",
                  "Category",
                  "Provider Offering",
                  "Action",
                ].map((head) => (
                  <th key={head} className="text-[14px] px-4 py-2 text-left">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customizedRequest.map((item, index) => (
                <>
                  <tr key={item.id}>
                    <td className="text-[14px] px-4 py-2">{item.bookingId}</td>
                    <td className="text-[14px] px-4 py-2">
                      <div>{item.customerName}</div>
                      <div>{item.customerPhone}</div>
                    </td>
                    <td className="text-[14px] px-4 py-2">
                      <div>{item.requestTimeDate}</div>
                      <div>{item.requestTime}</div>
                    </td>
                    <td className="text-[14px] px-4 py-2">
                      <div>{item.serviceTimeDate}</div>
                      <div>{item.serviceTime}</div>
                    </td>
                    <td className="text-[14px] px-4 py-2">{item.category}</td>
                    <td className="text-[14px] px-4 py-2">
                      {item.providerOffering}
                    </td>
                    <td className="flex text-[14px] px-4 py-2">
                      <div className="flex border border-gray-300 rounded-md overflow-hidden">
                        <button className="px-2 py-1 hover:bg-gray-100 transition">
                          {item.action === "active" ? <FiEye /> : <FiEyeOff />}
                        </button>
                        <button
                          className="px-2 py-1 border-l border-gray-300 hover:bg-gray-100 transition"
                          onClick={() => handleDelete(item.id)}
                        >
                          <RiDeleteBinLine className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="7">
                      <hr className="text-[#E0E0E0] w-full" />
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default CustomizedRequest;
