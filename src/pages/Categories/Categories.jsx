import React, { useEffect, useState, useRef } from "react";
import PageTitle from "../../components/common/PageTitle";
import axios from "axios";
import { toast } from "react-toastify";
import cat from "../../assets/images/icons/cat.png";
import { FaSearch } from "react-icons/fa";
import { MdEdit, MdDownload, MdFilterList } from "react-icons/md";
import { CiExport } from "react-icons/ci";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { TfiLayoutMenuSeparated } from "react-icons/tfi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteModel from "../../components/DeleteModel/DeleteModel";
import Pagination from "../../components/common/Pagination";
import { BASE_URL } from "../../config/Config";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [parentCategories, setParentCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);

  const filterDropdownRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If click is outside any dropdown-toggle or dropdown-menu
      if (
        !event.target.closest(".dropdown-toggle") &&
        !event.target.closest(".dropdown-menu")
      ) {
        setDropdownOpenId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const authData = JSON.parse(localStorage.getItem("broom_auth"));
    const token = authData?.token;

    axios
      .get(`${BASE_URL}/admin/get-all-categories`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const allSubCategories = res.data.data.flatMap(
          (cat) => cat.subCategories
        );

        // Apply parent filter
        let filtered = allSubCategories;
        if (selectedCategoryId) {
          filtered = filtered.filter(
            (sub) => sub.parentCategory === selectedCategoryId
          );
        }

        // Apply date range filter
        if (dateRange.start && dateRange.end) {
          filtered = filtered.filter((sub) => {
            const createdAt = new Date(sub.createdAt);
            return (
              createdAt >= new Date(dateRange.start) &&
              createdAt <= new Date(dateRange.end)
            );
          });
        }

        setCategories(filtered);
        setIsFilterDropdownOpen(false);
      })
      .catch((err) => toast.error("Filter fetch failed:", err));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem("broom_auth"));
        const token = authData?.token;
        if (!token) {
          toast.error("Login Expired. Please login again.");
          return;
        }
        const response = await axios.get(
          `${BASE_URL}/admin/get-all-categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Flatten all subcategories across parent categories
        const allSubCategories = response.data.data
          .map((cat) => cat.subcategories || [])
          .flat();

        setCategories(allSubCategories);
      } catch (error) {
        console.log("error:", error);
        toast.error("Error fetching categories:", error);
      }
    };

    const fetchParentCategories = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem("broom_auth"));
        const token = authData?.token;
        if(!token){
          toast.error("token not found. please login again");
          return;
        }
        const response = await axios.get(
          `${BASE_URL}/admin/get-parent-categories`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setParentCategories(response.data.data);
      } catch (error) {
        toast.error("Error fetching parent categories:", error);
      }
    };
    fetchParentCategories();

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) => {
    if (!cat || !cat.createdAt) return false;

    // Match parent category
    const matchesCategory =
      !selectedCategoryId || cat.parentCategory === selectedCategoryId;

    // Match date range
    const createdAt = new Date(cat.createdAt);
    const matchesDate =
      (!dateRange.start || createdAt >= new Date(dateRange.start)) &&
      (!dateRange.end || createdAt <= new Date(dateRange.end));

    // Match search string (name or description)
    const matchesSearch =
      cat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Match status
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && cat.isActive) ||
      (statusFilter === "Inactive" && !cat.isActive);

    return matchesCategory && matchesDate && matchesSearch && matchesStatus;
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setIsFilterDropdownOpen(false);
      }
    };

    if (isFilterDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterDropdownOpen]);

  const handleExport = () => {
    const filtered = categories
      .filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter(
        (item) =>
          !selectedCategoryId || item.parentCategory === selectedCategoryId
      )
      .filter((item) => {
        if (!dateRange.start || !dateRange.end) return true;
        const createdAt = new Date(item.createdAt);
        return (
          createdAt >= new Date(dateRange.start) &&
          createdAt <= new Date(dateRange.end)
        );
      });

    const exportData = filtered.map((item, index) => ({
      SL: index + 1,
      Name: item.name,
      Description: item.description,
      Currency: item.currency || "-",
      Rate: item.rate || "-",
      GST: item.gst_percentage || "-",
      Equipment_Cost: item.equipment_cost || "-",
      Misc_Cost: item.misc_cost || "-",
      Status: item.isActive ? "Active" : "Inactive",
      Created_At: item.createdAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(fileData, "Categories.xlsx");
  };

  const openDeleteModal = (id) => {
    setSelectedSubCategoryId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedSubCategoryId(null);
    setShowDeleteModal(false);
  };
  const confirmDelete = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("broom_auth"));
      const token = authData?.token;
      if (!token) {
        toast.error("token not found. please login again");
        return;
      }

      await axios.delete(
        `${BASE_URL}/admin/delete-sub-cat/${selectedSubCategoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories((prev) =>
        prev.filter((cat) => cat._id !== selectedSubCategoryId)
      );
      toast.success("Subcategory deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete subcategory.");
    } finally {
      closeDeleteModal();
    }
  };

  const toggleStatus = async (id, isActive) => {
    const authData = JSON.parse(localStorage.getItem("broom_auth"));
    const token = authData?.token;
    if (!token) {
      toast.error("token not found. please login again");
      return;
    }

    try {
      await axios.patch(
        `${BASE_URL}/admin/toggle-category-status/${id}?isActive=${!isActive}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === id ? { ...cat, isActive: !isActive } : cat
        )
      );

      toast.success(
        `Category ${!isActive ? "activated" : "deactivated"} successfully.`
      );
    } catch (err) {
      console.error("Toggle status failed:", err);
      toast.error("Failed to update status.");
    }
  };

  return (
    <>
      <div className="px-[20px] mb-[100px] main main_page">
        <BreadcrumbsNav
        customTrail={[
          { label: "All SubCategories", path: "/Categories" },
        ]}
      />
        <PageTitle title={"Categories"} />
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
            <span className="text-[12px] text-gray-400">
              Total Categories:{" "}
            </span>
            {filteredCategories.length}
          </div>
        </div>

        <div className="w-[100%] h-auto p-2 mt-2 bg-white rounded-lg">
          {/* Search + Filter */}
          <div className="flex relative justify-between w-[100%] h-[40px] ">
            <form action="" className="flex gap-1">
              <div className="relative flex gap-2 px-3 bg-blue-50">
                <FaSearch className="absolute opacity-40 top-3" size={15} />
                <input
                  type="search"
                  placeholder="Search here"
                  className="ml-6 text-[14px] outline-none "
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1">
                <select
                  value={selectedCategoryId}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedCategoryId(value);
                    filterCategoriesByCategoryId(value);
                  }}
                  className="text-sm bg-transparent outline-none"
                >
                  <option value="">Select Category</option>
                  {parentCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className="flex gap-2 justify-center items-center rounded px-4 border border-gray-300 cursor-pointer"
                onClick={handleExport}
              >
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
                <form className="space-y-5" onSubmit={handleFilterSubmit}>
                  <div className="flex gap-8">
                    <div className="w-full flex gap-5">
                      <div className="w-1/2">
                        <label className="font-medium text-sm">
                          Select Category
                        </label>
                        <select
                          value={selectedCategoryId}
                          onChange={(e) =>
                            setSelectedCategoryId(e.target.value)
                          }
                          className="w-full border border-gray-300 p-2 rounded-md mt-2 text-sm"
                        >
                          <option value="">All</option>
                          {parentCategories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-y-visible ">
            <table className="mt-[10px] w-full">
              <thead className="bg-blue-50">
                <tr className="text-gray-700">
                  {[
                    "SL",
                    "Image",
                    "Category Name",
                    "Description",
                    "Status",
                    "Action",
                  ].map((head, i) => (
                    <th
                      key={head}
                      className={`text-[14px] px-4 py-2  whitespace-nowrap ${
                        i === 4 ? "text-center" : "text-left"
                      }`}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((item, index) => (
                  <React.Fragment key={item._id}>
                    <tr>
                      <td className="text-[14px] px-4 py-2 font-medium">
                        {index + 1}
                      </td>
                      <td className="text-[14px] px-4 py-2 font-medium">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.icon ? `${BASE_URL}/${item.icon}` : cat}
                            alt={item.name}
                            className="w-8 h-8 rounded-full object-cover "
                          />
                        </div>
                      </td>
                      <td className="text-[14px] px-4 py-2 font-medium">
                        {item.name}
                      </td>
                      <td className="text-[14px] px-4 py-2 font-medium">
                        {item.description}
                      </td>
                      <td className="text-[14px] px-4 py-2">
                        <div
                          className={`px-2 py-1 w-full flex justify-center items-center ${
                            item.isActive
                              ? "bg-green-200 text-green-500"
                              : "bg-red-200 text-red-500"
                          } font-semibold rounded-full`}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </div>
                      </td>

                      <td className="text-[14px] px-4 py-2">
                        <div className="relative">
                          <div
                            onClick={() =>
                              setDropdownOpenId((prevId) =>
                                prevId === item._id ? null : item._id
                              )
                            }
                            // Track open state per item
                            className={`dropdown-toggle flex justify-center items-center w-[40px] h-[25px] border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white rounded cursor-pointer ${
                              dropdownOpenId === item._id
                                ? "bg-blue-400 text-white"
                                : ""
                            }`}
                          >
                            <TfiLayoutMenuSeparated className="text-[15px]" />
                          </div>

                          {dropdownOpenId === item._id && (
                            <ul className="dropdown-menu absolute z-50 bg-blue-50 rounded shadow-md mt-2 left-0 font-semibold text-sm w-30">
                              <li
                                className="px-3 py-2  cursor-pointer text-green-600 hover:shadow-lg  rounded-md"
                                onClick={() =>
                                  navigate("/AddCategories", {
                                    state: { mode: "edit", subCategory: item },
                                  })
                                }
                              >
                                <MdEdit className="inline mr-1" /> Edit
                              </li>
                              <li
                                className="px-3 py-2  cursor-pointer text-red-600 hover:shadow-lg  rounded-md"
                                onClick={() => openDeleteModal(item._id)}
                              >
                                <RiDeleteBin5Line className="inline mr-1" />{" "}
                                Delete
                              </li>
                              <li
                                className="pl-3 py-2 flex items-center gap-2  cursor-pointer text-blue-600 hover:shadow-lg  rounded-md"
                                onClick={() =>
                                  toggleStatus(item._id, item.isActive)
                                }
                              >
                                <AiOutlineExclamationCircle />
                                {item.isActive ? "Deactivate" : "Activate"}
                              </li>
                            </ul>
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="10">
                        <hr className="text-[#E0E0E0] w-full" />
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              totalItems={filteredCategories.length}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
        <DeleteModel
          isOpen={showDeleteModal}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          redbutton="Yes, Delete"
          para="Do you really want to delete this Sub Category? This action cannot be undone."
        />
      </div>
    </>
  );
}

export default Categories;
