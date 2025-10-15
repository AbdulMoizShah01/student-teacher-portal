"use client";

import { shallowEqual, useSelector } from "react-redux";
import { useClasses } from "@/hooks/useClasses";
import { saveData, getDocsByKeyValue } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiCalendar, 
  FiCheck, 
  FiClock, 
  FiUserCheck,
  FiBook,
  FiAward,
  FiBarChart2,
  FiCheckCircle,
  FiXCircle,
  FiTrendingUp
} from "react-icons/fi";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const StudentAttendancePage = () => {
  const currentUser = useSelector((s) => s?.activeUser, shallowEqual);
  const { classes } = useClasses();
  const [saving, setSaving] = useState(false);
  const [savingClassId, setSavingClassId] = useState(null);
  const [myRecords, setMyRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10);
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const myClasses = useMemo(() => {
    return (classes || []).filter((c) => {
      const arr = Array.isArray(c?.students) ? c.students : [];
      return arr.some((s) => (typeof s === "string" ? s === currentUser?._id : s?._id === currentUser?._id));
    });
  }, [classes, currentUser?._id]);

  useEffect(() => {
    (async () => {
      if (!currentUser?._id) return;
      setLoading(true);
      try {
        const recs = await getDocsByKeyValue("attendance", "studentId", currentUser._id);
        setMyRecords(recs || []);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser?._id]);

  const alreadyMarkedToday = useMemo(() => {
    const set = new Set(
      (myRecords || []).filter((r) => r?.date === today).map((r) => r?.classId)
    );
    return set;
  }, [myRecords, today]);

  const markAttendance = async (classId, className) => {
    try {
      setSaving(true);
      setSavingClassId(classId);
      const record = {
        _id: `${classId}-${currentUser?._id}-${today}`,
        classId,
        studentId: currentUser?._id,
        studentName: currentUser?.name,
        date: today,
        status: "present",
        timestamp: new Date().toISOString()
      };
      await saveData("attendance", record);
      
      // Update local state
      setMyRecords(prev => [...prev, record]);
      
      toast.success(`Attendance marked for ${className} ✅`, {
        theme: "colored",
      });
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error("Failed to mark attendance", {
        theme: "colored",
      });
    } finally {
      setSaving(false);
      setSavingClassId(null);
    }
  };

  const getAttendanceStats = () => {
    const totalRecords = myRecords.length;
    const presentCount = myRecords.filter(r => r.status === 'present').length;
    const attendanceRate = totalRecords ? Math.round((presentCount / totalRecords) * 100) : 0;
    
    return { totalRecords, presentCount, attendanceRate };
  };

  const getRecentAttendance = () => {
    return myRecords
      .slice()
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, 10);
  };

  const stats = getAttendanceStats();
  const recentAttendance = getRecentAttendance();

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
          <p className="text-gray-600">Fetching your attendance data...</p>
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
                <FiUserCheck className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Mark Attendance
                </h1>
                <p className="text-gray-600 mt-2 text-lg flex items-center gap-2">
                  <FiCalendar className="w-5 h-5" />
                  {formattedDate}
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
                    <p className="text-2xl font-bold text-gray-800">{myClasses.length}</p>
                    <p className="text-gray-600 text-sm">My Classes</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <FiCheckCircle className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.presentCount}</p>
                    <p className="text-gray-600 text-sm">Present Days</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FiTrendingUp className="text-purple-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.attendanceRate}%</p>
                    <p className="text-gray-600 text-sm">Attendance Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mark Attendance Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <FiCheck className="text-green-600 text-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Mark Today's Attendance</h2>
              <p className="text-gray-600">Select your classes to mark present for today</p>
            </div>
          </div>

          {myClasses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-blue-200/50 shadow-xl"
            >
              <div className="max-w-md mx-auto">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <FiBook className="text-white text-3xl" />
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-800 mb-3">
                  No Classes Found
                </h3>
                <p className="text-gray-600 text-lg mb-8 max-w-sm mx-auto leading-relaxed">
                  You are not enrolled in any classes yet. Please contact your administrator to get assigned to classes.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {myClasses.map((cls) => {
                const isMarked = alreadyMarkedToday.has(cls?._id);
                const isSaving = savingClassId === cls?._id;

                return (
                  <motion.div
                    key={cls?._id}
                    variants={cardVariants}
                    whileHover="hover"
                    className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden group"
                  >
                    <div className="p-6">
                      {/* Class Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <FiBook className="text-white text-lg" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-800 text-lg truncate">
                                {cls?.name}
                              </h3>
                              <p className="text-gray-600 text-sm truncate">
                                {cls.students?.length || 0} students
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isMarked 
                            ? "bg-green-100 text-green-800" 
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {isMarked ? "Marked" : "Pending"}
                        </div>
                      </div>

                      {/* Class Info */}
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-4 h-4" />
                          {today}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiAward className="w-4 h-4" />
                          {cls.courses?.length || 0} courses
                        </span>
                      </div>

                      {/* Action Button */}
                      <motion.button
                        whileHover={!isMarked && !isSaving ? { scale: 1.05 } : {}}
                        whileTap={!isMarked && !isSaving ? { scale: 0.95 } : {}}
                        onClick={() => !isMarked && markAttendance(cls?._id, cls?.name)}
                        disabled={isMarked || isSaving}
                        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                          isMarked
                            ? "bg-green-500 text-white cursor-not-allowed"
                            : isSaving
                            ? "bg-gray-500 text-white cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform shadow-lg hover:shadow-xl"
                        }`}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Marking...</span>
                          </>
                        ) : isMarked ? (
                          <>
                            <FiCheckCircle className="text-lg" />
                            <span>Already Marked</span>
                          </>
                        ) : (
                          <>
                            <FiUserCheck className="text-lg" />
                            <span>Mark Present</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Attendance History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FiClock className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Attendance History</h2>
                <p className="text-blue-100">Your recent attendance records</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {recentAttendance.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <FiCalendar className="text-white text-xl" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Records Yet</h3>
                <p className="text-gray-600">Your attendance history will appear here once you start marking attendance.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAttendance.map((record, index) => {
                  const classInfo = classes?.find((c) => c?._id === record.classId);
                  const isPresent = record.status === "present";
                  
                  return (
                    <motion.div
                      key={`${record.classId}-${record.date}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl border border-gray-200/50 hover:bg-gray-100/50 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                          isPresent 
                            ? "bg-green-500 text-white" 
                            : "bg-red-500 text-white"
                        }`}>
                          {isPresent ? 
                            <FiCheckCircle className="text-lg" /> : 
                            <FiXCircle className="text-lg" />
                          }
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 truncate">
                            {classInfo?.name || record.classId}
                          </h4>
                          <p className="text-gray-600 text-sm flex items-center gap-2">
                            <FiCalendar className="w-3 h-3" />
                            {new Date(record.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isPresent 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {isPresent ? "Present" : "Absent"}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* View All Button */}
            {myRecords.length > 10 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 transform shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View All Records ({myRecords.length})
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StudentAttendancePage;