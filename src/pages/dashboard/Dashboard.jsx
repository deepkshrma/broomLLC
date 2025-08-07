import RevenueChart from "../../components/charts/RevenueChart";

import TotalUserChart from "../../components/charts/TotalUserChart";
import TotalAdminChart from "../../components/charts/TotalAdminChart";

import TotalVendorsChart from "../../components/charts/TotalVendorsChart";

import dashboard_users from "../../assets/images/icons/dashbord_users.png";
import dashboard_admin from "../../assets/images/icons/admin.png";
import dashboard_revenue from "../../assets/images/icons/revenue.png";
import dashboard_pending from "../../assets/images/icons/pending.png";
import PageTitle from "../../components/common/PageTitle";

const Dashboard = () => {
  return (
    <div className="main main_page bg-[#F3F4F8] font-Montserrat space-y-4">
      {/* ---------title page */}
      <PageTitle title={"Dashboard"} />
      {/* ---------card box */}
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 bg-[#ffffff] rounded-xl flex space-x-3 h-[100px]   justify-between">
            <div className="space-y-3">
              <h4 className="text-[14px] text-[#78797a] font-[500]">
                Total User
              </h4>
              <p className="text-[22px] font-bold">40,689</p>
            </div>
            <div className="">
              <div className="w-15 h-15 bg-[#e5e4ff]  rounded-3xl flex justify-center  items-center">
                <img src={dashboard_users} alt="dashboard_users" />
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#ffffff] rounded-xl flex space-x-3 h-[100px]   justify-between">
            <div className="space-y-3">
              <h4 className="text-[14px] text-[#78797a] font-[500]">
                Total Admin
              </h4>
              <p className="text-[22px] font-bold">40</p>
            </div>
            <div className="">
              <div className="w-15 h-15 bg-[#fff3d6] rounded-3xl flex justify-center  items-center">
                <img src={dashboard_admin} alt="dashboard_users" />
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#ffffff] rounded-xl flex space-x-3 h-[100px]   justify-between">
            <div className="space-y-3">
              <h4 className="text-[14px] text-[#78797a]  font-[500]">
                Total Revenue
              </h4>
              <p className="text-[22px] font-bold">40,689</p>
            </div>
            <div className="">
              <div className="w-15 h-15 bg-[#d9f7e8] rounded-3xl flex justify-center  items-center">
                <img src={dashboard_revenue} alt="dashboard_users" />
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#ffffff] rounded-xl flex space-x-3 h-[100px]   justify-between">
            <div className="space-y-3">
              <h4 className="text-[14px] text-[#78797a] font-[500]">
                Total Service Providers
              </h4>
              <p className="text-[22px] font-bold">40,689</p>
            </div>
            <div className="">
              <div className="w-15 h-15 bg-[#ffded1] rounded-3xl flex justify-center  items-center">
                <img src={dashboard_pending} alt="dashboard_users" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ------------revenue chart-------------- */}
      <div className="bg-white p-4 rounded-xl">
        <div className="flex justify-between items-center py-2 mb-2">
          <h2 className="font-[500] text-[#202224] ">Revenue</h2>
          <select className="bg-[#FCFDFD] text-[12px] text-[#2B3034] focus:outline-none focus:ring-1 focus:ring-[#9C9C9C]  border-[1px] border-[#D5D5D5] rounded-sm p-1">
            <option>January</option>
            <option>February</option>
            <option>March</option>
            <option>April</option>
            <option>May</option>
            <option>June</option>
            <option>July</option>
            <option>Augest</option>
          </select>
        </div>
        <RevenueChart />
      </div>

      {/* --------chart cards------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-3 bg-white rounded-xl flex flex-col space-y-3 h-[300px]">
          <h5 className="font-medium text-[#202224] mb-2">Total User</h5>
          <p className="text-[22px] font-medium">40,689</p>
          <div className="flex-1">
            <TotalUserChart />
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl flex flex-col space-y-3 h-[300px]">
          <h5 className="font-medium text-[#202224] mb-2">Total Admin</h5>
          <p className="text-[22px] font-medium">40,689</p>
          <div className="flex-1">
            <TotalAdminChart />
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl flex flex-col space-y-3 h-[300px]">
          <h5 className="font-medium text-[#202224] mb-2">
            Total Service Providers
          </h5>
          <p className="text-[22px] font-medium">40,689</p>
          <div className="flex-1">
            <TotalVendorsChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
