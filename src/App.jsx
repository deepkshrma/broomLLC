import { useState } from "react";
import AdminLayout from "./components/adminlayout/AdminLayout";
import AuthLayout from "./components/auth-layout/AuthLayout";
import Allroutes from "./Allroutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Allroutes />
      {/* <AdminLayout/> */}
      {/* <AuthLayout/> */}
    </>
  );
}

export default App;

