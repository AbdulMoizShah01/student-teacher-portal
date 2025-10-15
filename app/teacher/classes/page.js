"use client";

import { shallowEqual, useSelector } from "react-redux";
import { useClasses } from "@/hooks/useClasses";
import { useCourses } from "@/hooks/useCourses";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUsers,
  FiBook,
  FiUser,
  FiBarChart2,
  FiBookOpen,
  FiFolder
} from "react-icons/fi";

const Page = () => {
  const currentUser = useSelector((s) => s?.activeUser, shallowEqual);
  const { classes, loading: classesLoading } = useClasses();
  const { courses, loading: coursesLoading } = useCourses();

  // Build a set of course IDs assigned to this teacher from courses state
  const myCourseIds = new Set(
    (courses || [])
      .filter((c) => Array.isArray(c?.teachers) && c.teachers.includes(currentUser?._id))
      .map((c) => c?._id)
  );

  // A class is visible if it contains any course from myCourseIds
  const myClasses = (classes || []).filter((cls) =>
    Array.isArray(cls?.courses) && cls.courses.some((courseId) => myCourseIds.has(courseId))
  );

  // Calculate statistics
  const stats = {
    totalClasses: myClasses.length,
    totalStudents: myClasses.reduce((sum, cls) => sum + (cls?.students?.length || 0), 0),
    totalCourses: myCourseIds.size,
    activeClasses: myClasses.filter(cls => cls?.students?.length > 0).length
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
      y: -4,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  if (classesLoading || coursesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FiUsers className="text-white text-2xl" />
          </div>
          <p className="text-xl font-semibold text-gray-800 animate-pulse">
            Loading your classes...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FiUsers className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  My Classes
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Manage and view your assigned classes and students
                </p>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiFolder className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalClasses}</p>
                    <p className="text-gray-600 text-sm">Total Classes</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <FiUser className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
                    <p className="text-gray-600 text-sm">Total Students</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <FiBook className="text-yellow-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalCourses}</p>
                    <p className="text-gray-600 text-sm">My Courses</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FiBarChart2 className="text-purple-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.activeClasses}</p>
                    <p className="text-gray-600 text-sm">Active Classes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        {myClasses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-blue-200/50 shadow-xl"
          >
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FiUsers className="text-white text-3xl" />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-800 mb-3">
                No Classes Assigned
              </h3>
              <p className="text-gray-600 text-lg mb-8 max-w-sm mx-auto leading-relaxed">
                You haven't been assigned to any classes yet. Contact your administrator to get started.
              </p>
              
              <div className="flex items-center justify-center gap-4 text-gray-500">
                <div className="flex items-center gap-2">
                  <FiBookOpen className="w-5 h-5" />
                  <span>Waiting for class assignments</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {myClasses.map((cls, index) => (
                <motion.div
                  key={cls?._id}
                  variants={cardVariants}
                  whileHover="hover"
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden group cursor-pointer flex flex-col h-full"
                >
                  <div className="p-6 flex flex-col flex-1">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4 min-h-[80px]">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 mt-1">
                        <FiFolder className="text-white text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-2 flex-1">
                            {cls?.name || "Unnamed Class"}
                          </h3>
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
                            cls?.students?.length > 0
                              ? "bg-green-100 text-green-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {cls?.students?.length > 0 ? "Active" : "No Students"}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                          {cls?.description || "Class managed by you"}
                        </p>
                      </div>
                    </div>

                    {/* Class Info */}
                    <div className="space-y-3 mb-4 flex-1">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center gap-2 whitespace-nowrap">
                          <FiBook className="w-4 h-4 flex-shrink-0" />
                          {cls?.courses?.length || 0} Courses
                        </span>
                        <span className="flex items-center gap-2 whitespace-nowrap">
                          <FiUser className="w-4 h-4 flex-shrink-0" />
                          {cls?.students?.length || 0} Students
                        </span>
                      </div>
                
                    </div>

                   

                    {/* Class Details */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200/50">
                      <span className="font-mono">ID: {cls?._id?.slice(-8)}</span>
                      <span className={`text-xs font-medium ${
                        cls?.students?.length > 0 ? "text-green-600" : "text-blue-600"
                      }`}>
                        {cls?.students?.length > 0 ? "Active" : "Setup Required"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Page;