"use client";
import Image from "next/image";
import React, { useState } from "react";
import logo from "../../public/logo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideBar = ({ links, role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathName = usePathname();
  console.log("pathname......", pathName);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setIsMobile(true);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        w-80 lg:w-80
        bg-gradient-to-b from-slate-900 to-blue-900
        border-r border-blue-700/50
        shadow-2xl
      `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-blue-700/50">
            <div className="flex items-center justify-between">
              <Image
                src={logo}
                width={160}
                height={60}
                alt="Logo"
                className="brightness-0 invert"
              />
              <button
                onClick={closeSidebar}
                className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 p-6">
            <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/80 text-sm font-medium">Logged in as</p>
              <p className="text-white text-lg font-bold capitalize bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {role}
              </p>
            </div>

            <nav className="space-y-2">
              {links?.map((link, index) => (
                <Link
                  key={link?.title}
                  href={`/${role}${link?.path}`}
                  onClick={closeSidebar}
                  className={`flex items-center gap-4 p-4 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group border border-transparent hover:border-white/20 ${
                    pathName == `/${role}${link?.path}`? "border-white": ""
                  }`}
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg group-hover:from-blue-400 group-hover:to-purple-500 transition-all duration-200">
                    <span className="text-white font-bold text-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="font-semibold text-lg group-hover:translate-x-1 transition-transform duration-200">
                    {link?.title}
                  </span>
                  <svg
                    className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}
    </>
  );
};

export default SideBar;
