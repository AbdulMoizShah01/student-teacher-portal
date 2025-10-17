"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import logo from "../../public/logo.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PiStudentBold } from "react-icons/pi";
import { RiAdminLine } from "react-icons/ri";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUser, 
  FiLogIn, 
  FiChevronDown,
  FiHome,
  FiBook,
  FiAward
} from "react-icons/fi";

const Header = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsHovered(false);
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
    setIsHovered(false);
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    }
  };

  return (
    <motion.div 
      className={`sticky top-0 left-0 right-0 w-full flex items-center justify-between transition-all duration-500 z-50 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-xl shadow-2xl border-b border-blue-100/50 px-4 py-2" 
          : "bg-gradient-to-r from-blue-600/95 to-purple-600/95 backdrop-blur-lg shadow-lg border-b-4 border-blue-400/30 px-6 py-4"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      
      {/* Logo Section */}
      <motion.div 
        className="flex items-center gap-3"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Image 
          src={logo} 
          width={isScrolled ? 45 : 50}
          height={isScrolled ? 45 : 50}
          alt="Logo" 
          className={`transition-all duration-500 cursor-pointer ${
            isScrolled ? "brightness-100" : "brightness-0 invert"
          }`}
          onClick={() => navigateTo("/")}
        />
        <div className={`font-bold tracking-tight transition-all duration-500 ${
          isScrolled 
            ? "text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl" 
            : "text-white text-xl"
        } hidden sm:block`}>
          EduPortal
        </div>
      </motion.div>

 
      {/* Login Dropdown */}
      <div className="flex items-center gap-4" ref={dropdownRef}>
        <div className="py-2">
          <div className="relative inline-block">
            <motion.button
              type="button"
              className={`px-6 py-3 font-semibold rounded-2xl text-base inline-flex items-center transition-all duration-500 shadow-2xl transform group ${
                isScrolled
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                  : "bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 hover:border-white/50"
              }`}
              onClick={toggleDropdown}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <FiLogIn className="text-lg mr-2 group-hover:scale-110 transition-transform duration-300" />
              <span className="whitespace-nowrap">Get Started</span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : isHovered ? 90 : 0 }}
                transition={{ duration: 0.3 }}
                className="ml-2"
              >
                <FiChevronDown className="text-lg" />
              </motion.div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl bg-white/95 backdrop-blur-xl border border-white/20 overflow-hidden"
                >
                  <div className="relative">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                          <FiUser className="text-xl" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">Welcome!</h3>
                          <p className="text-blue-100 text-sm">Choose your role to continue</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Options List */}
                    <ul className="p-2">
                      {/* Teacher Option */}
                      <motion.li variants={itemVariants} className="group">
                        <Link
                          href={`/auth?role=teacher`}
                          className="flex items-center px-4 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/50 rounded-xl transition-all duration-300 group-hover:translate-x-2 border-l-4 border-transparent group-hover:border-blue-500"
                          onClick={closeDropdown}
                        >
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              <LiaChalkboardTeacherSolid className="text-white text-xl" />
                            </div>
                            {/* Hover effect */}
                            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          <div className="flex-1">
                            <span className="font-bold text-gray-800 block">Teacher</span>
                            <span className="text-sm text-gray-600">Manage classes & quizzes</span>
                          </div>
                          <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            whileHover={{ x: 0, opacity: 1 }}
                            className="text-blue-500 transition-all duration-300"
                          >
                            <FiChevronDown className="transform -rotate-90" />
                          </motion.div>
                        </Link>
                      </motion.li>

                      {/* Student Option */}
                      <motion.li variants={itemVariants} className="group">
                        <Link
                          href={`/auth?role=student`}
                          className="flex items-center px-4 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100/50 rounded-xl transition-all duration-300 group-hover:translate-x-2 border-l-4 border-transparent group-hover:border-green-500"
                          onClick={closeDropdown}
                        >
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              <PiStudentBold className="text-white text-xl" />
                            </div>
                            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          <div className="flex-1">
                            <span className="font-bold text-gray-800 block">Student</span>
                            <span className="text-sm text-gray-600">Access courses & learn</span>
                          </div>
                          <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            whileHover={{ x: 0, opacity: 1 }}
                            className="text-green-500 transition-all duration-300"
                          >
                            <FiChevronDown className="transform -rotate-90" />
                          </motion.div>
                        </Link>
                      </motion.li>

                      {/* Admin Option */}
                      <motion.li variants={itemVariants} className="group">
                        <Link
                          href="/auth"
                          className="flex items-center px-4 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100/50 rounded-xl transition-all duration-300 group-hover:translate-x-2 border-l-4 border-transparent group-hover:border-purple-500"
                          onClick={closeDropdown}
                        >
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              <RiAdminLine className="text-white text-xl" />
                            </div>
                            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          <div className="flex-1">
                            <span className="font-bold text-gray-800 block">Administrator</span>
                            <span className="text-sm text-gray-600">Manage system & users</span>
                          </div>
                          <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            whileHover={{ x: 0, opacity: 1 }}
                            className="text-purple-500 transition-all duration-300"
                          >
                            <FiChevronDown className="transform -rotate-90" />
                          </motion.div>
                        </Link>
                      </motion.li>
                    </ul>

                    {/* Footer */}
                    <div className="border-t border-gray-100 p-3 bg-gray-50/50">
                      <p className="text-center text-xs text-gray-500">
                        New to EduPortal?{" "}
                        <span className="text-blue-600 font-semibold">Learn more</span>
                      </p>
                    </div>

                    {/* Dropdown arrow */}
                    <div className="absolute -top-2 right-6 w-4 h-4 bg-white/95 backdrop-blur-xl transform rotate-45 border-t border-l border-white/20"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile menu button */}
        <motion.button 
          className="md:hidden w-12 h-12 flex flex-col items-center justify-center space-y-1.5 group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
          onClick={toggleDropdown}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span 
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? 'rotate-45 translate-y-2' : ''
            }`}
            animate={{ backgroundColor: isScrolled ? '#4F46E5' : '#FFFFFF' }}
          ></motion.span>
          <motion.span 
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? 'opacity-0' : 'opacity-100'
            }`}
            animate={{ backgroundColor: isScrolled ? '#4F46E5' : '#FFFFFF' }}
          ></motion.span>
          <motion.span 
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
            animate={{ backgroundColor: isScrolled ? '#4F46E5' : '#FFFFFF' }}
          ></motion.span>
        </motion.button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-white/20 md:hidden shadow-2xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-4 space-y-2">
       

              {/* Login Options for Mobile */}
              <div className="space-y-2 border-t border-gray-100 pt-4">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-2 mb-2">
                  Login As
                </h4>
                {[
                  { name: "Teacher", icon: LiaChalkboardTeacherSolid, color: "blue", path: "/auth?role=teacher" },
                  { name: "Student", icon: PiStudentBold, color: "green", path: "/auth?role=student" },
                  { name: "Admin", icon: RiAdminLine, color: "purple", path: "/auth" },
                ].map((item) => (
                  <motion.div
                    key={item.name}
                    whileHover={{ x: 5 }}
                    whileTap={{ x: 0 }}
                  >
                    <Link
                      href={item.path}
                      className={`flex items-center px-4 py-3 text-gray-700 hover:bg-${item.color}-50 rounded-xl transition-colors duration-200 border-l-4 border-${item.color}-500`}
                      onClick={closeDropdown}
                    >
                      <item.icon className={`text-${item.color}-600 mr-3 text-xl`} />
                      <span className="font-semibold">{item.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Header;