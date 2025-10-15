"use client";

import { useEffect } from "react";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useQuizzes } from "@/hooks/useQuizzes";
import { shallowEqual, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiFileText, 
  FiCheckCircle, 
  FiClock, 
  FiAward,
  FiBarChart2,
  FiBook,
  FiTrendingUp,
  FiEye,
  FiCalendar
} from "react-icons/fi";
import { Loader2 } from "lucide-react";

const StudentSubmissions = () => {
  const { submissions } = useSubmissions();
  const currentUser = useSelector((s) => s?.activeUser, shallowEqual);
  const { quizzes } = useQuizzes();

  const studentSubs = submissions.filter(
    (s) => s?.studentId === currentUser?._id
  );

  // Calculate statistics
  const stats = {
    total: studentSubs.length,
    evaluated: studentSubs.filter(s => s?.evaluated).length,
    pending: studentSubs.filter(s => !s?.evaluated).length,
    averageMarks: studentSubs.filter(s => s?.evaluated && s.marks).length > 0 
      ? Math.round(studentSubs.filter(s => s?.evaluated && s.marks)
          .reduce((sum, s) => sum + s.marks, 0) / 
          studentSubs.filter(s => s?.evaluated && s.marks).length)
      : 0
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

  const getGradeColor = (marks) => {
    if (marks >= 80) return "text-green-600";
    if (marks >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeBgColor = (marks) => {
    if (marks >= 80) return "bg-green-500";
    if (marks >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getGradeText = (marks) => {
    if (marks >= 80) return "Excellent";
    if (marks >= 60) return "Good";
    if (marks >= 40) return "Average";
    return "Needs Improvement";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FiFileText className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  My Submissions
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Track your quiz submissions and results
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
                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                    <p className="text-gray-600 text-sm">Total Submissions</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <FiCheckCircle className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.evaluated}</p>
                    <p className="text-gray-600 text-sm">Evaluated</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <FiClock className="text-yellow-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
                    <p className="text-gray-600 text-sm">Pending</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FiTrendingUp className="text-purple-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.averageMarks}%</p>
                    <p className="text-gray-600 text-sm">Average Score</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions Grid */}
        {studentSubs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-blue-200/50 shadow-xl"
          >
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FiFileText className="text-white text-3xl" />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-800 mb-3">
                No Submissions Yet
              </h3>
              <p className="text-gray-600 text-lg mb-8 max-w-sm mx-auto leading-relaxed">
                You haven't submitted any quizzes yet. Complete your assigned quizzes to see them here.
              </p>
              
              <div className="flex items-center justify-center gap-4 text-gray-500">
                <div className="flex items-center gap-2">
                  <FiBook className="w-5 h-5" />
                  <span>Take your first quiz</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {studentSubs.map((submission) => {
              const quiz = quizzes?.find((q) => q?._id === submission?.quizId);
              const isEvaluated = submission?.evaluated;
              const submissionDate = submission?.submittedAt 
                ? new Date(submission.submittedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : 'Recently';

              return (
                <motion.div
                  key={submission?._id}
                  variants={cardVariants}
                  whileHover="hover"
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden group cursor-pointer"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <FiFileText className="text-white text-lg" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-800 text-lg truncate group-hover:text-gray-900 transition-colors duration-300">
                              {quiz?.title || "Untitled Quiz"}
                            </h3>
                            <p className="text-gray-600 text-sm truncate flex items-center gap-1">
                              <FiCalendar className="w-3 h-3" />
                              {submissionDate}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isEvaluated 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {isEvaluated ? "Evaluated" : "Pending"}
                      </div>
                    </div>

                    {/* Quiz Info */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <FiBarChart2 className="w-4 h-4" />
                        {quiz?.questions?.length || 0} Questions
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="w-4 h-4" />
                        {submission?.timeSpent || "N/A"} mins
                      </span>
                    </div>

                    {/* Marks Section */}
                    {isEvaluated && submission?.marks !== undefined && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                              <FiAward className="text-green-600 text-lg" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Your Score</p>
                              <p className={`text-2xl font-bold ${getGradeColor(submission.marks)}`}>
                                {submission.marks}%
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getGradeBgColor(submission.marks)} text-white`}>
                              {getGradeText(submission.marks)}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Grade</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Performance</span>
                            <span>{submission.marks}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${submission.marks}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={`h-2 rounded-full ${getGradeBgColor(submission.marks)}`}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Pending Evaluation State */}
                    {!isEvaluated && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                            <FiClock className="text-yellow-600 text-lg" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Awaiting Evaluation</p>
                            <p className="text-yellow-700 text-sm">
                              Your submission is being reviewed by your teacher
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-gray-200/50">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-xl font-medium text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <FiEye className="w-4 h-4" />
                        View Details
                      </motion.button>
                      
                      {isEvaluated && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-10 h-10 bg-green-500 text-white rounded-xl font-medium text-sm hover:bg-green-600 transition-all duration-200 flex items-center justify-center"
                        >
                          <FiBarChart2 className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>

                    {/* Submission Details */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      whileHover={{ opacity: 1, height: "auto" }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200/50">
                        <span>Submission ID: {submission?._id?.slice(-8)}</span>
                        <span>
                          {submission?.answers?.length || 0} answers
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentSubmissions;