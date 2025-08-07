import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import { BASE_URL } from "../../config/Config";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import image from "../../assets/images/icons/cat.png";
import Pagination from "../../components/common/Pagination";
import { TfiLayoutMenuSeparated } from "react-icons/tfi";
import { MdEdit } from "react-icons/md";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { toast } from "react-toastify";

const MainCategories = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const toggleDropdown = (id) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If click is outside any dropdown-toggle or dropdown-menu
      if (
        !event.target.closest(".dropdown-toggle") &&
        !event.target.closest(".dropdown-menu")
      ) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem("broom_auth"));
        const token = authData?.token;
        if (!token) {
          toast.error("Login expired. Please log in again.");
          return;
        }
        setLoading(true);

        const response = await axios.get(
          `${BASE_URL}/admin/get-parent-categories`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response?.data?.status) {
          const formatted = response.data.data.map((item) => ({
            id: item._id,
            icon: item.icon,
            image: item.icon ? `${BASE_URL}/${item.icon}` : image,
            categoryName: item.name,
            description: item.description,
            status: item.isActive ? "active" : "inactive",
          }));

          setCategories(formatted);
        }
      } catch (error) {
        console.log("error", error.message);
        toast.error("Error Fetching Whlie Main Categories !");
      } finally {
        setLoading(false);
      }
    };

    fetchMainCategories();
  }, []);
  
  const handleToggleStatus = async (item) => {
    try {
      const authData = JSON.parse(localStorage.getItem("broom_auth"));
      const token = authData?.token;

      const updatedStatus = item.status === "active" ? false : true;

      const response = await axios.patch(
        `${BASE_URL}/admin/toggle-category-status/${item.id}?isActive=${updatedStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === item.id
              ? { ...cat, status: updatedStatus ? "active" : "inactive" }
              : cat
          )
        );
        toast.success(
          `Status changed to ${updatedStatus ? "active" : "inactive"}`
        );
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.log("error", error.message);
      toast.error("Something went wrong !");
    }
  };

  return (
    <div className="px-[20px] mb-[100px] main main_page">
      <PageTitle title={"Main Categories"} />
      <div className="px-4 rounded-lg shadow-md flex justify-between font-bold">
        <ul className="flex text-[12px] gap-2">
          {["All", "Active", "Inactive"].map((status) => (
            <li
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`p-2 cursor-pointer capitalize ${
                statusFilter === status
                  ? "text-black font-semibold"
                  : "text-gray-400"
              }`}
            >
              {status}
            </li>
          ))}
        </ul>

        <div>
          <span className="text-[12px] text-gray-400">Total Categories: </span>
          {categories.length}
        </div>
      </div>

      <div className="w-[100%] h-auto p-2 mt-2 bg-white rounded-lg">
        {/* Search + Filter */}
        <div className="flex justify-between w-[100%] h-[40px]">
          <form action="" className="flex gap-1">
            <div className="relative flex gap-2 px-3 bg-blue-50 w-[300px] rounded-md">
              <FaSearch
                className="absolute opacity-40 top-3 left-2"
                size={15}
              />
              <input
                type="search"
                placeholder="Search here"
                className="ml-6 text-[14px] outline-none w-full py-2 bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-visible">
          <table className="mt-[10px] w-full overflow-x-scroll whitespace-nowrap">
            <thead className="bg-blue-50">
              <tr className="text-gray-700">
                {[
                  "Id",
                  "image",
                  "Category Name",
                  "Description",
                  "Status",
                  "Actions",
                ].map((head, i) => (
                  <th
                    key={head}
                    className={`text-[14px] px-4 py-2 ${
                      i === 4 ? "text-center" : "text-left"
                    }`}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filteredCategories = categories.filter((item) => {
                  const matchesSearch =
                    item.categoryName
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    item.description
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase());

                  const matchesStatus =
                    statusFilter === "All" ||
                    item.status === statusFilter.toLowerCase();

                  return matchesSearch && matchesStatus;
                });

                if (filteredCategories.length === 0) {
                  return (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-8 text-gray-500"
                      >
                        {statusFilter === "Active"
                          ? "No active categories found."
                          : statusFilter === "Inactive"
                          ? "No inactive categories found."
                          : "No categories found."}
                      </td>
                    </tr>
                  );
                }

                return filteredCategories.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <tr>
                      <td className="text-[14px] px-4 py-2 font-medium">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="text-[14px] px-4 py-2 ">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.image || cat}
                            alt={item.categoryName}
                            className="w-8 h-8 rounded-full object-cover  text-[10px]"
                          />
                        </div>
                      </td>
                      <td className="text-[14px] px-4 py-2 font-medium">
                        {item.categoryName}
                      </td>
                      <td className="text-[14px] px-4 py-2 font-medium">
                        {item.description}
                      </td>
                      <td className="text-[14px] px-4 py-2">
                        <div
                          className={`px-2 py-1 w-full flex justify-center items-center ${
                            item.status === "active"
                              ? "bg-green-200 text-green-500"
                              : "bg-red-200 text-red-500"
                          } font-semibold rounded-full`}
                        >
                          {item.status}
                        </div>
                      </td>
                      <td className="text-[14px] px-4 py-2 ">
                        <div className="relative inline-block text-left">
                          <div
                            onClick={() => toggleDropdown(item.id)}
                            className={`dropdown-toggle  flex justify-center items-center w-[40px] h-[25px] border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white rounded cursor-pointer ${
                              openDropdownId === item.id
                                ? "bg-blue-400 text-white"
                                : ""
                            }`}
                          >
                            <TfiLayoutMenuSeparated className="text-[15px]" />
                          </div>

                          {openDropdownId === item.id && (
                            <div className="dropdown-menu absolute left-0 z-50 mt-2 w-30 origin-top-right rounded-md bg-blue-50 shadow-lg font-semibold   ring-opacity-5 focus:outline-none">
                              <div className=" text-[14px]">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Navigating with item:", item);

                                    navigate("/UpdateParentCategory", {
                                      state: item,
                                    });

                                    setOpenDropdownId(null);
                                  }}
                                  className="flex items-center gap-3 w-full px-4 py-2 text-left text-green-700  hover:shadow-lg  rounded-md  cursor-pointer"
                                >
                                  <MdEdit className="text-[15px]" />
                                  Edit
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleStatus(item);
                                    setOpenDropdownId(null);
                                  }}
                                  className="flex items-center gap-3 w-full px-4 py-2 text-left text-yellow-700 hover:shadow-lg  rounded-md  cursor-pointer"
                                >
                                  <AiOutlineExclamationCircle />
                                  {item.status === "active"
                                    ? "Deactivate"
                                    : "Activate"}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="6">
                        <hr className="text-[#E0E0E0] w-full" />
                      </td>
                    </tr>
                  </React.Fragment>
                ));
              })()}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalItems={categories.length}
            itemsPerPage={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default MainCategories;
