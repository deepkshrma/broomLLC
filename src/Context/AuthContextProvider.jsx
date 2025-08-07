// src/ContextApi.js
import { createContext, useState, useEffect } from "react";

const ContextApi = createContext();

export const ContextProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    // Only runs once on initial render (avoids flicker)
    const stored = localStorage.getItem("broom_auth");
    return stored ? JSON.parse(stored) : null;
  });

  return (
    <ContextApi.Provider value={{ authData, setAuthData }}>
      {children}
    </ContextApi.Provider>
  );
};

export default ContextApi;
