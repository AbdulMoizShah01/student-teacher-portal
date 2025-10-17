"use client";
import { useRouter } from "next/navigation";
import { useClasses } from "@/hooks/useClasses";
import { Loader2 } from "lucide-react";
import { roleBasedUrl } from "@/config";
import { MdOutlineDeleteForever } from "react-icons/md";
import { FiEdit, FiUsers, FiBook, FiArrowRight, FiPlus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const ClassCard = () => {
  const { classes, removeClass } = useClasses();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (classItem, index) => {
    setDeletingId(classItem?._id);
    await removeClass(classItem, index);
    setDeletingId(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FiBook className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Class Management
                </h1>
                <p className="text-gray-600 mt-2 text-lg">Create and manage your educational classes</p>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiBook className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{classes?.length || 0}</p>
                    <p className="text-gray-600 text-sm">Total Classes</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <FiUsers className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {classes?.reduce((total, cls) => total + (cls?.students?.length || 0), 0) || 0}
                    </p>
                    <p className="text-gray-600 text-sm">Total Students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/admin/classes/add")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transform shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3 group whitespace-nowrap"
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FiPlus className="text-white text-lg" />
            </div>
            <span className="text-lg">Add New Class</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Classes Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        <AnimatePresence>
          {classes && classes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {classes.map((classItem, index) => (
                <motion.div
                  key={classItem?._id || index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  onClick={() => router.push(roleBasedUrl(`/classes/${classItem?._id}`))}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 hover:border-white/40 overflow-hidden group cursor-pointer relative"
                >
                  {/* Background Gradient Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-800 truncate group-hover:text-gray-900 transition-colors duration-300">
                          {classItem?.name || "Unnamed Class"}
                        </h3>
                        <p className="text-blue-600 text-sm font-medium mt-1">
                          ID: {classItem?._id?.slice(0, 8)}...
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg ml-3 flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-white/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FiBook className="text-blue-600 text-sm" />
                          </div>
                          <span className="text-gray-700 font-medium text-sm">Courses</span>
                        </div>
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold min-w-[40px] text-center">
                          {classItem?.courses?.length || 0}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-white/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <FiUsers className="text-green-600 text-sm" />
                          </div>
                          <span className="text-gray-700 font-medium text-sm">Students</span>
                        </div>
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold min-w-[40px] text-center">
                          {classItem?.students?.length || 0}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div 
                      onClick={(e) => e.stopPropagation()} 
                      className="flex items-center justify-between pt-4 border-t border-gray-200/50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                          Active
                        </span>
                        <span className="text-gray-500 text-xs">
                          Last updated
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(classItem, index)}
                          disabled={deletingId === classItem?._id}
                          className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === classItem?._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <MdOutlineDeleteForever size={18} />
                          )}
                        </motion.button>
                        
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => router.push(`/admin/classes/edit?id=${classItem?._id}`)}
                          className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                        >
                          <FiEdit size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </div>

            
                </motion.div>
              ))}
            </div>
          ) : (
            // Empty State
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20 bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-blue-200/50 shadow-xl"
            >
              <div className="max-w-md mx-auto">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <FiBook className="text-white text-3xl" />
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-800 mb-3">
                  No Classes Yet
                </h3>
                <p className="text-gray-600 text-lg mb-8 max-w-sm mx-auto leading-relaxed">
                  Start building your educational environment by creating your first class
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/admin/classes/add")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-10 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transform shadow-2xl hover:shadow-3xl transition-all duration-300 inline-flex items-center gap-3 text-lg"
                >
                  <FiPlus className="text-xl" />
                  Create Your First Class
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ClassCard;