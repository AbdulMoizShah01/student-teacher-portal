"use client";

import { shallowEqual, useSelector } from "react-redux";
import { useClasses } from "@/hooks/useClasses";
import { useCourses } from "@/hooks/useCourses";
import { getDocsByKeyValue } from "@/utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUsers, 
  FiUserCheck, 
  FiUserX, 
  FiCalendar,
  FiBook,
  FiBarChart2,
  FiClock,
  FiArrowRight,
  FiRefreshCw
} from "react-icons/fi";
import { Loader2 } from "lucide-react";

const AttendancePage = () => {
  const currentUser = useSelector((s) => s?.activeUser, shallowEqual);
  const { classes } = useClasses();
  const { courses } = useCourses();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedClass, setExpandedClass] = useState(null);
  const today = new Date().toISOString().slice(0, 10);
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const myCourseIds = new Set(
    (courses || [])
      .filter((c) => Array.isArray(c?.teachers) && c.teachers.includes(currentUser?._id))
      .map((c) => c?._id)
  );
  
  const myClasses = (classes || []).filter((cls) =>
    Array.isArray(cls?.courses) && cls.courses.some((cid) => myCourseIds.has(cid))
  );

  useEffect(() => {
    fetchAttendance();
  }, [today]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const all = await getDocsByKeyValue("attendance", "date", today);
      setRecords(all || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAttendance = async () => {
    setRefreshing(true);
    await fetchAttendance();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const grouped = myClasses.reduce((acc, cls) => {
    const classRecords = records.filter((r) => r.classId === cls._id);
    const presentStudents = classRecords.filter(record => record.status === 'present');
    const absentStudents = classRecords.filter(record => record.status === 'absent');
    
    acc[cls._id] = {
      records: classRecords,
      present: presentStudents.length,
      absent: absentStudents.length,
      total: cls.students?.length || 0,
      attendanceRate: cls.students?.length ? 
        Math.round((presentStudents.length / cls.students.length) * 100) : 0
    };
    return acc;
  }, {});

  const getAttendanceColor = (rate) => {
    if (rate >= 80) return "text-green-600";
    if (rate >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getAttendanceBgColor = (rate) => {
    if (rate >= 80) return "bg-green-500";
    if (rate >= 60) return "bg-yellow-500";
    return "bg-red-500";
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

  const expandVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Loader2 className="animate-spin w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Attendance</h3>
          <p className="text-gray-600">Fetching today's attendance records...</p>
        </motion.div>
      </div>
    );
  }

  const totalPresent = Object.values(grouped).reduce((sum, classData) => sum + classData.present, 0);
  const totalStudents = Object.values(grouped).reduce((sum, classData) => sum + classData.total, 0);
  const overallRate = totalStudents ? Math.round((totalPresent / totalStudents) * 100) : 0;

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
                  Today's Attendance
                </h1>
                <p className="text-gray-600 mt-2 text-lg flex items-center gap-2">
                  <FiCalendar className="w-5 h-5" />
                  {formattedDate}
                </p>
              </div>
            </div>
            
            {/* Overall Stats */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiUsers className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{myClasses.length}</p>
                    <p className="text-gray-600 text-sm">Classes</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <FiUserCheck className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{totalPresent}</p>
                    <p className="text-gray-600 text-sm">Present</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <FiUserX className="text-red-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{totalStudents - totalPresent}</p>
                    <p className="text-gray-600 text-sm">Absent</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FiBarChart2 className="text-purple-600 text-lg" />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${getAttendanceColor(overallRate)}`}>
                      {overallRate}%
                    </p>
                    <p className="text-gray-600 text-sm">Overall</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshAttendance}
            disabled={refreshing}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transform shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
          >
            {refreshing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <FiRefreshCw className="text-lg" />
            )}
            Refresh
          </motion.button>
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
                  <FiBook className="text-white text-3xl" />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-800 mb-3">
                No Classes Assigned
              </h3>
              <p className="text-gray-600 text-lg mb-8 max-w-sm mx-auto leading-relaxed">
                You are not assigned to any classes with courses. Contact your administrator to get assigned to classes.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {myClasses.map((cls) => {
              const classData = grouped[cls._id] || { records: [], present: 0, absent: 0, total: 0, attendanceRate: 0 };
              const isExpanded = expandedClass === cls._id;

              return (
                <motion.div
                  key={cls._id}
                  variants={cardVariants}
                  whileHover="hover"
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden group cursor-pointer"
                >
                  {/* Class Header */}
                  <div 
                    className="p-6 border-b border-gray-200/50"
                    onClick={() => setExpandedClass(isExpanded ? null : cls._id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <FiBook className="text-white text-lg" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-800 text-lg truncate">
                              {cls.name}
                            </h3>
                            <p className="text-gray-600 text-sm truncate">
                              {cls.students?.length || 0} students
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Attendance Rate Badge */}
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        classData.attendanceRate >= 80 
                          ? "bg-green-100 text-green-800" 
                          : classData.attendanceRate >= 60
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {classData.attendanceRate}%
                      </div>
                    </div>

                    {/* Attendance Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-green-600">
                          <FiUserCheck className="w-4 h-4" />
                          {classData.present} present
                        </span>
                        <span className="flex items-center gap-1 text-red-600">
                          <FiUserX className="w-4 h-4" />
                          {classData.absent} absent
                        </span>
                      </div>
                      
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FiArrowRight className="w-5 h-5" />
                      </motion.div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Attendance Rate</span>
                        <span>{classData.attendanceRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${classData.attendanceRate}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`h-2 rounded-full ${getAttendanceBgColor(classData.attendanceRate)}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expandable Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        variants={expandVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="border-t border-gray-200/50"
                      >
                        <div className="p-6 space-y-4">
                          {/* Present Students */}
                          <div>
                            <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                              <FiUserCheck className="text-green-600" />
                              Present Students ({classData.present})
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {classData.records
                                .filter(record => record.status === 'present')
                                .map((record, index) => (
                                  <motion.div
                                    key={record.id || index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200"
                                  >
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                      <FiUserCheck className="text-white w-3 h-3" />
                                    </div>
                                    <span className="text-sm text-gray-700 truncate">
                                      {record.studentName || `Student ${index + 1}`}
                                    </span>
                                  </motion.div>
                                ))}
                              
                              {classData.present === 0 && (
                                <div className="col-span-2 text-center py-4 text-gray-500">
                                  No students marked present today
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Absent Students */}
                          <div>
                            <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                              <FiUserX className="text-red-600" />
                              Absent Students ({classData.absent})
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {classData.records
                                .filter(record => record.status === 'absent')
                                .map((record, index) => (
                                  <motion.div
                                    key={record.id || index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200"
                                  >
                                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                      <FiUserX className="text-white w-3 h-3" />
                                    </div>
                                    <span className="text-sm text-gray-700 truncate">
                                      {record.studentName || `Student ${index + 1}`}
                                    </span>
                                  </motion.div>
                                ))}
                              
                              {classData.absent === 0 && (
                                <div className="col-span-2 text-center py-4 text-gray-500">
                                  No students marked absent today
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Last Updated */}
                          {classData.records.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200"
                            >
                              <span className="flex items-center gap-1">
                                <FiClock className="w-3 h-3" />
                                Last updated today
                              </span>
                              <span>
                                {classData.present}/{classData.total} students
                              </span>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AttendancePage;