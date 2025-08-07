import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";
import { USER_BASE_URL } from "../../config/Config";

function PendingActionModel({
  onClose,
  providerId,
  currentStatus,
  defaultReason,
  onStatusUpdated,
}) {
  const [status, setStatus] = useState(currentStatus || "");
  const [reason, setReason] = useState(defaultReason || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!status || !reason) {
      toast.error("Please select status and provide a reason.");
      return;
    }

    try {
      const authData = JSON.parse(localStorage.getItem("broom_auth"));
      const token = authData?.token;
      if (!token) {
        toast.error("Token not found! please login again");
        return;
      }
      const response = await axios.put(
        `${USER_BASE_URL}/change-status-users/${providerId}`,
        { status, status_reason: reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Status updated successfully.");
        onStatusUpdated(status, reason);
        onClose();
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong during update."
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="w-1/3 bg-white rounded-xl p-6 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <IoMdClose size={20} />
        </button>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold text-gray-800">
            Update Provider Status
          </h2>

          {/* Status Options */}
          <div className="flex gap-8">
            {["active", "inactive", "suspended", "rejected"].map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer capitalize"
              >
                <input
                  type="radio"
                  name="adminStatus"
                  value={option}
                  checked={status === option}
                  onChange={() => setStatus(option)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>

          {/* Reason Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Status Reason
            </label>
            <textarea
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none"
              placeholder="Enter reason here..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm cursor-pointer"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PendingActionModel;
