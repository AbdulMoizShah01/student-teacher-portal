"use client";

import { useEffect, useState } from "react";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useQuizzes } from "@/hooks/useQuizzes";
import NormalInputs from "../inputs/NormalInputs";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUser, 
  FiBook, 
  FiCheck, 
  FiX, 
  FiArrowRight,
  FiFileText,
  FiStar,
  FiAward,
  FiBarChart2,
  FiSave,
  FiClock,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";
import { Loader2 } from "lucide-react";

const EvaluateSubmissions = () => {
  const { submissions, updateMarks } = useSubmissions();
  const { quizzes } = useQuizzes();
  const [selected, setSelected] = useState(null);
  const [marks, setMarks] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const handleEvaluate = async (submissionId) => {
    if (!marks || isNaN(marks) || marks < 0) {
      toast.error("Please enter valid marks", { theme: "colored" });
      return;
    }

    setUpdatingId(submissionId);
    try {
      await updateMarks(submissionId, marks);
      toast.success("Marks updated successfully ✅", { theme: "colored" });
      setSelected(null);
      setMarks("");
    } catch (error) {
      toast.error("Failed to update marks", { theme: "colored" });
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleQuestion = (submissionId, questionIndex) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [`${submissionId}-${questionIndex}`]: !prev[`${submissionId}-${questionIndex}`]
    }));
  };

  const getScoreColor = (score, maxScore = 100) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score, maxScore = 100) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
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

  if (submissions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center py-20"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <FiFileText className="text-white text-3xl" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            No Submissions Yet
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
            Student submissions will appear here once they complete assigned quizzes
          </p>
          
          <div className="flex items-center justify-center gap-4 text-gray-500">
            <div className="flex items-center gap-2">
              <FiClock className="w-5 h-5" />
              <span>Waiting for submissions</span>
            </div>
          </div>
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
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FiFileText className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Evaluate Submissions
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Review and grade student quiz submissions
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{submissions.length}</div>
              <div className="text-gray-600 text-sm">Total Submissions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {submissions.filter(s => s.marks !== undefined && s.marks !== null).length}
              </div>
              <div className="text-gray-600 text-sm">Graded</div>
            </div>
          </div>
        </div>

        {/* Submissions Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {submissions.map((sub) => {
            const quiz = quizzes.find((q) => q?._id === sub?.quizId);
            const isSelected = selected === sub?._id;
            const isGraded = sub.marks !== undefined && sub.marks !== null;

            return (
              <motion.div
                key={sub?._id}
                variants={cardVariants}
                whileHover="hover"
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden group cursor-pointer"
              >
                {/* Card Header */}
                <div 
                  className="p-6 border-b border-gray-200/50"
                  onClick={() => setSelected(isSelected ? null : sub?._id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <FiUser className="text-white text-lg" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 text-lg truncate">
                            {sub?.studentName}
                          </h3>
                          <p className="text-gray-600 text-sm truncate">
                            {quiz?.title || "Unknown Quiz"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isGraded 
                        ? "bg-green-100 text-green-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {isGraded ? "Graded" : "Pending"}
                    </div>
                  </div>

                  {/* Quiz Info */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <FiBook className="w-4 h-4" />
                        {sub?.answers?.length || 0} Questions
                      </span>
                      {isGraded && (
                        <span className={`flex items-center gap-1 font-semibold ${getScoreColor(sub.marks)}`}>
                          <FiStar className="w-4 h-4" />
                          {sub.marks} Marks
                        </span>
                      )}
                    </div>
                    
                    <motion.div
                      animate={{ rotate: isSelected ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isSelected ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
                    </motion.div>
                  </div>
                </div>

                {/* Expandable Content */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      variants={expandVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="border-t border-gray-200/50"
                    >
                      <div className="p-6 space-y-4">
                        {/* Questions List */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                            <FiFileText className="text-blue-600" />
                            Student Answers
                          </h4>
                          
                          {sub?.answers.map((ans, i) => {
                            const isExpanded = expandedQuestions[`${sub._id}-${i}`];
                            const isCorrect = ans.answer === ans.correctAnswer;
                            
                            return (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-gray-50/80 rounded-2xl border border-gray-200/50 overflow-hidden"
                              >
                                {/* Question Header */}
                                <div 
                                  className="p-4 cursor-pointer hover:bg-gray-100/50 transition-colors duration-200"
                                  onClick={() => toggleQuestion(sub._id, i)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <span className="text-white font-bold text-sm">
                                          {i + 1}
                                        </span>
                                      </div>
                                      <span className="font-medium text-gray-800 text-sm line-clamp-2 flex-1">
                                        {ans?.question}
                                      </span>
                                    </div>
                                    <motion.div
                                      animate={{ rotate: isExpanded ? 180 : 0 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      <FiChevronDown className="w-4 h-4 text-gray-400" />
                                    </motion.div>
                                  </div>
                                </div>

                                {/* Question Details */}
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="px-4 pb-4 space-y-3"
                                    >
                                      {/* Student Answer */}
                                      <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-200">
                                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                          <FiUser className="text-blue-600 w-3 h-3" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-gray-700 mb-1">
                                            Student's Answer
                                          </p>
                                          <p className="text-gray-800 bg-blue-50/50 rounded-lg px-3 py-2">
                                            {ans.answer || "No answer provided"}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Correct Answer */}
                                      {ans.correctAnswer && (
                                        <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-200">
                                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                            isCorrect ? 'bg-green-100' : 'bg-red-100'
                                          }`}>
                                            {isCorrect ? 
                                              <FiCheck className="text-green-600 w-3 h-3" /> : 
                                              <FiX className="text-red-600 w-3 h-3" />
                                            }
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-700 mb-1">
                                              Correct Answer
                                            </p>
                                            <p className={`rounded-lg px-3 py-2 ${
                                              isCorrect ? 
                                                'text-green-800 bg-green-50/50' : 
                                                'text-red-800 bg-red-50/50'
                                            }`}>
                                              {ans.correctAnswer}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Grading Section */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200/50"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <FiAward className="text-white text-lg" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">Grade Submission</h4>
                              <p className="text-gray-600 text-sm">Assign marks for this submission</p>
                            </div>
                          </div>

                          <div className="flex items-end gap-4">
                            <div className="flex-1">
                              <NormalInputs
                                label="Marks"
                                placeholder="Enter marks (0-100)"
                                type="number"
                                min="0"
                                max="100"
                                value={marks}
                                setValue={setMarks}
                                className="bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                              />
                            </div>
                            
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEvaluate(sub?._id)}
                              disabled={updatingId === sub?._id}
                              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transform shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updatingId === sub?._id ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span>Saving...</span>
                                </>
                              ) : (
                                <>
                                  <FiSave className="text-lg" />
                                  <span>Save Marks</span>
                                </>
                              )}
                            </motion.button>
                          </div>

                          {/* Current Grade Display */}
                          {isGraded && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="mt-4 p-3 bg-white rounded-xl border border-green-200 flex items-center justify-between"
                            >
                              <span className="text-gray-700 font-medium">Current Grade:</span>
                              <span className={`text-lg font-bold ${getScoreColor(sub.marks)}`}>
                                {sub.marks} / 100
                              </span>
                            </motion.div>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EvaluateSubmissions;