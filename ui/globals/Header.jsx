"use client";
import React, { useState, useEffect, useRef } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className={`sticky top-0 left-0 right-0 w-full flex items-center justify-between transition-all duration-300 z-50 ${
      isScrolled 
        ? "bg-gradient-to-r from-blue-700/95 to-indigo-800/95 backdrop-blur-xl shadow-2xl border-b border-blue-300/30 px-4 py-2" 
        : "bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg border-b-4 border-blue-400 px-6 py-3"
    }`}>
      
      {/* Logo Section */}
      <div className="flex items-center">
        <Image 
          src={logo} 
          width={isScrolled ? 120 : 160}
          height={isScrolled ? 45 : 60}
          alt="Logo" 
          className="brightness-0 invert transition-all duration-300 hover:scale-105 cursor-pointer"
          onClick={() => navigateTo("/")}
        />
      </div>

      {/* Title Section - Hidden on small screens */}
      <div className={`font-bold text-white tracking-tight bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
        isScrolled ? "text-xl" : "text-2xl"
      } hidden sm:block`}>
        Student Portal
      </div>

      {/* Login Dropdown */}
      <div className="flex items-center gap-4" ref={dropdownRef}>
        <div className="py-2">
          <div className="relative inline-block">
            <button
              type="button"
              className="px-4 sm:px-6 py-2 sm:py-3 text-white bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-blue-300/50 font-semibold rounded-xl text-sm sm:text-base inline-flex items-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 group"
              onClick={toggleDropdown}
            >
              <span className="whitespace-nowrap">Log-in as</span>
              <svg
                className={`w-3 h-3 ml-2 sm:ml-3 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : 'group-hover:rotate-90'
                }`}
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

            {/* Dropdown Menu */}
            <div className={`absolute right-0 mt-3 w-48 sm:w-56 rounded-xl shadow-2xl bg-white/95 backdrop-blur-xl border border-white/20 overflow-hidden transition-all duration-300 transform origin-top-right ${
              isOpen 
                ? "scale-100 opacity-100 translate-y-0" 
                : "scale-95 opacity-0 -translate-y-2 pointer-events-none"
            }`}>
              <div className="relative">
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5"></div>
                
                <ul className="relative">
                  {/* Teacher Option */}
                  <li className="border-b border-gray-100/50 last:border-b-0 group">
                    <Link
                      href={`/auth?role=teacher`}
                      className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 transition-all duration-200 group-hover:translate-x-1"
                      onClick={closeDropdown}
                    >
                      <div className="relative">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                          <LiaChalkboardTeacherSolid className="text-blue-600 text-lg" />
                        </div>
                      </div>
                      <span className="font-semibold">Teacher</span>
                    </Link>
                  </li>

                  {/* Student Option */}
                  <li className="border-b border-gray-100/50 last:border-b-0 group">
                    <Link
                      href={`/auth?role=student`}
                      className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50/80 hover:text-green-600 transition-all duration-200 group-hover:translate-x-1"
                      onClick={closeDropdown}
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                        <PiStudentBold className="text-green-600 text-lg" />
                      </div>
                      <span className="font-semibold">Student</span>
                    </Link>
                  </li>

                  {/* Admin Option */}
                  <li className="group">
                    <Link
                      href="/auth"
                      className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50/80 hover:text-red-600 transition-all duration-200 group-hover:translate-x-1"
                      onClick={closeDropdown}
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                        <RiAdminLine className="text-red-600 text-lg" />
                      </div>
                      <span className="font-semibold">Admin</span>
                    </Link>
                  </li>
                </ul>

                {/* Dropdown arrow */}
                <div className="absolute -top-2 right-4 w-4 h-4 bg-white/95 backdrop-blur-xl transform rotate-45 border-t border-l border-white/20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu button (optional enhancement) */}
        <button 
          className="sm:hidden w-10 h-10 flex flex-col items-center justify-center space-y-1 group"
          onClick={toggleDropdown}
        >
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isOpen ? 'rotate-45 translate-y-1.5' : ''
          }`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isOpen ? '-rotate-45 -translate-y-1.5' : ''
          }`}></span>
        </button>
      </div>

      {/* Mobile Dropdown (simplified for small screens) */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-white/20 sm:hidden">
          <div className="px-4 py-2 space-y-1">
            <Link
              href={`/auth?role=teacher`}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              onClick={closeDropdown}
            >
              <LiaChalkboardTeacherSolid className="text-blue-600 mr-3 text-xl" />
              <span className="font-semibold">Teacher Login</span>
            </Link>
            <Link
              href={`/auth?role=student`}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
              onClick={closeDropdown}
            >
              <PiStudentBold className="text-green-600 mr-3 text-xl" />
              <span className="font-semibold">Student Login</span>
            </Link>
            <Link
              href="/auth"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
              onClick={closeDropdown}
            >
              <RiAdminLine className="text-red-600 mr-3 text-xl" />
              <span className="font-semibold">Admin Login</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;