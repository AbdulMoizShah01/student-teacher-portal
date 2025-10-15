"use client";

import { useQuizzes } from "@/hooks/useQuizzes";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiBook,
  FiArrowLeft,
  FiBarChart2,
  FiCheckCircle,
  FiHelpCircle,
  FiClipboard,
  FiEye
} from "react-icons/fi";

const ViewQuiz = () => {
  const { id } = useParams();
  const router = useRouter();
  const { quizzes, loading } = useQuizzes();
  const quiz = quizzes.find((q) => q?._id === id);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const questionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
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
            Loading quiz...
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
              <FiHelpCircle className="text-white text-xl" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Quiz Not Found</h3>
          <p className="text-gray-600 mb-6">The quiz you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.back()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
          >
            <FiArrowLeft className="w-4 h-4" />
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
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => router.back()}
                className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/20 hover:scale-105 transition-all duration-200"
              >
                <FiArrowLeft className="text-gray-700 text-xl" />
              </button>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FiEye className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {quiz?.title}
                </h1>
                <p className="text-gray-600 mt-1 text-lg">
                  Review quiz questions and correct answers
                </p>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiBarChart2 className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{quiz.questions?.length || 0}</p>
                    <p className="text-gray-600 text-sm">Total Questions</p>
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
                      {quiz.questions?.filter(q => q?.correctAnswer || q?.correctOption !== undefined).length || 0}
                    </p>
                    <p className="text-gray-600 text-sm">With Answers</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FiClipboard className="text-purple-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {quiz.questions?.filter(q => q?.type === 'mcq').length || 0}
                    </p>
                    <p className="text-gray-600 text-sm">MCQ Questions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz Description */}
            {quiz?.description && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg"
              >
                <h3 className="font-semibold text-gray-800 mb-2 text-lg">Description</h3>
                <p className="text-gray-600 leading-relaxed">{quiz.description}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Questions Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <AnimatePresence>
            {quiz.questions?.map((q, index) => (
              <motion.div
                key={q?._id || index}
                variants={questionVariants}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden group"
              >
                <div className="p-6">
                  {/* Question Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-lg leading-relaxed">
                        {q.question}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {q?.type === 'qa' ? 'Written Answer' : 
                           q?.type === 'mcq' ? 'Multiple Choice' : 
                           q?.type === 'truefalse' ? 'True/False' : 'Question'}
                        </span>
                        {(q?.correctAnswer || q?.correctOption !== undefined) && (
                          <span className="flex items-center gap-1 text-green-600 text-sm">
                            <FiCheckCircle className="w-4 h-4" />
                            Answer Available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  {q?.options?.length > 0 && (
                    <div className="ml-14 space-y-3">
                      {q.options.map((opt, optIndex) => {
                        const isCorrect = q?.correctOption === optIndex || q?.correctAnswer === opt;
                        return (
                          <motion.div
                            key={optIndex}
                            whileHover={{ scale: 1.02 }}
                            className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                              isCorrect
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-lg'
                                : 'bg-gray-50/80 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                isCorrect
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-gray-400'
                              }`}>
                                {isCorrect && (
                                  <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                              </div>
                              <span className={`font-medium flex-1 ${
                                isCorrect ? 'text-green-800' : 'text-gray-700'
                              }`}>
                                {opt}
                              </span>
                              {isCorrect && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">
                                  <FiCheckCircle className="w-3 h-3" />
                                  Correct
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* Correct Answer for QA type */}
                  {q?.type === 'qa' && q?.correctAnswer && (
                    <div className="ml-14 mt-4">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-300"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                            <FiCheckCircle className="text-green-600 text-sm" />
                          </div>
                          <h4 className="font-semibold text-green-800">Correct Answer</h4>
                        </div>
                        <p className="text-green-700 ml-11">{q.correctAnswer}</p>
                      </motion.div>
                    </div>
                  )}

                  {/* Question Metadata */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200/50 ml-14">
                    <span>Question {index + 1} of {quiz.questions.length}</span>
                    <span className="capitalize">{q?.type}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mt-8 pt-6 border-t border-gray-200/50"
        >
          <motion.button
            onClick={() => router.back()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 hover:from-blue-700 hover:to-purple-700"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Previous Page
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ViewQuiz;