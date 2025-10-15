"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import logo from "../../public/logo.png";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoMdExit, IoMdMenu, IoMdClose } from "react-icons/io";
import { 
  FiHome, 
  FiUser, 
  FiSettings, 
  FiBook, 
  FiBarChart2,
  FiCalendar,
  FiMessageSquare,
  FiBell,
  FiChevronRight,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight as FiChevronRightIcon
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { logOut } from "@/utils";
import { setActiveUser } from "@/redux/actions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

const SideBar = ({ links, role }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathName = usePathname();
  const activeUser = useSelector((s) => s?.activeUser, shallowEqual);
  const router = useRouter();
  const dispatch = useDispatch();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false);
        setIsOpen(false); // Close sidebar on mobile by default
      } else {
        setIsOpen(true); // Open sidebar on desktop by default
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    if (activeUser) {
      logOut();
      dispatch(setActiveUser(null));
      router.push("/");
    }
  };

  const getIconForLink = (index, title) => {
    const icons = [
      <FiHome className="text-lg" />,
      <FiBook className="text-lg" />,
      <FiBarChart2 className="text-lg" />,
      <FiCalendar className="text-lg" />,
      <FiMessageSquare className="text-lg" />,
      <FiBell className="text-lg" />,
      <FiUser className="text-lg" />,
      <FiSettings className="text-lg" />
    ];
    return icons[index % icons.length];
  };

  const sidebarVariants = {
    open: { 
      x: 0, 
      width: isCollapsed ? 80 : 288,
      transition: { type: "spring", damping: 25, stiffness: 200 } 
    },
    closed: { 
      x: "-100%", 
      transition: { type: "spring", damping: 25, stiffness: 200 } 
    }
  };

  const overlayVariants = {
    open: { opacity: 1, pointerEvents: "auto" },
    closed: { opacity: 0, pointerEvents: "none" }
  };

  const contentVariants = {
    collapsed: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
    expanded: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.1 } }
  };

  // Mobile Bottom Bar Component
  const MobileBottomBar = () => (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200/80 shadow-2xl"
    >
      <div className="flex items-center justify-around px-2 py-3">
        {links?.slice(0, 5).map((link, index) => {
          const isActive = pathName === `/${role}${link?.path}`;
          return (
            <Link
              key={link?.title}
              href={`/${role}${link?.path}`}
              className={`
                flex flex-col items-center justify-center p-2 rounded-2xl
                transition-all duration-300 flex-1 max-w-[20%]
                ${isActive 
                  ? "text-blue-600 bg-blue-50/80" 
                  : "text-gray-600 hover:text-blue-500 hover:bg-gray-50/50"
                }
              `}
            >
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-xl
                transition-all duration-300 mb-1
                ${isActive
                  ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600"
                }
              `}>
                {getIconForLink(index, link?.title)}
              </div>
              <span className="text-xs font-medium truncate max-w-full px-1 text-center">
                {link?.title}
              </span>
            </Link>
          );
        })}
        
        {/* More Menu Item */}
        {links?.length > 5 && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex flex-col items-center justify-center p-2 rounded-2xl text-gray-600 hover:text-blue-500 hover:bg-gray-50/50 transition-all duration-300 flex-1 max-w-[20%]"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 text-gray-600 transition-all duration-300 mb-1">
              <FiChevronRight className="text-lg" />
            </div>
            <span className="text-xs font-medium">More</span>
          </button>
        )}
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Mobile Bottom Bar */}
      <MobileBottomBar />

      {/* Desktop Toggle Button */}
      <div className="hidden lg:block fixed top-6 left-6 z-40">
        <motion.button
          onClick={toggleCollapse}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-3xl backdrop-blur-sm border border-white/10"
        >
          <IoMdMenu className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Overlay for Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Hidden on mobile by default, shown when "More" is clicked */}
      <motion.div
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className={`
          fixed lg:sticky inset-y-0 left-0 z-50 lg:z-40
          bg-gradient-to-b from-slate-900 via-purple-900/80 to-slate-900
          border-r border-blue-700/30
          shadow-2xl backdrop-blur-xl
          flex flex-col h-screen overflow-hidden
          ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
          ${isMobile ? 'w-80' : ''}
        `}
        style={{ 
          width: isMobile ? 320 : (isCollapsed ? 80 : 288)
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-blue-700/30 relative">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Image
                    src={logo}
                    width={24}
                    height={24}
                    alt="Logo"
                    className="brightness-0 invert"
                  />
                </div>
                <AnimatePresence>
                  {(!isCollapsed || isMobile) && (
                    <motion.div
                      variants={contentVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="flex-1 min-w-0"
                    >
                      <h1 className="text-white font-bold text-lg truncate">Student Portal</h1>
                      <p className="text-blue-300 text-xs truncate">Education Platform</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Toggle Button - Only show on desktop when not collapsed */}
              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {!isCollapsed && !isMobile && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={toggleCollapse}
                      className="hidden lg:flex p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                      title="Collapse sidebar"
                    >
                      <FiChevronLeft className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Close button for mobile */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <IoMdClose className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Expand Button when collapsed on desktop */}
            <AnimatePresence>
              {isCollapsed && !isMobile && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={toggleCollapse}
                  className="absolute -right-3 top-1/2 transform -translate-y-1/2 hidden lg:flex w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full items-center justify-center shadow-lg border border-white/20 hover:scale-110 transition-transform duration-200"
                  title="Expand sidebar"
                >
                  <FiChevronRightIcon className="w-3 h-3" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* User Info - Show on mobile and desktop when not collapsed */}
          <AnimatePresence>
            {(!isCollapsed || isMobile) && (
              <motion.div 
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="p-4 border-b border-blue-700/30"
              >
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <FiUser className="text-white text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm font-medium truncate">
                        {activeUser?.name || "User"}
                      </p>
                      <p className="text-blue-300 text-xs truncate">
                        {activeUser?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                  <div className="px-2 py-1 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <p className="text-blue-300 text-xs font-medium capitalize text-center">
                      {role} Account
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Links */}
          <div className="flex-1 p-2 overflow-y-auto invisible-scrollbar">
            <nav className="space-y-1">
              {links?.map((link, index) => {
                const isActive = pathName === `/${role}${link?.path}`;
                return (
                  <motion.div
                    key={link?.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={`/${role}${link?.path}`}
                      onClick={() => isMobile && setIsOpen(false)}
                      className={`
                        group relative flex items-center 
                        text-white/80 hover:text-white 
                        rounded-2xl transition-all duration-300
                        border border-transparent
                        hover:border-white/20 hover:bg-white/10
                        ${isActive 
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-white/30 text-white shadow-lg" 
                          : ""
                        }
                        ${(isCollapsed && !isMobile) ? 'justify-center p-3' : 'p-4 gap-4'}
                      `}
                      title={(isCollapsed && !isMobile) ? link?.title : ""}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r-full"
                        />
                      )}

                      {/* Icon */}
                      <div className={`
                        flex items-center justify-center 
                        rounded-xl transition-all duration-300 flex-shrink-0
                        ${isActive
                          ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
                          : "bg-white/5 group-hover:bg-white/10"
                        }
                        ${(isCollapsed && !isMobile) ? 'w-12 h-12' : 'w-12 h-12'}
                      `}>
                        {getIconForLink(index, link?.title)}
                      </div>

                      {/* Text - Only show when not collapsed or on mobile */}
                      <AnimatePresence>
                        {(!isCollapsed || isMobile) && (
                          <motion.div
                            variants={contentVariants}
                            initial="collapsed"
                            animate="expanded"
                            exit="collapsed"
                            className="flex-1 min-w-0"
                          >
                            <span className="font-semibold text-base group-hover:translate-x-1 transition-transform duration-200 block truncate">
                              {link?.title}
                            </span>
                            <span className="text-white/60 text-xs block truncate">
                              {link?.description || "Manage your content"}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Arrow - Only show when not collapsed or on mobile */}
                      <AnimatePresence>
                        {(!isCollapsed || isMobile) && (
                          <motion.div
                            initial={false}
                            animate={{ rotate: isActive ? 0 : -90 }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <FiChevronRight className="w-4 h-4 text-white/60" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </div>

          {/* Logout Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 border-t border-blue-700/30"
          >
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center 
                text-white/80 hover:text-white 
                bg-white/5 hover:bg-red-500/20 
                border border-white/10 hover:border-red-500/30
                rounded-2xl transition-all duration-300
                hover:shadow-lg group
                ${(isCollapsed && !isMobile) ? 'justify-center p-3' : 'p-4 gap-3'}
              `}
              title={(isCollapsed && !isMobile) ? "Logout" : ""}
            >
              <div className={`
                rounded-xl flex items-center justify-center group-hover:bg-red-500/30 transition-colors duration-300 flex-shrink-0
                ${(isCollapsed && !isMobile) ? 'w-12 h-12 bg-red-500/20' : 'w-10 h-10 bg-red-500/20'}
              `}>
                <FiLogOut className={`text-red-400 group-hover:text-red-300 ${(isCollapsed && !isMobile) ? 'text-lg' : 'text-lg'}`} />
              </div>
              
              <AnimatePresence>
                {(!isCollapsed || isMobile) && (
                  <motion.span
                    variants={contentVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="font-semibold text-lg flex-1 text-left"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {(!isCollapsed || isMobile) && (
                  <motion.div
                    variants={contentVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                  >
                    <IoMdExit className="text-red-400 group-hover:text-red-300 text-xl" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Version Info - Only show when not collapsed or on mobile */}
            <AnimatePresence>
              {(!isCollapsed || isMobile) && (
                <motion.div
                  variants={contentVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="mt-4 text-center"
                >
                  <p className="text-white/40 text-xs">Student Portal v1.0</p>
                  <p className="text-white/30 text-xs">© 2024 All rights reserved</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default SideBar;