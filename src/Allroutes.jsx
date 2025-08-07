import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sign_in from "./pages/auth/Sign_in";
import Dashboard from "./pages/dashboard/Dashboard";
import AdminLayout from "./components/adminlayout/AdminLayout";
import AuthLayout from "./components/auth-layout/AuthLayout";
import CustomizedRequest from "../src/pages/CustomizedRequest/CustomizedRequest";
import RequestDetails from "../src/pages/CustomizedRequest/RequestDetails";
import AdminList from "./pages/employeemanagement/AdminList";
import ContextApi from "./ContextApi";
import { useState } from "react";
import Private from "./privateroutes/Private";
import RoleUpdate from "./pages/RoleUpdate/RoleUpdate";
import CreateAdmin from "./pages/CreateAdmin/CreateAdmin";
import BookingRequest from "./pages/BookingRequest/BookingRequest";
import Categories from "./pages/Categories/Categories";
import AddCategories from "./pages/Categories/AddCategories";
import UpdateParentCategory from "./pages/Categories/UpdateParentCategory";
import Roles from "./pages/Roles/Roles";
import MainCategories from "./pages/Categories/MainCategories";
import UpdateAdmin from "./pages/UpdateAdmin/UpdateAdmin";
import ProfileUpdate from "./pages/ProfileUpdate/ProfileUpdate";
import Profile from "./pages/Profile/Profile";
import ProviderList from "./pages/Provider/ProviderList";
import PendingRequest from "./pages/Provider/PendingRequest";
import CustomerList from "../src/pages/Customer/CustomerList";
import PoliciesList from "./pages/Policies/PoliciesList";
import CreatePolicies from "./pages/Policies/CreatePolicies";
import ProviderProfile from "./pages/Provider/ProviderProfile";
import ViewPolicy from "./pages/Policies/ViewPolicy";
import CustomerProfile from "./pages/Customer/CustomerProfile";
import ErrorPage404 from "./pages/Error/ErrorPage404";
import CreateBanner from "./pages/Banner/CreateBanner";
import BannerList from "./pages/Banner/BannerList";
import ViewBanner from "./pages/Banner/ViewBanner";

const Allroutes = () => {
  const [authData, setAuthData] = useState(() =>
    JSON.parse(localStorage.getItem("broom_auth"))
  );

  return (
    <ContextApi.Provider value={{ authData, setAuthData }}>
      <Router>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Sign_in />} />
          </Route>

          <Route element={<AdminLayout />}>
            <Route path="/update_profile/:id" element={<UpdateAdmin />} />
            <Route
              path="/dashboard"
              element={
                <Private>
                  <Dashboard />
                </Private>
              }
            />
            <Route path="/RoleUpdate" element={<RoleUpdate />} />
            <Route path="/RoleUpdate/:id" element={<RoleUpdate />} />
            <Route path="/admin_list" element={<AdminList />} />
            <Route path="/CreateAdmin" element={<CreateAdmin />} />
            <Route path="/BookingRequest" element={<BookingRequest />} />
            <Route path="/Categories" element={<Categories />} />
            <Route path="/AddCategories" element={<AddCategories />} />
            <Route path="/Roles" element={<Roles />} />
            <Route path="/MainCategories" element={<MainCategories />} />
            <Route path="/ProfileUpdate" element={<ProfileUpdate />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/CustomizedRequest" element={<CustomizedRequest />} />
            <Route path="/RequestDetails" element={<RequestDetails />} />
            <Route path="/ProviderList" element={<ProviderList />} />
            <Route path="/PendingRequest" element={<PendingRequest />} />
            <Route path="/CustomerList" element={<CustomerList />} />
            <Route path="/CreatePolicies" element={<CreatePolicies />} />
            <Route path="/PoliciesList" element={<PoliciesList />} />
            <Route path="/ProviderProfile/:id" element={<ProviderProfile />} />
            <Route path="/ViewPolicy/:id" element={<ViewPolicy />} />
            <Route path="/CreateBanner" element={<CreateBanner />} />
            <Route path="/CreateBanner/:id" element={<CreateBanner />} />
            <Route path="/BannerList" element={<BannerList />} />
            <Route path="/ViewBanner/:id" element={<ViewBanner />} />
            <Route path="/CustomerProfile/:id" element={<CustomerProfile />} />
            <Route
              path="/UpdateParentCategory"
              element={<UpdateParentCategory />}
            />
          </Route>
          <Route path="*" element={<ErrorPage404 />} />
        </Routes>
      </Router>
    </ContextApi.Provider>
  );
};

export default Allroutes;
