"use client";

import { useRouter } from "next/navigation";
import { useQuizzes } from "@/hooks/useQuizzes";
import { useSubmissions } from "@/hooks/useSubmissions";
import { shallowEqual, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiBook,
  FiClock,
  FiUsers,
  FiUser,
  FiBarChart2,
  FiCheckCircle,
  FiLock,
  FiPlay,
  FiAward
} from "react-icons/fi";

const StudentQuizzes = () => {
  const router = useRouter();
  const { quizzes, loading } = useQuizzes();
  const { submissions } = useSubmissions();
  const currentUser = useSelector((s) => s?.activeUser, shallowEqual);

  const studentSubmissions = submissions.filter(
    (s) => s?.studentId === currentUser?._id
  );

  const hasAttemptedQuiz = (quizId) => {
    return studentSubmissions.some(sub => sub?.quizId === quizId);
  };

  const getQuizAttemptInfo = (quizId) => {
    const submission = studentSubmissions.find(sub => sub?.quizId === quizId);
    if (!submission) return null;
    
    return {
      attempted: true,
      evaluated: submission?.evaluated,
      marks: submission?.marks,
      submissionId: submission?._id
    };
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FiBook className="text-white text-2xl" />
          </div>
          <p className="text-xl font-semibold text-gray-800 animate-pulse">
            Loading quizzes...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!quizzes?.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <FiBook className="text-white text-xl" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            No Quizzes Available
          </h3>
          <p className="text-gray-600 mb-2">
            There are no quizzes assigned to you yet.
          </p>
          <p className="text-gray-500 text-sm">
            Check back later or contact your teacher.
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
                <FiBook className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Available Quizzes
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Take your assigned quizzes and track your progress
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
                    <p className="text-2xl font-bold text-gray-800">{quizzes.length}</p>
                    <p className="text-gray-600 text-sm">Total Quizzes</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <FiCheckCircle className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {quizzes.filter(quiz => hasAttemptedQuiz(quiz?._id || quiz?.id)).length}
                    </p>
                    <p className="text-gray-600 text-sm">Attempted</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <FiClock className="text-yellow-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {quizzes.filter(quiz => !hasAttemptedQuiz(quiz?._id || quiz?.id)).length}
                    </p>
                    <p className="text-gray-600 text-sm">Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quizzes Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {quizzes.map((quiz, index) => {
              const quizAttemptInfo = getQuizAttemptInfo(quiz?._id || quiz?.id);
              const isAttempted = !!quizAttemptInfo;

              return (
                <motion.div
                  key={quiz._id || quiz.id || index}
                  variants={cardVariants}
                  whileHover="hover"
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden group cursor-pointer flex flex-col h-full"
                >
                  <div className="p-6 flex flex-col flex-1">
                    {/* Header - Fixed height container */}
                    <div className="flex items-start gap-3 mb-4 min-h-[80px]">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 mt-1">
                        <FiBook className="text-white text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-2 flex-1">
                            {quiz?.title || "Untitled Quiz"}
                          </h3>
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
                            isAttempted 
                              ? "bg-green-100 text-green-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {isAttempted ? "Attempted" : "Available"}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                          {quiz?.description || "No description provided"}
                        </p>
                      </div>
                    </div>

                    {/* Quiz Info - Consistent spacing */}
                    <div className="space-y-3 mb-4 flex-1">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center gap-2 whitespace-nowrap">
                          <FiBarChart2 className="w-4 h-4 flex-shrink-0" />
                          {quiz?.questions?.length || 0} Questions
                        </span>
                        {quiz?.className && (
                          <span className="flex items-center gap-2 whitespace-nowrap">
                            <FiUsers className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{quiz.className}</span>
                          </span>
                        )}
                      </div>

                      {quiz?.teacherName && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiUser className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">By {quiz.teacherName}</span>
                        </div>
                      )}
                    </div>

                    {/* Attempt Results - Consistent height area */}
                    <div className="min-h-[80px] mb-4">
                      {isAttempted && quizAttemptInfo.evaluated && quizAttemptInfo.marks !== undefined && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50 h-full"
                        >
                          <div className="flex items-center justify-between h-full">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FiAward className="text-green-600 text-sm" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Your Score</p>
                                <p className="text-xl font-bold text-green-600">
                                  {quizAttemptInfo.marks}%
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="px-2 py-1 bg-green-500 rounded-full text-xs font-semibold text-white whitespace-nowrap">
                                Evaluated
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {isAttempted && !quizAttemptInfo.evaluated && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200/50 h-full"
                        >
                          <div className="flex items-center gap-3 h-full">
                            <div className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <FiClock className="text-yellow-600 text-sm" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-700">Evaluation Pending</p>
                              <p className="text-yellow-700 text-xs">
                                Your submission is being reviewed
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {!isAttempted && (
                        <div className="h-full flex items-center justify-center p-4">
                          <div className="text-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                              <FiPlay className="text-blue-600 text-lg" />
                            </div>
                            <p className="text-sm text-gray-600">Ready to attempt</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button - Fixed at bottom */}
                    <div className="mt-auto pt-4 border-t border-gray-200/50">
                      <div className="flex gap-2">
                        {!isAttempted ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push(`/student/quizzes/attempt/${quiz?._id || quiz?.id}`)}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            <FiPlay className="w-4 h-4" />
                            Attempt Quiz
                          </motion.button>
                        ) : (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => router.push(`/student/submissions`)}
                              className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-xl font-medium text-sm hover:from-gray-700 hover:to-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                              <FiCheckCircle className="w-4 h-4" />
                              View Submission
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-12 h-12 bg-gray-100 text-gray-600 rounded-xl font-medium text-sm hover:bg-gray-200 transition-all duration-200 flex items-center justify-center flex-shrink-0"
                              title="Quiz already attempted"
                            >
                              <FiLock className="w-4 h-4" />
                            </motion.button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Quiz Details - Consistent bottom alignment */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200/50">
                      <span className="font-mono">ID: {quiz?._id?.slice(-8) || quiz?.id?.slice(-8)}</span>
                      <span className={`text-xs font-medium ${
                        isAttempted ? "text-green-600" : "text-blue-600"
                      }`}>
                        {isAttempted ? "Completed" : "Not Started"}
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

export default StudentQuizzes;