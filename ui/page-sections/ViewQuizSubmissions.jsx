"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ClipboardList, User, Mail, Calendar, Book, BarChart3 } from "lucide-react";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useUsers } from "@/hooks/useUsers";
import { useQuizzes } from "@/hooks/useQuizzes";
import { useClasses } from "@/hooks/useClasses";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUsers,
  FiBook,
  FiBarChart2,
  FiClock,
  FiCheckCircle,
  FiAward
} from "react-icons/fi";

const ViewQuizSubmissions = () => {
  const { quizId } = useParams();
  const router = useRouter();

  const { submissions, loading: submissionsLoading } = useSubmissions();
  const { users, loading: usersLoading } = useUsers();
  const { quizzes, loading: quizzesLoading } = useQuizzes(); 
  const { classes, loading: classesLoading } = useClasses();

  const isLoading = submissionsLoading || usersLoading || quizzesLoading || classesLoading;

  const quiz = quizzes?.find((q) => q?._id === quizId);
  const quizSubmissions = submissions?.filter((s) => s?.quizId === quizId);

  // Calculate statistics
  const stats = {
    total: quizSubmissions?.length || 0,
    evaluated: quizSubmissions?.filter(s => s?.evaluated).length || 0,
    pending: quizSubmissions?.filter(s => !s?.evaluated).length || 0,
    averageMarks: quizSubmissions?.filter(s => s?.evaluated && s.marks).length > 0 
      ? Math.round(quizSubmissions.filter(s => s?.evaluated && s.marks)
          .reduce((sum, s) => sum + s.marks, 0) / 
          quizSubmissions.filter(s => s?.evaluated && s.marks).length)
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ClipboardList className="text-white text-2xl" />
          </div>
          <p className="text-xl font-semibold text-gray-800 animate-pulse">
            Loading submissions...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
              <ClipboardList className="text-white text-xl" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Quiz Not Found</h3>
          <p className="text-gray-600 mb-6">The quiz you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.back()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  if (!quizSubmissions || quizSubmissions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <ClipboardList className="text-white text-xl" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No Submissions Yet</h3>
          <p className="text-gray-600 mb-2">No students have submitted this quiz yet.</p>
          <p className="text-gray-500 text-sm mb-6">Check back later when students complete the quiz.</p>
          <button
            onClick={() => router.back()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
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
              <button
                onClick={() => router.back()}
                className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/20 hover:scale-105 transition-all duration-200"
              >
                <ArrowLeft className="text-gray-700 text-xl" />
              </button>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ClipboardList className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Quiz Submissions
                </h1>
                <p className="text-gray-600 mt-1 text-lg">
                  Review student submissions for: <span className="font-semibold text-gray-800">{quiz?.title}</span>
                </p>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiUsers className="text-blue-600 text-lg" />
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
                    <FiBarChart2 className="text-purple-600 text-lg" />
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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {quizSubmissions.map((submission) => {
              const student = users?.find((u) => u?._id === submission?.studentId);
              const classInfo = classes?.find((c) => c?._id === submission?.classId);
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
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden group cursor-pointer flex flex-col h-full"
                >
                  <div className="p-6 flex flex-col flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <User className="text-white text-lg" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-800 text-lg truncate group-hover:text-gray-900 transition-colors duration-300">
                              {student?.name || "Unknown Student"}
                            </h3>
                            <p className="text-gray-600 text-sm truncate flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
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

                    {/* Student Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{student?.email || "N/A"}</span>
                      </div>
                   
                  
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
                            <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                              <FiAward className="text-green-600 text-sm" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Score</p>
                              <p className={`text-xl font-bold ${getGradeColor(submission?.marks)}`}>
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
                            <span>{submission?.marks}%</span>
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
                          <div className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center">
                            <FiClock className="text-yellow-600 text-sm" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Awaiting Evaluation</p>
                            <p className="text-yellow-700 text-xs">
                              This submission needs to be evaluated
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

            

                    {/* Submission Details */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200/50">
                      <span>Submission ID: {submission?._id?.slice(-8)}</span>
                      <span>
                        {submission?.answers?.length || 0} answers
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ViewQuizSubmissions;