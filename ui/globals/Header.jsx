"use client";
import React, { useState } from "react";
import Image from "next/image";
import logo from "../../public/logo.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PiStudentBold } from "react-icons/pi";
import { RiAdminLine } from "react-icons/ri";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";

const Header = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const navigateTo = (path) => {
    if (path) router.push(`${path}`);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="sticky top-0 left-0 right-0 w-full flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg px-6 py-3 z-50 border-b-4 border-blue-400">
      <div className="flex items-center">
        <Image 
          src={logo} 
          width={160} 
          height={60}
          alt="Logo" 
          className="brightness-0 invert"
        />
      </div>

      <div className="text-2xl font-bold text-white tracking-tight bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
        Student Portal
      </div>

      <div className="flex items-center gap-4">
        <div className="py-2">
          <div className="relative inline-block">
            <button
              type="button"
              className="px-6 py-3 text-white bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-xl text-sm inline-flex items-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={toggleDropdown}
            >
              Log-in as
              <svg
                className={`w-3 h-3 ml-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="m19 9-7 7-7-7"
                />
              </svg>
            </button>

            {isOpen && (
              <div className="origin-top-right absolute right-0 mt-3 w-48 rounded-xl shadow-2xl bg-white border border-gray-100 overflow-hidden">
                <ul>
                  <li className="border-b border-gray-100 last:border-b-0">
                    <Link
                      href="/auth"
                      className="flex px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                      onClick={closeDropdown}
                    >
                      <LiaChalkboardTeacherSolid size={30} className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md mr-2 text-xs font-bold"/>
                      Teacher
                    </Link>
                  </li>
                  <li className="border-b border-gray-100 last:border-b-0">
                    <Link
                      href="/auth"
                      className="flex px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-150"
                      onClick={closeDropdown}
                    >
                      <PiStudentBold size={30} className="bg-green-100 text-green-600 px-2 py-1 rounded-md mr-2 text-xs font-bold"/>
                      Student
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth"
                      className="flex px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
                      onClick={closeDropdown}
                    >
                      <RiAdminLine size={30} className="bg-red-100 text-red-600 px-2 py-1 rounded-md mr-2 text-xs font-bold"/>
                      Admin
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;