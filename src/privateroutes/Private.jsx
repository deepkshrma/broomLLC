import { useContext, useState } from "react";
import ContextApi from "../ContextApi";
import { Navigate } from "react-router-dom";

const Private = ({ children }) => {
  const { authData, setAuthData } = useContext(ContextApi);
  if (!authData || !authData.token) {
    return <Navigate to="/" replace />;
  }

  return children;
};
export default Private;
