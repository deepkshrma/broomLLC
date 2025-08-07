import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import profile_image from "../../assets/images/profile.avif";
import PageTitle from "../../components/common/PageTitle";
import { USER_BASE_URL } from "../../config/Config";
import { toast } from "react-toastify";
import ConfirmActionModal from "../../components/common/ConfirmActionModel/ConfirmActionModel";

function ProviderProfile() {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const fromPage = location.state?.from || "";
  const navigate = useNavigate();

  // const markerIcon = new L.Icon({
  //   iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  //   iconSize: [25, 41],
  //   iconAnchor: [12, 41],
  // });

  useEffect(() => {
    fetchProviderDetails();
  }, []);

  const fetchProviderDetails = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("broom_auth"));
      const token = authData?.token;

      const response = await axios.get(
        `${USER_BASE_URL}/get-all-users?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data.data;
      setProvider(data);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "error fetching providers !";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus, reason) => {
    try {
      const authData = JSON.parse(localStorage.getItem("broom_auth"));
      const token = authData?.token;
      if (!token) {
        toast.error("Token not found! please login again");
        return;
      }
      const res = await axios.put(
        `${USER_BASE_URL}/change-status-users/${provider._id}`,
        {
          status: newStatus,
          status_reason: reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (
        res.data?.status === true ||
        res.data?.status === "success" ||
        res.data?.message?.toLowerCase()?.includes("success")
      ) {
        toast.success(`Status updated to ${newStatus}`);
        setTimeout(() => {
          if (newStatus === "active") {
            // Approve always goes to Provider List
            navigate("/ProviderList");
          } else if (newStatus === "rejected") {
            // Reject goes where it came from
            if (fromPage === "pending") {
              navigate("/PendingRequest");
            } else {
              navigate("/ProviderList");
            }
          }
        }, 1000);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "error while update status !";
      toast.error(errorMessage);
    }
  };
  const confirmStatusChange = () => {
    if (actionType === "approve") {
      handleStatusChange("active", "Approved by admin after review.");
    } else if (actionType === "reject") {
      handleStatusChange(
        "rejected",
        "Rejected due to insufficient/invalid profile info."
      );
    }
    setShowConfirmModal(false);
  };

  if (loading) return <div className="p-6">Loading provider details...</div>;
  if (!provider) return <div className="p-6">Provider not found.</div>;

  return (
    <div className="p-6 main main_page">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <PageTitle title={"Provider Profile"} />
      </div>

      {/* Profile Card */}
      <div className="flex gap-4">
        <div className="bg-white w-[50%] rounded-lg shadow-md p-4 pl-10 grid grid-cols-[auto_1fr] gap-x-10 box-border ">
          {/* Profile Image */}
          <div className="flex flex-col justify-center items-center">
            <img
              src={
                provider.profile_picture
                  ? `${USER_BASE_URL}/${provider.profile_picture}`
                  : profile_image
              }
              alt={provider.first_name}
              className="w-32 h-32 rounded-full object-cover mb-3"
            />
            <p>
              <span
                className={`px-2 py-1 rounded-full ${
                  provider.status === "active"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {provider.status}
              </span>
            </p>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">
              {provider.first_name} {provider.last_name}
            </h2>

            {/* Services */}
            <div className="flex gap-1">
              <p className="font-medium">Services:</p>
              <span>
                {provider.service_categories
                  ?.map((cat) => cat.name)
                  .join(", ") || "N/A"}
              </span>
            </div>

            {/* Email */}
            <div className="flex gap-1">
              <p className="font-medium">Email:</p>
              <span>{provider.email}</span>
            </div>

            {/* DOB */}
            <div className="flex gap-1">
              <p className="font-medium">DOB:</p>
              <span>{provider.dob || "N/A"}</span>
            </div>

            {/* Gender */}
            <div className="flex gap-1">
              <p className="font-medium">Gender:</p>
              <span>{provider.gender}</span>
            </div>

            {/* Phone */}
            <div className="flex gap-1">
              <p className="font-medium">Phone:</p>
              <span>{provider.phone}</span>
            </div>
            {/* Ssn. n */}
            <div className="flex gap-1">
              <p className="font-medium">ssn:</p>
              <span>{provider.ssn_itin}</span>
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div className="bg-white w-[50%] rounded-lg shadow-md p-4 pl-10  box-border ">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">Address</h2>
            <div className="grid grid-cols-[130px_1fr] gap-y-1">
              <p className="font-medium">House No.</p>
              <span>{provider.address?.houseNumber || "N/A"}</span>

              <p className="font-medium">Street</p>
              <span>{provider.address?.street || "N/A"}</span>

              <p className="font-medium">City</p>
              <span>{provider.address?.city || "N/A"}</span>

              <p className="font-medium">State</p>
              <span>{provider.address?.state || "N/A"}</span>

              <p className="font-medium">Country</p>
              <span>{provider.address?.country || "N/A"}</span>

              <p className="font-medium">Zipcode</p>
              <span>{provider.address?.zipCode || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="mt-6 mb-6">
        <h3 className="text-lg font-semibold mb-2">Documents</h3>
        <div className="grid grid-cols-2 rounded-lg gap-4 p-5  shadow-lg">
          <div>
            <p className="font-medium">Govt ID Front:</p>
            <div className="w-full h-64 bg-gray-100 rounded shadow flex items-center justify-center">
              <img
                src={
                  provider.govt_id_front
                    ? `${USER_BASE_URL}/${provider.govt_id_front}`
                    : profile_image
                }
                alt="ID Front"
                className="rounded shadow w-full h-64 object-cover"
                onClick={() => {
                  setSelectedImage(
                    `${USER_BASE_URL}/${provider.govt_id_front}`
                  );
                  setIsImageModalOpen(true);
                }}
              />
            </div>
          </div>
          <div>
            <p className="font-medium">Govt ID Back:</p>
            <div className="w-full h-64 bg-gray-100 rounded shadow flex items-center justify-center">
              <img
                src={
                  provider.govt_id_back
                    ? `${USER_BASE_URL}/${provider.govt_id_back}`
                    : profile_image
                }
                alt="ID Back"
                className="rounded shadow w-full h-64 object-cover"
                onClick={() => {
                  setSelectedImage(`${USER_BASE_URL}/${provider.govt_id_back}`);
                  setIsImageModalOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="flex gap-2 w-full">
          {fromPage === "pending" && (
            <>
              <button
                className="flex w-1/2 items-center justify-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
                onClick={() => {
                  setActionType("approve");
                  setShowConfirmModal(true);
                }}
              >
                Accept
              </button>
              <button
                className="flex w-1/2 items-center justify-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                onClick={() => {
                  setActionType("reject");
                  setShowConfirmModal(true);
                }}
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>

      {/* Map */}
      {/* {provider.latitude && provider.longitude && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Location</h3>
          <div className="h-[400px] rounded-lg overflow-hidden shadow-md">
            <MapContainer
              center={[provider.latitude, provider.longitude]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[provider.latitude, provider.longitude]}
                icon={markerIcon}
              >
                <Popup>{provider.first_name}'s Location</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )} */}

      <ConfirmActionModal
        isOpen={showConfirmModal}
        title={`Confirm ${actionType === "approve" ? "Approval" : "Rejection"}`}
        message={`Are you sure you want to ${
          actionType === "approve" ? "approve" : "reject"
        } this provider?`}
        onConfirm={confirmStatusChange}
        onCancel={() => setShowConfirmModal(false)}
      />

      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 bg-opacity-60 flex justify-center items-center z-50"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="max-w-3xl w-full relative">
            <img
              src={selectedImage}
              alt="Enlarged"
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <button
              className="absolute top-2 right-2 text-white text-2xl"
              onClick={() => setIsImageModalOpen(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProviderProfile;
