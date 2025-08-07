import React, { useState, useEffect } from "react";
import PageTitle from "../../components/common/PageTitle";
import {
  FaSearch,
  FaCaretDown,
  FaCaretLeft,
  FaCaretRight,
} from "react-icons/fa";
import { CiExport } from "react-icons/ci";
import { MdDownload, MdFilterList } from "react-icons/md";
import image from "../../assets/images/icons/guest.png";
import TogglebuttonSmall from "../../components/common/TogglebuttonSmall";
import { FiEye } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEyeOff } from "react-icons/fi";
import { MdStarRate } from "react-icons/md";
import { USER_BASE_URL } from "../../config/Config";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUsers } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { FaUserXmark } from "react-icons/fa6";
import { FaUserShield } from "react-icons/fa6";
import PendingActionModel from "./PendingActionModel";
import DeleteModel from "../../components/DeleteModel/DeleteModel";
import Pagination from "../../components/common/Pagination";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

function ProviderList() {
  const [activeModalId, setActiveModalId] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalRecords: 0,
  });

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [providers, setProviders] = useState([]);
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();

  const closeDeleteModal = () => {
    setSelectedProviderId(null);
    setShowDeleteModal(false);
  };
  const openDeleteModal = (id) => {
    setSelectedProviderId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("broom_auth"));
      const token = authData?.token;
      if (!token) {
        toast.error("Token not found! please login again");
        return;
      }

      const res = await axios.delete(
        `${USER_BASE_URL}/delete-user/${selectedProviderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        toast.success("Provider deleted successfully.");
        setProviders((prev) =>
          prev.filter((p) => p._id !== selectedProviderId)
        );
      } else {
        toast.error(res.data?.message || "Failed to delete provider.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Something went wrong while deleting the provider.");
    } finally {
      closeDeleteModal();
    }
  };
  const fetchProviders = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("broom_auth"));
      const token = authData?.token;
      if (!token) {
        toast.error("Token not found! login again !");
        return;
      }

      const response = await axios.get(`${USER_BASE_URL}/get-all-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const onlyActiveProviders = response.data.data.filter(
          (user) =>
            user.role === "service_provider" &&
            user.status !== "rejected" &&
            user.status !== "pending_approval"
        );
        setProviders(onlyActiveProviders);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch providers!";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchProviders(pagination.currentPage);
  }, []);

  useEffect(() => {
    fetchPendingCount();
  }, []);

  const fetchPendingCount = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("broom_auth"));
      const token = authData?.token;
      if (!token) {
        toast.error("Token not found! please login again");
        return;
      }
      const response = await axios.get(
        `${USER_BASE_URL}/get-pending-service-providers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data?.data || [];

      const count = data.filter(
        (item) => item.status === "pending_approval"
      ).length;
      setPendingCount(count);
    } catch (error) {
      console.error("Failed to fetch pending request count:", error);
    }
  };

  const activeProvidersCount = providers.filter(
    (provider) => provider.status === "active"
  ).length;

  const inactiveProvidersCount = providers.filter(
    (provider) => provider.status === "inactive"
  ).length;

  const filteredProviders = providers.filter((provider) => {
    const matchesStatus =
      statusFilter === "all" || provider.status === statusFilter;

    const fullName =
      `${provider.first_name} ${provider.last_name}`.toLowerCase();
    const email = provider.email?.toLowerCase() || "";
    const phone = provider.phone?.toLowerCase() || "";
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      fullName.includes(search) ||
      email.includes(search) ||
      phone.includes(search);

    return matchesStatus && matchesSearch;
  });

  const handleExportExcel = () => {
    const exportData = filteredProviders.map((item, index) => ({
      SL: index + 1,
      Name: `${item.first_name} ${item.last_name}`,
      Email: item.email,
      Phone: item.phone,
      Status: item.status,
      Address: `${item.address?.houseNumber || ""}, ${
        item.address?.street || ""
      }, ${item.address?.city || ""}, ${item.address?.state || ""}, ${
        item.address?.country || ""
      } - ${item.address?.zipCode || ""}`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Providers");

    XLSX.writeFile(workbook, "Providers_List.xlsx");
  };

  return (
    <>
      <div className="main main_page bg-[#F3F4F8] font-Montserrat space-y-4">
        {/* ---------title page */}
        <PageTitle title={"Provider"} />
        {/* ---------card box */}
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-blue-900 rounded-xl flex space-x-3 text-white h-[100px]   justify-between">
              <div className="space-y-3">
                <h4 className="text-[14px]  ">Total Provider</h4>
                <p className="text-[22px] font-[600]">{providers.length}</p>
              </div>
              <div className="">
                <div className="w-15 h-15 bg-white/60  rounded-3xl flex justify-center  items-center">
                  {/* <img src={dashboard_users} alt="dashboard_users" /> */}
                  <FaUsers size={35} className="text-blue-900" />
                </div>
              </div>
            </div>
            <div className="p-3 bg-orange-400 rounded-xl flex space-x-3 text-white h-[100px]   justify-between">
              <div className="space-y-3">
                <h4 className="text-[14px]  ">Onboarding Request</h4>
                <p className="text-[22px] font-[600]">{pendingCount}</p>
              </div>
              <div className="">
                <div className="w-15 h-15 bg-white/60  rounded-3xl flex justify-center  items-center">
                  <FaUserShield size={35} className="text-orange-400" />
                </div>
              </div>
            </div>
            <div className="p-3 bg-green-500 rounded-xl flex space-x-3 text-white h-[100px]   justify-between">
              <div className="space-y-3">
                <h4 className="text-[14px]  ">Active Providers</h4>
                <p className="text-[22px] font-[600]">{activeProvidersCount}</p>
              </div>
              <div className="">
                <div className="w-15 h-15 bg-white/60  rounded-3xl flex justify-center  items-center">
                  <FaUserAlt size={35} className="text-green-500" />
                </div>
              </div>
            </div>
            <div className="p-3 bg-red-500 rounded-xl flex space-x-3 text-white h-[100px]   justify-between">
              <div className="space-y-3">
                <h4 className="text-[14px]  ">Inactive Providers</h4>
                <p className="text-[22px] font-[600]">
                  {inactiveProvidersCount}
                </p>
              </div>
              <div className="">
                <div className="w-15 h-15 bg-white/60  rounded-3xl flex justify-center  items-center">
                  <FaUserXmark size={35} className="text-red-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[100%] h-auto p-2 mt-10 bg-white rounded-lg">
          {/* Search + Filter */}
          <div className="flex relative justify-between w-[100%] h-auto">
            <form action="" className="flex gap-1">
              <div className="relative flex gap-2 px-3 bg-blue-50">
                <FaSearch className="absolute opacity-40 top-3" size={15} />
                <input
                  type="search"
                  placeholder="Search here"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ml-6 text-[14px] outline-none bg-blue-50 appearance-none"
                />
              </div>
              {/* <button
                type="submit"
                className="px-[15px] py-[8px] text-[14px] bg-blue-500 rounded text-white cursor-pointer"
              >
                Search
              </button> */}
            </form>
            <div className="flex gap-2">
              <div className="flex gap-2 items-center">
                <label className="text-sm font-medium">Filter by Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div
                onClick={handleExportExcel}
                className="flex gap-2 justify-center items-center rounded  px-4 border border-gray-300 cursor-pointer hover:bg-gray-100"
                title="Export to Excel"
              >
                <CiExport className="text-black" />
                <span className="text-[14px]">Export</span>
              </div>
            </div>
            {/* filter dropdown form */}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="mt-2 w-full border-collapse">
              <thead className="bg-blue-50">
                <tr className="text-gray-700">
                  {[
                    "SL",
                    "Image",
                    "Service Provider",
                    "Provider Info",
                    "Status",
                    "Action",
                  ].map((head, i) => (
                    <th
                      key={head}
                      className={`text-[14px] px-8 py-3 ${
                        i > 3 ? "text-center" : "text-left"
                      } whitespace-nowrap`}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProviders.map((item, index) => (
                  <React.Fragment key={item._id}>
                    <tr className="border-b border-gray-200">
                      {/* SL */}
                      <td className="text-[14px] px-8 py-3 text-left">
                        {index + 1}
                      </td>

                      {/* Provider */}
                      <td className="text-[14px] px-8 py-3 text-left max-w-[500px] min-w-[170px]">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              item.profile_picture
                                ? `${USER_BASE_URL}/${item.profile_picture}`
                                : image
                            }
                            alt={`${item.first_name} ${item.last_name}`}
                            className="w-10 h-10 rounded-full object-cover bg-amber-200"
                          />
                        </div>
                      </td>

                      <td className="text-[14px] px-8 py-3 text-left">
                        <div>
                          <div className="whitespace-nowrap font-semibold">
                            {`${item.first_name} ${item.last_name}`}
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="text-[14px] px-8 py-3 text-left max-w-[400px] min-w-[250px]">
                        <div>
                          <div className="font-semibold">{`${item.address.houseNumber}, ${item.address.street}, ${item.address.city}, ${item.address.state}, ${item.address.country}, ${item.address.zipCode}`}</div>
                          <div className="text-gray-500">{item.phone}</div>
                          <div className="text-gray-500">{item.email}</div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="text-[14px] px-8 py-3 text-center">
                        <div
                          onClick={() => {
                            setSelectedProvider(item);
                            setShowStatusModal(true);
                          }}
                          className={`cursor-pointer px-2 py-1 w-full flex justify-center items-center ${
                            item.status === "active"
                              ? "bg-green-200 text-green-500"
                              : item.status === "inactive"
                              ? "bg-yellow-200 text-yellow-500"
                              : "bg-red-200 text-red-500"
                          } font-semibold rounded-full hover:opacity-90 transition`}
                          title="Click to change status"
                        >
                          {item.status}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="text-[14px] px-8 py-3 text-center">
                        {/* <div className="flex justify-center border border-gray-300 rounded-md overflow-hidden">
                          <button
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition  cursor-pointer"
                            title="View"
                            onClick={() =>
                              navigate(`/ProviderProfile/${item._id}`)
                            }
                          >
                            <FiEye size={18} />
                          </button>
                          <button
                            className="w-8 h-8 flex items-center justify-center border-l border-gray-300 hover:bg-gray-100 transition  cursor-pointer"
                            onClick={() => handleDelete(item.id)}
                            title="Delete"
                          >
                            <RiDeleteBinLine
                              className="text-red-500"
                              size={18}
                            />
                          </button>
                        </div> */}
                        <div className="w-full flex border-1 border-gray-300 rounded-md">
                          <div
                            className="w-1/2 flex justify-center items-center px-2 py-2 hover:bg-gray-100 cursor-pointer"
                            title="View"
                            onClick={() =>
                              navigate(`/ProviderProfile/${item._id}`, {
                                state: { from: "list" },
                              })
                            }
                          >
                            <FiEye size={18} />
                          </div>
                          <div
                            className="w-1/2 flex justify-center items-center border-l border-gray-300 hover:bg-gray-100 cursor-pointer"
                            onClick={() => openDeleteModal(item._id)}
                            title="Delete"
                          >
                            <RiDeleteBinLine
                              className="text-red-500"
                              size={18}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={pagination.currentPage}
              totalItems={pagination.totalUsers}
              itemsPerPage={10} // Same limit as API
              onPageChange={(page) => fetchUsers(page)} // Call API on page change
              totalPages={pagination.totalPages} // Backend total pages
              type="backend"
            />
          </div>
        </div>
        {showStatusModal && selectedProvider && (
          <PendingActionModel
            onClose={() => setShowStatusModal(false)}
            providerId={selectedProvider._id}
            currentStatus={selectedProvider.status}
            defaultReason={selectedProvider.status_reason}
            onStatusUpdated={(newStatus, newReason) => {
              setProviders((prev) =>
                prev.map((user) =>
                  user._id === selectedProvider._id
                    ? { ...user, status: newStatus, status_reason: newReason }
                    : user
                )
              );

              if (statusFilter !== "all" && newStatus !== statusFilter) {
                setProviders((prev) =>
                  prev.filter((user) => user._id !== selectedProvider._id)
                );
              }
            }}
          />
        )}
      </div>
      <DeleteModel
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        redbutton="Yes, Delete"
        para="Do you really want to delete this Provider? This action cannot be undone."
      />
    </>
  );
}

export default ProviderList;
