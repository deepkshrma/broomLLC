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
import { TfiLayoutMenuSeparated } from "react-icons/tfi";
import { MdEdit } from "react-icons/md";
import PendingActionModel from "./PendingActionModel";
import { toast } from "react-toastify";
import axios from "axios";
import { USER_BASE_URL } from "../../config/Config";
import { useNavigate } from "react-router-dom";

function PendingRequest() {
  const [categories, setCategories] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Pending Request");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingServiceProviders();
  }, []);

  useEffect(() => {
    applyStatusFilter(selectedStatus);
  }, [categories, selectedStatus, searchTerm]);

  const fetchPendingServiceProviders = async () => {
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

      const formattedData = response.data.data.map((item, index) => ({
        id: item._id,
        image: item.profile_picture
          ? `${USER_BASE_URL}/${item.profile_picture}`
          : image,
        name: `${item.first_name || ""} ${item.last_name || ""}`,
        ratting: item.rating || 0,
        address: item.address?.city || "",
        phone: item.phone || "",
        email: item.email || "",
        status: item.status || "",
        action: true,
      }));

      setCategories(formattedData);
    } catch (error) {
      console.error("Failed to fetch service providers:", error);
    }
  };

  const applyStatusFilter = (status) => {
    const statusKey =
      status === "Pending Request" ? "pending_approval" : "rejected";

    // Filter by status first
    let filtered = categories.filter((item) => item.status === statusKey);

    // Apply search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.phone.toLowerCase().includes(term) ||
          item.email.toLowerCase().includes(term) ||
          item.address.toLowerCase().includes(term)
      );
    }

    setFilteredData(filtered);
  };

  return (
    <>
      <div className="main main_page bg-[#F3F4F8] font-Montserrat space-y-4">
        <PageTitle title={"Pending Request"} />

        <div className="px-4 rounded-lg shadow-md mt-5 flex justify-between font-bold">
          <ul className="flex text-[12px] gap-2">
            {["Pending Request", "Rejected"].map((status) => (
              <li
                key={status}
                className={`p-2 cursor-pointer ${
                  selectedStatus === status
                    ? "text-black border-b-2 border-black"
                    : "text-gray-400"
                } hover:text-black`}
                onClick={() => setSelectedStatus(status)}
              >
                {status}
              </li>
            ))}
          </ul>
        </div>

        {/* Table */}
        <div className="w-[100%] h-auto p-2  bg-white rounded-lg">
          <div className="flex relative justify-between w-[100%] h-auto">
            <form action="" className="flex gap-1">
              <div className="relative flex gap-2 px-3 py-2 bg-blue-50">
                <FaSearch className="absolute opacity-40 top-3" size={15} />
                <input
                  type="search"
                  placeholder="Search here"
                  className="ml-6 text-[14px] outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
          </div>

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
                        i === 4 ? "text-center" : "text-left"
                      } whitespace-nowrap`}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <tr className="border-b border-gray-200">
                      <td className="text-[14px] px-8 py-3 text-left">
                        {index + 1}
                      </td>
                      <td className="text-[14px] px-8 py-3 text-left max-w-[500px] min-w-[170px]">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || "/default-profile.png"}
                            alt={item.name}
                            className="w-10 h-10 rounded-full object-cover bg-amber-200"
                          />
                        </div>
                      </td>
                      <td className="text-[14px] px-8 py-3 text-left">
                        <div>
                          <div className="whitespace-nowrap font-semibold">
                            {item.name}
                          </div>
                        </div>
                      </td>
                      <td className="text-[14px] px-8 py-3 text-left max-w-[400px] min-w-[250px]">
                        <div>
                          <div className="font-semibold">{item.address}</div>
                          <div className="text-gray-500">{item.phone}</div>
                          <div className="text-gray-500">{item.email}</div>
                        </div>
                      </td>
                      <td className="text-[14px] px-8 py-3 text-center">
                        <div
                          className={`px-2 py-1 w-full flex justify-center items-center ${
                            item.status === "pending_approval"
                              ? "bg-orange-200 text-orange-500"
                              : "bg-red-200 text-red-500"
                          } font-semibold rounded-full`}
                        >
                          {item.status === "pending_approval"
                            ? "Pending"
                            : "Rejected"}
                        </div>
                      </td>
                      <td className="text-[14px] px-8 py-3 text-center">
                        {/* <div className="flex justify-center border border-gray-300 rounded-md overflow-hidden">
                          <button
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition cursor-pointer"
                            title="View"
                            onClick={() =>
                              navigate(`/ProviderProfile/${item.id}`)
                            }
                          >
                            <FiEye size={18} />
                          </button>
                          <button
                            className="w-8 h-8 flex items-center justify-center border-l border-gray-300 hover:bg-gray-100 transition cursor-pointer"
                            // onClick={() => handleDelete(item.id)}
                            onClick={() => openDeleteModal(item._id)}
                            title="Delete"
                          >
                            <RiDeleteBinLine
                              className="text-red-500"
                              size={18}
                            />
                          </button>
                        </div> */}
                        {/* <div className="w-full flex border-1 border-gray-300 rounded-md"> */}
                        <div
                          className="w-1/2 flex justify-center items-center cursor-pointer"
                          title="View"
                          onClick={() =>
                            navigate(`/ProviderProfile/${item.id}`, {
                              state: { from: "pending" },
                            })
                          }
                        >
                          <FiEye size={25} />
                        </div>
                        {/* <div
                            className="w-1/2 flex justify-center items-center border-l border-gray-300 hover:bg-gray-100 cursor-pointer"
                            onClick={() => openDeleteModal(item.id)}
                            title="Delete"
                          >
                            <RiDeleteBinLine
                              className="text-red-500"
                              size={18}
                            />
                          </div> */}
                        {/* </div> */}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default PendingRequest;
