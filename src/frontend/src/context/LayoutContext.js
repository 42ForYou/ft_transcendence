import React, { createContext, useContext, useState, useEffect } from "react";
import { Outlet } from "../lib/rrfs/index.js";

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [isWide, setIsWide] = useState(window.innerWidth > 2000);

  useEffect(() => {
    const handleResize = () => {
      setIsWide(window.innerWidth > 2000);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <LayoutContext.Provider value={{ isWide }}>{children}</LayoutContext.Provider>;
};

export const useLayout = () => useContext(LayoutContext);

export const LayoutProviderWrapper = () => {
  return (
    <LayoutProvider>
      <Outlet />
    </LayoutProvider>
  );
};
