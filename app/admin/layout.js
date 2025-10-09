import { adminRoutes } from "@/config";
import SideBar from "@/ui/globals/SideBar";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const layout = ({ children }) => {
  return (
    <main className="flex flex-row items-stretch h-screen w-screen ">

        <SideBar links={adminRoutes} role={"admin"} />
        <div className="flex-1 lg:p-5 p-3 h-screen overflow-y-scroll">
          {children}
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
   </main>
  );
};

export default layout;
