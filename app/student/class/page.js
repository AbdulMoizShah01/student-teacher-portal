"use client";

import { shallowEqual, useSelector } from "react-redux";
import { useClasses } from "@/hooks/useClasses";
import { useCourses } from "@/hooks/useCourses";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUsers,
  FiBook,
  FiCalendar,
  FiUser,
  FiBarChart2,
  FiBookOpen,
  FiClock,
  FiAward
} from "react-icons/fi";

const Page = () => {
  const currentUser = useSelector((s) => s?.activeUser, shallowEqual);
  const { classes, loading: classesLoading } = useClasses();
  const { courses, loading: coursesLoading } = useCourses();

  // Find the class where current student is enrolled
const studentClass = classes?.find(
  (cls) =>
    Array.isArray(cls?.students) &&
    cls.students.some((student) => student?._id === currentUser?._id)
); 
  console.log("student Class....................", studentClass)

  // Get courses for this class
  const classCourses = courses?.filter((course) =>
    Array.isArray(studentClass?.courses) && studentClass?.courses.includes(course?._id)
  );

  // Calculate statistics
  const stats = {
    totalCourses: classCourses?.length || 0,
    totalStudents: studentClass?.students?.length || 0,
    totalTeachers: new Set(classCourses?.flatMap(course => course?.teachers || [])).size || 0
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
            Loading your class information...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!studentClass) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <FiUsers className="text-white text-xl" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            No Class Assigned
          </h3>
          <p className="text-gray-600 mb-2">
            You are not currently enrolled in any class.
          </p>
          <p className="text-gray-500 text-sm">
            Please contact your administrator to get assigned to a class.
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
                  My Class
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  View your class information, courses, and peers
                </p>
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
                    <p className="text-2xl font-bold text-gray-800">{stats.totalCourses}</p>
                    <p className="text-gray-600 text-sm">Total Courses</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <FiUsers className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
                    <p className="text-gray-600 text-sm">Classmates</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <FiUser className="text-yellow-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalTeachers}</p>
                    <p className="text-gray-600 text-sm">Teachers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Class Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-2xl mb-8"
        >
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <FiBookOpen className="text-white text-2xl" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{studentClass?.name}</h2>
                  <p className="text-gray-600 text-lg">{studentClass?.description || "Your assigned class for this academic period"}</p>
                </div>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold border border-green-200">
                  Active
                </div>
              </div>
              
              {/* Class Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              
                
                <div className="flex items-center gap-3 p-4 bg-purple-50/80 rounded-2xl border border-purple-200/50">
                  <FiBarChart2 className="text-purple-600 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600">Class Code</p>
                    <p className="font-semibold text-gray-800 font-mono">{studentClass?._id?.slice(-8)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-green-50/80 rounded-2xl border border-green-200/50">
                  <FiAward className="text-green-600 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600">Your Role</p>
                    <p className="font-semibold text-gray-800">Student</p>
                  </div>
                </div>
                
         
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Courses Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FiBook className="text-white text-lg" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Class Courses</h2>
            </div>

            {classCourses?.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiBook className="text-gray-400 text-2xl" />
                </div>
                <p className="text-gray-500">No courses assigned to this class yet.</p>
                <p className="text-gray-400 text-sm mt-1">Courses will appear here when assigned by teachers.</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {classCourses?.map((course, index) => (
                  <motion.div
                    key={course?._id}
                    variants={cardVariants}
                    whileHover="hover"
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200/50 hover:border-blue-300/50 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <FiBookOpen className="text-white text-lg" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg group-hover:text-gray-900 transition-colors">
                          {course?.name || course?.title || "Unnamed Course"}
                        </h3>
                 
                        {course?._id && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
                              Code: {course?._id}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
       
        </div>
      </motion.div>
    </div>
  );
};

export default Page;