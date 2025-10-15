"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useQuizzes } from "@/hooks/useQuizzes";
import { useSubmissions } from "@/hooks/useSubmissions";
import NormalInputs from "../inputs/NormalInputs"
import { shallowEqual, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiClock, 
  FiBook,
  FiHelpCircle,
  FiCheckCircle,
  FiArrowLeft,
  FiBarChart2,
  FiSend,
  FiUser
} from "react-icons/fi";

const AttemptQuiz = (onSubmit) => {
  const router = useRouter();
  const { id: quizId } = useParams();
  const { quizzes, loading } = useQuizzes();
  const { addSubmission } = useSubmissions();
  const currentUser = useSelector((s)=>s?.activeUser,shallowEqual);

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!loading && quizzes?.length > 0) {
      const q = quizzes?.find((qz) => qz?._id === quizId || qz?.id === quizId);
      if (q) {
        setQuiz(q);
        setAnswers(
          q.questions.map((ques) => ({
            questionId: ques?._id || Math.random().toString(),
            question: ques?.question,
            type: ques?.type,
            answer: "",
            correctAnswer: ques?.correctAnswer ?? null,
          }))
        );
      }
    }
  }, [quizId, quizzes, loading]);

  const handleAnswer = (index, value) => {
    const updated = [...answers];
    updated[index].answer = value;
    setAnswers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addSubmission({
        quizId: quiz?._id || quiz?.id,
        studentId: currentUser?._id,
        studentName: currentUser?.name,
        teacherId: quiz?.teacherId, // Add teacherId to submission
        answers,
        timeSpent,
      });
      toast.success("Quiz submitted successfully 🎉", { theme: "colored" });
      router.push("/student/submissions");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit quiz", { theme: "colored" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const answeredCount = answers.filter(a => a.answer.trim() !== "").length;
  const progress = quiz ? (answeredCount / quiz.questions.length) * 100 : 0;

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
          <p className="text-xl font-semibold text-gray-800 animate-pulse">Loading quiz...</p>
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
                <FiBook className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {quiz?.title}
                </h1>
                <p className="text-gray-600 mt-1 text-lg">
                  Attempt your quiz questions below
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
                    <p className="text-2xl font-bold text-gray-800">{quiz.questions?.length}</p>
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
                    <p className="text-2xl font-bold text-gray-800">{answeredCount}</p>
                    <p className="text-gray-600 text-sm">Answered</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <FiClock className="text-yellow-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{timeSpent}</p>
                    <p className="text-gray-600 text-sm">Minutes</p>
                  </div>
                </div>
              </div>

              {/* Teacher Info Card */}
              {quiz?.teacherName && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <FiUser className="text-purple-600 text-lg" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 truncate max-w-[100px]">
                        {quiz.teacherName}
                      </p>
                      <p className="text-gray-600 text-sm">Teacher</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{answeredCount}/{quiz.questions?.length} ({Math.round(progress)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Form */}
        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {quiz.questions?.map((q, i) => (
            <motion.div
              key={i}
              variants={questionVariants}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden group"
            >
              <div className="p-6">
                {/* Question Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white font-bold text-sm">{i + 1}</span>
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
                      {answers[i]?.answer && (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <FiCheckCircle className="w-4 h-4" />
                          Answered
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Answer Input */}
                <div className="ml-14">
                  {q?.type === "qa" && (
                    <div className="space-y-3">
                      <NormalInputs
                        placeholder="Type your answer here..."
                        value={answers[i]?.answer}
                        setValue={(v) => handleAnswer(i, v)}
                        className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      />
                    </div>
                  )}

                  {(q?.type === "mcq" || q?.type === "truefalse") && (
                    <div className="space-y-2">
                      {q?.options?.map((opt, idx) => (
                        <motion.label
                          key={idx}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${
                            answers[i]?.answer === opt
                              ? 'bg-blue-50 border-blue-500 shadow-lg'
                              : 'bg-white/50 border-transparent hover:bg-gray-50'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            answers[i]?.answer === opt
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-400'
                          }`}>
                            {answers[i]?.answer === opt && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          <span className="text-gray-800 font-medium flex-1">{opt}</span>
                          <input
                            type="radio"
                            name={`q-${i}`}
                            checked={answers[i]?.answer === opt}
                            onChange={() => handleAnswer(i, opt)}
                            className="hidden"
                          />
                        </motion.label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-end pt-6 border-t border-gray-200/50"
          >
            <motion.button
              type="submit"
              disabled={isSubmitting || answeredCount === 0}
              whileHover={{ scale: isSubmitting || answeredCount === 0 ? 1 : 1.05 }}
              whileTap={{ scale: isSubmitting || answeredCount === 0 ? 1 : 0.95 }}
              className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 ${
                isSubmitting || answeredCount === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <FiSend className="w-5 h-5" />
                  Submit Quiz ({answeredCount}/{quiz.questions?.length})
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default AttemptQuiz;