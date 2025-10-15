"use client";

import { useRouter } from "next/navigation";
import { useQuizzes } from "@/hooks/useQuizzes";
import { useClasses } from "@/hooks/useClasses";
import { useCourses } from "@/hooks/useCourses";
import { shallowEqual, useSelector } from "react-redux";
import { Loader2, FileQuestion, Plus, Trash2, Edit3, Eye, BarChart3 } from "lucide-react";
import { FiBook, FiUsers, FiBarChart, FiCalendar, FiArrowRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { roleBasedUrl } from "@/config";

const TeacherQuizList = () => {
  const router = useRouter();
  const { quizzes, loading, removeQuiz } = useQuizzes();
  const { classes } = useClasses();
  const { courses } = useCourses();
  const currentUser = useSelector((s) => s?.activeUser, shallowEqual);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (quiz) => {
    setDeletingId(quiz?._id);
    await removeQuiz(quiz);
    setDeletingId(null);
  };

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

  if (loading)
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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Quizzes</h3>
          <p className="text-gray-600">Getting your quiz data ready...</p>
        </motion.div>
      </div>
    );

  // Map classId to class object for grouping
  const classIdToClass = new Map((classes || []).map((c) => [c?._id, c]));

  // Build courseId set for teacher
  const myCourseIds = new Set(
    (courses || [])
      .filter((c) => Array.isArray(c?.teachers) && c.teachers.includes(currentUser?._id))
      .map((c) => c?._id)
  );

  // Determine visible quizzes based on role
  let eligibleQuizzes = [];
  if (currentUser?.role === "admin") {
    // Admin can view all quizzes
    eligibleQuizzes = quizzes || [];
  } else {
    // Teacher: only own quizzes in classes tied to assigned courses
    const myQuizzes = (quizzes || []).filter((q) => q?.teacherId === currentUser?._id);
    eligibleQuizzes = myQuizzes.filter((q) => {
      const cls = classIdToClass.get(q?.classId);
      return Array.isArray(cls?.courses) && cls.courses.some((cid) => myCourseIds.has(cid));
    });
  }

  // Group by classId
  const groupedByClass = eligibleQuizzes.reduce((acc, q) => {
    const key = q?.classId || "unknown";
    acc[key] = acc[key] || [];
    acc[key].push(q);
    return acc;
  }, {});

  if (!eligibleQuizzes || eligibleQuizzes.length === 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FileQuestion className="text-white w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Quiz Management
                </h1>
                <p className="text-gray-600 mt-2 text-lg">Create and manage your assessments</p>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-blue-200/50 shadow-xl"
          >
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FileQuestion className="text-white w-10 h-10" />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-800 mb-3">
                No Quizzes Yet
              </h3>
              <p className="text-gray-600 text-lg mb-8 max-w-sm mx-auto leading-relaxed">
                {currentUser?.role === "admin" 
                  ? "Create quizzes to assess student learning across all classes"
                  : "Create quizzes for your assigned classes to assess student learning"
                }
              </p>
              
              {/* Only show create button for non-admin users */}
              {currentUser?.role !== "admin" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(roleBasedUrl("/quizzes/add"))}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transform shadow-2xl hover:shadow-3xl transition-all duration-300 inline-flex items-center gap-3 text-lg"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Quiz
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    );

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
                <FileQuestion className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Quiz Management
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  {currentUser?.role === "admin" ? "View and manage all quizzes" : "Manage and track your assessments"}
                </p>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileQuestion className="text-blue-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{eligibleQuizzes.length}</p>
                    <p className="text-gray-600 text-sm">Total Quizzes</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FiBook className="text-purple-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{Object.keys(groupedByClass).length}</p>
                    <p className="text-gray-600 text-sm">Classes</p>
                  </div>
                </div>
              </div>

              {/* Admin-specific stats */}
              {currentUser?.role === "admin" && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <FiUsers className="text-green-600 text-lg" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">
                        {new Set(eligibleQuizzes.map(q => q?.teacherId)).size}
                      </p>
                      <p className="text-gray-600 text-sm">Teachers</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Only show create button for non-admin users */}
          {currentUser?.role !== "admin" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(roleBasedUrl("/quizzes/add"))}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transform shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New Quiz
            </motion.button>
          )}
        </div>

        {/* Quiz Groups */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {Object.entries(groupedByClass).map(([classId, list]) => {
            const cls = classIdToClass.get(classId);
            return (
              <motion.div
                key={classId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-lg"
              >
                {/* Class Header */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FiBook className="text-white text-xl" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {cls?.name || "Unnamed Class"}
                    </h2>
                    <p className="text-gray-600">
                      {list.length} quiz{list.length !== 1 ? 'zes' : ''} available
                    </p>
                  </div>
                  {currentUser?.role === "admin" && (
                    <div className="text-sm text-gray-500 bg-white/80 px-3 py-1 rounded-full border">
                      {list.filter(q => q?.teacherId).length} teacher{list.filter(q => q?.teacherId).length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                {/* Quiz Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {list.map((quiz, index) => (
                    <motion.div
                      key={quiz._id}
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:border-blue-200 overflow-hidden group cursor-pointer relative"
                    >
                      {/* Background Gradient Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative z-10 p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-800 truncate group-hover:text-gray-900 transition-colors duration-300">
                              {quiz.title || "Untitled Quiz"}
                            </h3>
                            <p className="text-blue-600 text-sm font-medium mt-1 flex items-center gap-1">
                              <FiCalendar className="w-3 h-3" />
                              {quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : "—"}
                            </p>
                            {/* Show teacher name for admin */}
                            {currentUser?.role === "admin" && quiz?.teacherName && (
                              <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                                <FiUsers className="w-3 h-3" />
                                By {quiz.teacherName}
                              </p>
                            )}
                          </div>
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg ml-2 flex-shrink-0">
                            <span className="text-white font-bold text-xs">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-2">
                              <FileQuestion className="w-4 h-4 text-gray-600" />
                              <span className="text-gray-700 font-medium text-sm">Questions</span>
                            </div>
                            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold min-w-[30px] text-center">
                              {quiz.questions?.length || 0}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push(roleBasedUrl(`/quizzes/${quiz?._id}`))}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </motion.button>
                          
                          {/* Edit button - only for teachers who own the quiz */}
                          {currentUser?.role === "teacher" && quiz?.teacherId === currentUser?._id && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => router.push(roleBasedUrl(`/quizzes/edit?id=${quiz?._id}`))}
                              className="w-10 h-10 bg-gray-500 text-white rounded-lg font-medium text-sm hover:bg-gray-600 transition-all duration-200 flex items-center justify-center"
                            >
                              <Edit3 className="w-4 h-4" />
                            </motion.button>
                          )}
                          
                          {/* Submissions button - visible to all */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push(roleBasedUrl(`/submissions`))}
                            className="w-10 h-10 bg-green-500 text-white rounded-lg font-medium text-sm hover:bg-green-600 transition-all duration-200 flex items-center justify-center"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </motion.button>

                          {/* Delete button - only for teachers who own the quiz */}
                          {currentUser?.role === "teacher" && quiz?.teacherId === currentUser?._id && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(quiz)}
                              disabled={deletingId === quiz?._id}
                              className="w-10 h-10 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {deletingId === quiz?._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </motion.button>
                          )}
                        </div>
                      </div>

                      {/* Hover Arrow */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <FiArrowRight className="text-white text-xs" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TeacherQuizList;