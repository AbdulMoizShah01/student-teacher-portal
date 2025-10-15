"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useClasses } from "@/hooks/useClasses";
import { useCourses } from "@/hooks/useCourses";
import { useQuizzes } from "@/hooks/useQuizzes";
import NormalInputs from "../inputs/NormalInputs";
import { useSelector, shallowEqual } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiBook, 
  FiUsers, 
  FiPlus, 
  FiTrash2, 
  FiSave,
  FiX,
  FiArrowLeft,
  FiFileText,
  FiList,
  FiEdit
} from "react-icons/fi";
import { Loader2, FileQuestion, Trash2 } from "lucide-react";

const QuizForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { classes } = useClasses();
  const { courses } = useCourses();
  const { addQuiz, updateQuiz, quizzes } = useQuizzes();

  const currentUser = useSelector((state) => state?.activeUser, shallowEqual);
  const quizId = searchParams.get('id');

  // Check if we're in edit mode and get the quiz data
  const existingQuiz = quizId ? quizzes?.find(q => q._id === quizId) : null;
  const isEditMode = !!existingQuiz;

  const [quizObj, setQuizObj] = useState({
    title: "",
    classId: "",
    teacherId: "",
    questions: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoize filteredClasses to prevent infinite re-renders
  const filteredClasses = useMemo(() => {
    // Build set of course IDs assigned to this teacher
    const myCourseIds = new Set(
      (courses || [])
        .filter((c) => Array.isArray(c?.teachers) && c.teachers.includes(currentUser?._id))
        .map((c) => c?._id)
    );

    return (classes || []).filter(
      (cls) => Array.isArray(cls?.courses) && cls.courses.some((cid) => myCourseIds.has(cid))
    );
  }, [classes, courses, currentUser?._id]);

  // Initialize form only once
  useEffect(() => {
    if (isInitialized) return;

    if (isEditMode && existingQuiz) {
      setQuizObj({
        title: existingQuiz.title || "",
        classId: existingQuiz.classId || "",
        teacherId: existingQuiz.teacherId || currentUser?._id || "",
        questions: existingQuiz.questions || [],
      });
      
      // Find and set the selected class
      const cls = filteredClasses.find(c => c._id === existingQuiz.classId);
      if (cls) {
        setSelectedClass(cls);
      }
      setIsInitialized(true);
    } else if (!isEditMode && filteredClasses.length > 0) {
      // Auto-select first class for new quiz
      const firstClass = filteredClasses[0];
      setQuizObj(prev => ({
        ...prev,
        classId: firstClass._id,
        teacherId: currentUser?._id || "",
      }));
      setSelectedClass(firstClass);
      setIsInitialized(true);
    }
  }, [isEditMode, existingQuiz, filteredClasses, currentUser, isInitialized]);

  const addQuestion = () => {
    setQuizObj((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { type: "", question: "", options: [], correctAnswer: "" },
      ],
    }));
  };

  const removeQuestion = (index) => {
    const updatedQuestions = quizObj.questions.filter((_, i) => i !== index);
    setQuizObj((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...quizObj.questions];
    updated[index][field] = value;
    
    // Clear options when switching to QA type
    if (field === "type" && value === "qa") {
      updated[index].options = [];
      updated[index].correctAnswer = "";
    }
    
    // Initialize options for true/false
    if (field === "type" && value === "truefalse") {
      updated[index].options = ["True", "False"];
      updated[index].correctAnswer = "True";
    }
    
    setQuizObj((prev) => ({ ...prev, questions: updated }));
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...quizObj.questions];
    updated[qIndex].options[optIndex] = value;
    setQuizObj((prev) => ({ ...prev, questions: updated }));
  };

  const addOption = (qIndex) => {
    const updated = [...quizObj.questions];
    updated[qIndex].options.push("");
    setQuizObj((prev) => ({ ...prev, questions: updated }));
  };

  const removeOption = (qIndex, optIndex) => {
    const updated = [...quizObj.questions];
    updated[qIndex].options = updated[qIndex].options.filter(
      (_, i) => i !== optIndex
    );
    setQuizObj((prev) => ({ ...prev, questions: updated }));
  };

  const handleClassChange = (classId) => {
    const cls = filteredClasses.find(c => c._id === classId);
    if (cls) {
      setQuizObj((prev) => ({
        ...prev,
        classId: classId,
      }));
      setSelectedClass(cls);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!quizObj.title.trim()) {
      toast.error("Please enter a quiz title", { theme: "colored" });
      return;
    }
    
    if (!quizObj.classId) {
      toast.error("Please select a class", { theme: "colored" });
      return;
    }
    
    if (quizObj.questions.length === 0) {
      toast.error("Please add at least one question", { theme: "colored" });
      return;
    }

    // Validate all questions have required fields
    for (let i = 0; i < quizObj.questions.length; i++) {
      const q = quizObj.questions[i];
      if (!q.type || !q.question.trim()) {
        toast.error(`Question ${i + 1} is incomplete`, { theme: "colored" });
        return;
      }
      if ((q.type === "mcq" || q.type === "truefalse") && !q.correctAnswer) {
        toast.error(`Question ${i + 1} needs a correct answer selected`, { theme: "colored" });
        return;
      }
      if (q.type === "qa" && !q.correctAnswer.trim()) {
        toast.error(`Question ${i + 1} needs a correct answer`, { theme: "colored" });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const finalQuiz = { 
        ...quizObj, 
        teacherId: currentUser?._id || "",
        ...(isEditMode && { _id: quizId }) // Include ID for update
      };
      
      if (isEditMode) {
        await updateQuiz(finalQuiz);
        toast.success("Quiz updated successfully 🎉", { theme: "colored" });
      } else {
        await addQuiz(finalQuiz);
        toast.success("Quiz created successfully 🎉", { theme: "colored" });
      }
      
      setTimeout(() => {
        router.back();
      }, 1200);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} quiz`, { theme: "colored" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { y: -4, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        {/* Quiz Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.back()}
                  className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                >
                  <FiArrowLeft className="text-white text-xl" />
                </motion.button>
                <div>
                  <h1 className="text-3xl font-bold">
                    {isEditMode ? 'Edit Quiz' : 'Create New Quiz'}
                  </h1>
                  <p className="text-blue-100 mt-2">
                    {selectedClass ? `For: ${selectedClass.name}` : 'Select a class to continue'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-blue-100 text-sm">Questions</div>
                  <div className="text-2xl font-bold">{quizObj.questions.length}</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  {isEditMode ? <FiEdit className="text-white text-xl" /> : <FileQuestion className="text-white w-6 h-6" />}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Class Selection and Quiz Title */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Class Selection */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiUsers className="text-blue-600 text-lg" />
                  </div>
                  <label className="block text-lg font-semibold text-gray-800">
                    Select Class
                  </label>
                </div>
                <select
                  value={quizObj.classId}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full px-4 py-4 bg-white/70 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                >
                  <option value="">Select a class</option>
                  {filteredClasses?.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name} ({cls.students?.length || 0} students)
                    </option>
                  ))}
                </select>
                {filteredClasses.length === 0 && (
                  <p className="text-red-500 text-sm mt-2">
                    No classes available. You need to be assigned to classes with courses to create quizzes.
                  </p>
                )}
              </motion.div>

              {/* Quiz Title */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiFileText className="text-blue-600 text-lg" />
                  </div>
                  <label className="block text-lg font-semibold text-gray-800">
                    Quiz Title
                  </label>
                </div>
                <NormalInputs
                  placeholder="Enter an engaging quiz title"
                  value={quizObj.title}
                  setValue={(v) => setQuizObj((p) => ({ ...p, title: v }))}
                  className="bg-white/70 border border-gray-200 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                />
              </motion.div>
            </div>

            {/* Questions Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FiList className="text-purple-600 text-lg" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Questions
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {isEditMode ? 'Update your quiz questions and answers' : 'Build your quiz questions and answers'}
                    </p>
                  </div>
                </div>
                
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addQuestion}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transform shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <FiPlus className="text-lg" />
                  Add Question
                </motion.button>
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {quizObj.questions.map((q, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-lg overflow-hidden"
                  >
                    <div className="p-6">
                      {/* Question Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">
                            Question {index + 1}
                          </h3>
                        </div>
                        
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeQuestion(index)}
                          className="w-10 h-10 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>

                      {/* Question Type */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Question Type
                          </label>
                          <select
                            value={q.type}
                            onChange={(e) =>
                              handleQuestionChange(
                                index,
                                "type",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          >
                            <option value="">Select Type</option>
                            <option value="qa">Question & Answer</option>
                            <option value="mcq">Multiple Choice</option>
                            <option value="truefalse">True/False</option>
                          </select>
                        </div>
                      </div>

                      {/* Question Text */}
                      <div className="mb-4">
                        <NormalInputs
                          label="Question Text"
                          placeholder="Enter your question here..."
                          value={q.question}
                          setValue={(v) =>
                            handleQuestionChange(index, "question", v)
                          }
                          className="bg-white/70 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>

                      {/* Options for MCQ and True/False */}
                      {(q.type === "mcq" || q.type === "truefalse") && (
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Options
                          </label>
                          {q.options.map((opt, optIndex) => (
                            <div
                              key={optIndex}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200"
                            >
                              <input
                                type="radio"
                                name={`correct-${index}`}
                                checked={q.correctAnswer === opt}
                                onChange={() =>
                                  handleQuestionChange(
                                    index,
                                    "correctAnswer",
                                    opt
                                  )
                                }
                                className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) =>
                                  handleOptionChange(
                                    index,
                                    optIndex,
                                    e.target.value
                                  )
                                }
                                placeholder={`Option ${optIndex + 1}`}
                                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              />
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeOption(index, optIndex)}
                                className="w-8 h-8 text-red-500 hover:text-red-700 transition-colors duration-200 flex items-center justify-center"
                              >
                                <FiX className="w-4 h-4" />
                              </motion.button>
                            </div>
                          ))}
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addOption(index)}
                            className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 mt-2"
                          >
                            <FiPlus className="w-4 h-4" />
                            Add Option
                          </motion.button>
                        </div>
                      )}

                      {/* Answer for Q&A */}
                      {q.type === "qa" && (
                        <div>
                          <NormalInputs
                            label="Correct Answer"
                            placeholder="Enter the correct answer..."
                            value={q.correctAnswer}
                            setValue={(v) =>
                              handleQuestionChange(index, "correctAnswer", v)
                            }
                            className="bg-white/70 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Empty State */}
              {quizObj.questions.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50/50"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <FileQuestion className="text-white w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    No Questions Yet
                  </h3>
                  <p className="text-gray-600">
                    {isEditMode ? 'Update your quiz by adding questions' : 'Start building your quiz by adding questions'}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 pt-6 border-t border-gray-200/50"
            >
              <motion.button
                type="submit"
                disabled={isSubmitting || quizObj.questions.length === 0 || !quizObj.classId}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transform shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{isEditMode ? 'Updating Quiz...' : 'Creating Quiz...'}</span>
                  </>
                ) : (
                  <>
                    <FiSave className="text-xl" />
                    <span className="text-lg">{isEditMode ? 'Update Quiz' : 'Save Quiz'}</span>
                  </>
                )}
              </motion.button>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.back()}
                className="px-8 py-4 bg-gray-500/80 text-white font-semibold rounded-2xl hover:bg-gray-600/80 backdrop-blur-sm transition-all duration-300 flex items-center gap-2"
              >
                <FiX className="text-lg" />
                Cancel
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QuizForm;