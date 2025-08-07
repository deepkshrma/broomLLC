import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import Togglebutton from "../../components/common/Togglebutton";
import { permissionSections } from "../../config/permissionSchema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserShield } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config/Config";

function RoleUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    if (!id) {
      // Only reset when in create mode
      setRoleName("");
      setDescription("");
      setPermissions({});
    }
  }, [location.pathname]);

  // Prefill in edit mode
  useEffect(() => {
    if (!id) return;

    const fetchRole = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem("broom_auth"));
        const token = authData?.token;
        const res = await axios.get(`${BASE_URL}/admin/get-role-by-id/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          const data = res.data.data;
          setRoleName(data.name || "");
          setDescription(data.description || "");
          setPermissions(data.access || {});
        }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || "failed to load role details";
        toast.error(errorMessage);
      }
    };

    fetchRole();
  }, [id]);

  const handleToggle = (sectionKey, path, key) => {
    setPermissions((prev) => {
      const updated = { ...prev };
      const section = { ...(updated[sectionKey] || {}) };

      const manageFields =
        permissionSections.find((s) => s.key === sectionKey)?.manageFields ||
        [];

      if (path === "enabled") {
        section.enabled = !section.enabled;
        if (section.enabled && manageFields.length > 0) {
          section.manageAccess = {
            ...(section.manageAccess || {}),
            ...Object.fromEntries(
              manageFields.map((f) => [f, section.manageAccess?.[f] || false])
            ),
          };
        }
      } else if (!key) {
        section[path] = !section[path];
      } else {
        section.manageAccess = {
          ...(section.manageAccess || {}),
          ...Object.fromEntries(
            manageFields.map((f) => [f, section.manageAccess?.[f] || false])
          ),
        };
        section.manageAccess[key] = !section.manageAccess[key];
      }

      updated[sectionKey] = section;
      return updated;
    });
  };

  const handleSave = async () => {
    const normalizedPermissions = {};

    permissionSections.forEach((section) => {
      const current = permissions[section.key] || {};
      const entry = {
        enabled: !!current.enabled,
      };

      if (section.extraFields) {
        section.extraFields.forEach((field) => {
          entry[field.key] = !!current[field.key];
        });
      }

      if (section.manageFields) {
        const defaults = {};
        section.manageFields.forEach((field) => {
          defaults[field] = current?.manageAccess?.[field] || false;
        });
        entry.manageAccess = defaults;
      }

      normalizedPermissions[section.key] = entry;
    });

    const payload = {
      name: roleName,
      description,
      access: normalizedPermissions,
    };

    try {
      const authData = JSON.parse(localStorage.getItem("broom_auth"));
      const token = authData?.token;

      if (!token) {
        toast.error("Authorization token missing !");
        return;
      }

      const url = id
        ? `${BASE_URL}/admin/update-role/${id}`
        : `${BASE_URL}/admin/create-role`;

      const res = await axios({
        method: id ? "patch" : "post",
        url,
        headers: { Authorization: `Bearer ${token}` },
        data: payload,
      });

      if (res.data.success) {
        toast.success(
          id ? "Role updated successfully" : "Role created successfully"
        );

        if (id) {
          navigate("/Roles");
        }
        setRoleName("");
        setDescription("");
        setPermissions({});

        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      toast.error("Something went wrong while saving the role.");
    }
  };

  return (
    <div className="main main_page w-full h-full p-5 box-border mb-[100px] bg-gray-50">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-[20px] font-bold text-gray-700 flex items-center gap-2">
          <FontAwesomeIcon icon={faUserShield} />{" "}
          {id ? "Edit Role" : "Create Role"}
        </h2>
      </div>

      <div className="w-full bg-white rounded-lg p-10 shadow-sm">
        {/* Role Name and Description */}
        <div className="flex gap-4 mb-8">
          <div className="relative w-1/2">
            <input
              type="text"
              id="role_name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="block px-2.5 pb-2 pt-3 w-full text-md text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-gray-600 peer pl-12"
            />
            <label
              htmlFor="role_name"
              className="absolute text-lg text-gray-700  duration-300 transform -translate-y-4 scale-75 font-medium top-[-10px] left-[-4px]  origin-[0]   px-2 peer-focus:px-2 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Role Name *
            </label>
          </div>

          <div className="relative w-1/2">
            <textarea
              id="role_description"
              rows="1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block px-2.5 pb-2 pt-3 w-full text-md text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-gray-600 peer pl-12"
            />
            <label
              htmlFor="role_description"
              className="absolute text-lg text-gray-700  duration-300 transform -translate-y-4 scale-75 font-medium top-[-10px] left-[-4px]  origin-[0]   px-2 peer-focus:px-2 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Description
            </label>
          </div>
        </div>

        {/* Permissions Section */}
        <div className="mb-6">
          <h2 className="text-[17px] font-semibold text-gray-700">
            Set Permission
          </h2>
          <p className="text-[14px] text-gray-500">
            Modify what individuals on this role can do
          </p>
          <hr className="border-gray-200 mt-3" />
        </div>

        {permissionSections.map((section) => {
          const sectionData = permissions?.[section.key] || {};
          const enabled = sectionData?.enabled || false;
          const manage = sectionData?.manageAccess || {};

          return (
            <div
              key={section.key}
              className="border border-gray-200 rounded p-5 my-5 bg-white shadow-sm"
            >
              <div className="w-full flex justify-between items-center mb-3">
                <h2 className="text-[20px] font-semibold text-gray-700">
                  {section.label}
                </h2>
                <label className="text-md flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => handleToggle(section.key, "enabled")}
                  />
                  Access
                </label>
              </div>
              <hr className="border-gray-200 mb-4" />

              {enabled && (
                <>
                  {section.extraFields && (
                    <div className="flex  gap-6 mb-6">
                      {section.extraFields.map((field) => (
                        <label
                          key={field.key}
                          className="text-md text-gray-700 flex items-center  gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={sectionData?.[field.key] || false}
                            onChange={() =>
                              handleToggle(section.key, field.key)
                            }
                          />
                          {field.label}
                        </label>
                      ))}
                    </div>
                  )}

                  {section.manageFields && (
                    <div>
                      <h4 className="text-md font-medium mb-10 text-gray-700">
                        Manage Access
                      </h4>
                      <div className="grid grid-cols-6 ">
                        {section.manageFields.map((field) => (
                          <div
                            key={field}
                            className="flex items-center gap-1 text-md text-gray-700"
                          >
                            <span className="capitalize ">{field}</span>
                            <Togglebutton
                              isOn={manage[field] || false}
                              onToggle={() =>
                                handleToggle(section.key, "manageAccess", field)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}

        <div className="flex justify-end mt-10">
          <button
            className="bg-blue-600 font-semibold w-full text-white px-6 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
            onClick={handleSave}
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleUpdate;
