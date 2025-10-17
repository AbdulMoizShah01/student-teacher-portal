"use client";

import { useClasses } from "@/hooks/useClasses";
import { useCourses } from "@/hooks/useCourses";
import { getItemsbyKey } from "@/utils";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FiBook, 
  FiUsers, 
  FiCalendar,
  FiAward,
  FiBookOpen,
  FiUser,
  FiArrowLeft
} from "react-icons/fi";
import { useRouter } from "next/navigation";

const ClassDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { classes } = useClasses();
  const { courses } = useCourses();
  
  const state = classes?.find((item) => item?._id === id);
  const coursesArray = getItemsbyKey(state?.courses ?? [], courses ?? []);
  const teachersArray = getItemsbyKey(state?.teachers ?? [], []);

  // Animation variants
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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

  if (!state) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <FiBook className="text-white text-xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Class Not Found</h3>
          <p className="text-gray-600">The class you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
            >
              <FiArrowLeft className="text-gray-700 text-xl" />
            </motion.button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Class Details
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Detailed information about {state?.name}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-gray-600 text-sm">Courses</div>
              <div className="text-2xl font-bold text-gray-800">{coursesArray?.length || 0}</div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FiBook className="text-white text-xl" />
            </div>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Class Information Card */}
          <motion.div
            variants={cardVariants}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <FiBook className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Class Information</h2>
                  <p className="text-blue-100">General details about the class</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Class Name */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FiBook className="text-blue-600 text-lg" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Class Name</p>
                      <p className="text-lg font-bold text-gray-800">{state?.name || "Unnamed Class"}</p>
                    </div>
                  </div>
                </div>

                {/* Student Count */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <FiUsers className="text-green-600 text-lg" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Students</p>
                      <p className="text-lg font-bold text-gray-800">{state?.students?.length || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Courses Count */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <FiBookOpen className="text-purple-600 text-lg" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Courses</p>
                      <p className="text-lg font-bold text-gray-800">{coursesArray?.length || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Teachers Count */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <FiUser className="text-orange-600 text-lg" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Teachers</p>
                      <p className="text-lg font-bold text-gray-800">{teachersArray?.length || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Courses Section */}
          <motion.div
            variants={cardVariants}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <FiBookOpen className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Associated Courses</h2>
                    <p className="text-green-100">Courses taught in this class</p>
                  </div>
                </div>
                <div className="bg-white/20 rounded-2xl px-4 py-2 backdrop-blur-sm">
                  <span className="font-semibold">{coursesArray?.length || 0} Courses</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {coursesArray && coursesArray.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {coursesArray.map((course, index) => (
                    <motion.div
                      key={course?._id}
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-2xl border-2 border-gray-200 hover:border-green-300 transition-all duration-200 shadow-lg overflow-hidden group cursor-pointer"
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-800 truncate group-hover:text-gray-900 transition-colors duration-300">
                              {course?.name || "Untitled Course"}
                            </h3>
                            <p className="text-green-600 text-sm font-medium mt-1 flex items-center gap-1">
                              <FiBook className="w-3 h-3" />
                              Course
                            </p>
                          </div>
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg ml-2 flex-shrink-0">
                            <span className="text-white font-bold text-xs">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>
                        </div>

              

              
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                          <FiBookOpen className="text-white text-xs" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <FiBookOpen className="text-white w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    No Courses Assigned
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    This class doesn't have any courses assigned yet. Courses will appear here once they are added to the class.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ClassDetailPage;