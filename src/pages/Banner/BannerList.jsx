import React, { useState, useEffect, useMemo } from "react";
import PageTitle from "../../components/common/PageTitle";
import { FaSearch } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { MdEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import ToggleButton from "../../components/common/Togglebutton";
import DeleteModel from "../../components/DeleteModel/DeleteModel";
import Pagination from "../../components/common/Pagination";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_BASE_URL } from "../../config/Config";
import { toast } from "react-toastify";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav";

const BannerList = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedBannerId, setSelectedBannerId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem("broom_auth"));
        const token = authData?.token;

        if (!token) {
          console.error("Login Expired. Please login again.");
          return;
        }
        setLoading(true);
        setBanners([]);
        const response = await axios.get(`${USER_BASE_URL}/admin/get-banners`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: typeFilter ? { type: typeFilter } : {},
        });

        setBanners(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch banners:", err);

        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [typeFilter]);

  const filteredBanners = useMemo(() => {
    let result = banners;

    if (statusFilter !== "All") {
      result = result.filter(
        (item) => item.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (typeFilter !== "" && typeFilter !== "All") {
      result = result.filter((item) => item.type === typeFilter);
    }

    if (searchTerm.trim() !== "") {
      result = result.filter((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return result;
  }, [banners, statusFilter, typeFilter, searchTerm]);

  const paginatedBanners = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredBanners.slice(startIndex, endIndex);
  }, [filteredBanners, currentPage, pageSize]);

  const openDeleteModal = (id) => {
    setSelectedBannerId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedBannerId(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("broom_auth"));
      const token = authData?.token;

      if (!token) {
        toast.error("Login expired. Please log in again.");
        return;
      }

      const res = await axios.delete(
        `${USER_BASE_URL}/admin/delete-banner/${selectedBannerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        toast.success("Banner deleted successfully.");
        setBanners((prev) => prev.filter((b) => b._id !== selectedBannerId));
        closeDeleteModal();
      } else {
        toast.error(res.data?.message || "Failed to delete banner.");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-[#F3F4F8] font-Montserrat space-y-4 main main_page">
      <BreadcrumbsNav
  customTrail={[
    { label: "Banner List", path: "/BannerList" },
  ]}
/>
      <div className="flex justify-between items-center">
        <PageTitle title={"Banner List"} />
        <button
          className="bg-blue-500 text-white cursor-pointer px-4 py-2 rounded hover:bg-blue-600 text-[12px]"
          onClick={() => navigate("/CreateBanner")}
        >
          <span className="font-bold">+ </span>ADD BANNER
        </button>
      </div>
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
          <span className="text-[12px] text-gray-400">Total Banners: </span>
          {filteredBanners.length}
        </div>
      </div>

      <div className="w-full h-auto p-4 mt-2 bg-white rounded-lg shadow">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full md:w-[250px] flex justify-start"
          >
            <div className="relative flex items-center bg-blue-50 px-3 py-2 rounded w-full">
              <FaSearch className="absolute opacity-40 left-3" size={14} />
              <input
                type="search"
                placeholder="Search name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 text-sm w-full bg-transparent outline-none"
              />
            </div>
          </form>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <label className="text-sm font-medium">Filter by Type:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none"
            >
              <option value="">All</option>
              <option value="advt_banner">Advertisement</option>
              <option value="offer_banner">Offer</option>
              <option value="promo_banner">Promotion</option>
              <option value="coupon_banner">Coupon</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr className="text-gray-700 text-sm">
                <th className="px-4 py-2 text-left">SL</th>
                <th className="px-4 py-2 text-left">Image</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-4 text-sm text-gray-500"
                  >
                    Loading banners...
                  </td>
                </tr>
              ) : filteredBanners.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-4 text-sm text-gray-500"
                  >
                    No banners found.
                  </td>
                </tr>
              ) : (
                paginatedBanners.map((item, index) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 border-b border-[#E0E0E0] transition"
                  >
                    <td className="px-4 py-3 text-sm">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>

                    <td className="px-4 py-3">
                      <img
                        src={`${USER_BASE_URL}/${item.image}`}
                        alt={item.name}
                        className="w-[100px] h-[60px] object-cover rounded"
                      />
                    </td>

                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {item.name}
                    </td>

                    <td className="px-4 py-3">
                      <ToggleButton
                        isOn={item.status === "active"}
                        onToggle={async () => {
                          const newStatus =
                            item.status === "active" ? "inactive" : "active";

                          try {
                            const authData = JSON.parse(
                              localStorage.getItem("broom_auth")
                            );
                            const token = authData?.token;

                            if (!token) {
                              toast.error(
                                "Login expired. Please log in again."
                              );
                              return;
                            }

                            const response = await axios.patch(
                              `${USER_BASE_URL}/admin/edit-banner/${item._id}`,
                              { status: newStatus },
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            );

                            if (response.data?.success) {
                              toast.success("Status updated successfully.");
                              setBanners((prevBanners) =>
                                prevBanners.map((b) =>
                                  b._id === item._id
                                    ? { ...b, status: newStatus }
                                    : b
                                )
                              );
                            } else {
                              toast.error("Failed to update status.");
                            }
                          } catch (error) {
                            console.error(error);
                            toast.error(
                              "Something went wrong while updating status."
                            );
                          }
                        }}
                      />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-blue-600">
                        <div
                          onClick={() => navigate(`/CreateBanner/${item._id}`)}
                          className="flex justify-center items-center w-[25px] h-[25px] border border-blue-500 rounded hover:bg-blue-500 text-blue-500 hover:text-white cursor-pointer"
                          title="Edit"
                        >
                          <MdEdit className="text-[15px]" />
                        </div>

                        <button
                          title="View"
                          onClick={() => navigate(`/ViewBanner/${item._id}`)}
                          className="w-[25px] h-[25px] flex items-center justify-center border text-green-500 rounded hover:bg-green-500 hover:text-white cursor-pointer p-1"
                        >
                          <FiEye size={18} />
                        </button>

                        <button
                          className="w-[25px] h-[25px] flex items-center justify-center border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white cursor-pointer"
                          title="Delete"
                          onClick={() => openDeleteModal(item._id)}
                        >
                          <RiDeleteBinLine size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalItems={filteredBanners.length}
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
        para="Do you really want to delete this Banner? This action cannot be undone."
      />
    </div>
  );
};

export default BannerList;
