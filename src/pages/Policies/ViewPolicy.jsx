import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../config/Config";
import { toast } from "react-toastify";
import PageTitle from "../../components/common/PageTitle";

const ViewPolicy = () => {
  const { id } = useParams();
  const [policy, setPolicy] = useState(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem("broom_auth"));
        const token = authData?.token;
        if (!token) {
          toast.error("login again , token not found");
          return;
        }
        const res = await axios.get(
          `${BASE_URL}/admin/get-policies-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data?.success) {
          setPolicy(res.data?.data);
        } else {
          toast.error(res.data?.message || "Failed to load policy");
        }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || "error fatching policies details !";
        toast.error(errorMessage);
      }
    };

    fetchPolicy();
  }, [id]);

  return (
    <div className="px-[20px] mb-[100px] main main_page">
      <PageTitle title="Policy Details" />
      <div className="p-4 mt-2 bg-white rounded-lg shadow">
        {policy ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">{policy.title}</h2>
            <div
              className="prose max-w-full"
              dangerouslySetInnerHTML={{ __html: policy.description }}
            />
          </div>
        ) : (
          <p className="text-gray-500">Loading policy...</p>
        )}
      </div>
    </div>
  );
};

export default ViewPolicy;
