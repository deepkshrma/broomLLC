import React, { useEffect, useState } from "react";
import PageTitle from "../../components/common/PageTitle";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { BASE_URL } from "../../config/Config";
import { useNavigate } from "react-router-dom";
import DeleteModel from "../../components/DeleteModel/DeleteModel";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav";

const PoliciesList = () => {
  const [policies, setPolicies] = useState([]);
  const [filter, setFilter] = useState("User");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const authData = JSON.parse(localStorage.getItem("broom_auth"));
  const token = authData?.token;
  const navigate = useNavigate();
  const fetchPolicies = async (target) => {
    const endpoint =
      target === "User"
        ? `${BASE_URL}/admin/get-policies-for-users`
        : `${BASE_URL}/admin/policies-for-service-providers`;

    try {
      const authData = JSON.parse(localStorage.getItem("broom_auth"));
      const token = authData?.token;
      if (!token) {
        toast.error("login again , token not found");
        return;
      }
      const res = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        const data = res.data;

        // Extract only known policy keys and skip null ones
        const policyArray = [];

        const knownPolicyKeys = [
          "terms_and_conditions",
          "privacy_policy",
          "refund_policy",
          "cancellation_policy",
          "payment_policy",
          "eula",
        ];

        knownPolicyKeys.forEach((key) => {
          if (data[key]) {
            policyArray.push(data[key]);
          }
        });

        setPolicies(policyArray);
      } else {
        toast.error(res.data?.message || "Failed to fetch policies.");
        setPolicies([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while fetching policies.");
      setPolicies([]);
    }
  };

  useEffect(() => {
    fetchPolicies(filter);
  }, [filter]);

  const openDeleteModal = (id) => {
    setSelectedPolicyId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedPolicyId(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("broom_auth"));
      const token = authData?.token;
      if (!token) {
        toast.error("login again , token not found");
        return;
      }

      const res = await axios.delete(
        `${BASE_URL}/admin/delete-policy/${selectedPolicyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        toast.success("Policy deleted successfully.");
        setPolicies((prev) => prev.filter((p) => p._id !== selectedPolicyId));
      } else {
        toast.error(res.data?.message || "Failed to delete policy.");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "failed !";
      toast.error(errorMessage);
    } finally {
      closeDeleteModal();
    }
  };

  const filteredPolicies = policies.filter((policy) =>
    policy.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTextPreview = (html, limit = 100) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <div className="px-[20px] mb-[100px] main main_page">
      <BreadcrumbsNav
        customTrail={[{ label: "Policies List", path: "/PoliciesList" }]}
      />
      <PageTitle title={"Policies List"} />

      <div className="w-full h-auto p-4 mt-2 bg-white rounded-lg shadow">
        {/* search n filter */}
        <div className="flex flex-col md:flex-row md:justify-between w-full gap-4 mb-4">
          {/* Search */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2 items-center"
          >
            <div className="relative flex items-center bg-blue-50 px-3 py-2 rounded">
              <FaSearch className="absolute opacity-40 left-3" size={14} />
              <input
                type="search"
                placeholder="Search title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 text-sm bg-transparent outline-none"
              />
            </div>
          </form>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Policy For:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none"
            >
              <option value="User">User</option>
              <option value="Service_Provider">Service Provider</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr className="text-gray-700 text-sm">
                <th className="px-4 py-2 text-left">SL</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPolicies.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-4 text-sm text-gray-500"
                  >
                    No policies found.
                  </td>
                </tr>
              ) : (
                filteredPolicies.map((item, index) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 border-b border-[#E0E0E0] transition"
                  >
                    <td className="px-4 py-3 text-sm">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {item.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {getTextPreview(item.description, 50)}
                      {item.description && item.description.length > 100}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-blue-600">
                        <button
                          title="View"
                          onClick={() => navigate(`/ViewPolicy/${item._id}`)}
                          className="w-[25px] h-[25px] flex items-center justify-center border  text-green-500 rounded hover:bg-green-500 hover:text-white cursor-pointer p-1"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          title="Edit"
                          onClick={() =>
                            navigate("/CreatePolicies", {
                              state: {
                                editMode: true,
                                policyData: item,
                              },
                            })
                          }
                          className="w-[25px] h-[25px] flex items-center justify-center border  text-yellow-500 rounded hover:bg-yellow-500 hover:text-white cursor-pointer  "
                        >
                          ✏️
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
        </div>
      </div>
      <DeleteModel
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        redbutton="Yes, Delete"
        para="Do you really want to delete this Policy? This action cannot be undone."
      />
    </div>
  );
};

export default PoliciesList;
