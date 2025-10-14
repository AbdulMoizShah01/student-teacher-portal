"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useClasses } from "@/hooks/useClasses";
import { useCourses } from "@/hooks/useCourses";
import { useQuizzes } from "@/hooks/useQuizzes";
import StandardModal from "../modals/StandardModal";
import NormalInputs from "../inputs/NormalInputs";
import { useSelector, shallowEqual } from "react-redux";

const QuizForm = () => {
  const router = useRouter();
  const { classes } = useClasses();
  const { courses } = useCourses();
  const { addQuiz } = useQuizzes();

  const currentUser = useSelector((state) => state?.activeUser, shallowEqual);

  const [quizObj, setQuizObj] = useState({
    title: "",
    classId: "",
    teacherId: "",
    questions: [],
  });

  const [classSelectionOpen, setClassSelectionOpen] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);

  const handleAddQuizClick = () => setClassSelectionOpen(true);

  // Build set of course IDs assigned to this teacher
  const myCourseIds = new Set(
    (courses || [])
      .filter((c) => Array.isArray(c?.teachers) && c.teachers.includes(currentUser?._id))
      .map((c) => c?._id)
  );

  const filteredClasses = (classes || []).filter(
    (cls) => Array.isArray(cls?.courses) && cls.courses.some((cid) => myCourseIds.has(cid))
  );

  const handleClassSelect = (id) => {
    setQuizObj((prev) => ({
      ...prev,
      classId: id,
      teacherId: currentUser?._id || "",
    }));
    setClassSelectionOpen(false);
    setShowQuizForm(true);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalQuiz = { ...quizObj, teacherId: currentUser?._id || "" };
      await addQuiz(finalQuiz);
      toast.success("Quiz added successfully 🎉", { theme: "colored" });
      router.back();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add quiz", { theme: "colored" });
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <button
        onClick={handleAddQuizClick}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Create New Quiz
      </button>

      <StandardModal
        isOpen={classSelectionOpen}
        setisOpen={setClassSelectionOpen}
      >
        <div className="p-6 bg-white rounded-2xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Select Class
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {filteredClasses?.map((cls) => (
              <button
                key={cls._id}
                onClick={() => handleClassSelect(cls._id)}
                className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-100 transform hover:scale-105 transition-all duration-200 shadow-sm"
              >
                <div className="text-left">
                  <h4 className="font-semibold text-gray-800 text-lg">
                    {cls.name}
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">
                    {cls.students?.length || 0} students
                  </p>
                  <p className="text-gray-600 text-sm">
                    {cls.courses?.length || 0} courses
                  </p>
                </div>
              </button>
            ))}
          </div>
          {(!filteredClasses || filteredClasses.length === 0) && (
            <div className="text-center py-8">
              <p className="text-gray-500">No eligible classes based on your assigned courses</p>
            </div>
          )}
        </div>
      </StandardModal>

      {showQuizForm && (
        <div className="w-full max-w-4xl mt-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <h2 className="text-3xl font-bold text-white">Create New Quiz</h2>
              <p className="text-blue-100 mt-2">
                Build engaging quizzes for your students
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="mb-8">
                <NormalInputs
                  label="Quiz Title"
                  placeholder="Enter an engaging quiz title"
                  value={quizObj.title}
                  setValue={(v) => setQuizObj((p) => ({ ...p, title: v }))}
                  className="text-lg"
                />
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Questions
                  </h3>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 flex items-center gap-2 shadow-lg"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Question
                  </button>
                </div>

                <div className="space-y-6">
                  {quizObj.questions.map((q, index) => (
                    <div
                      key={index}
                      className="border-2 border-gray-200 rounded-2xl p-6 bg-white hover:border-blue-300 transition-all duration-200 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-semibold text-gray-800">
                          Question {index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeQuestion(index)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

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
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          >
                            <option value="">Select Type</option>
                            <option value="qa">Question & Answer</option>
                            <option value="mcq">Multiple Choice</option>
                            <option value="truefalse">True/False</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <NormalInputs
                          label="Question Text"
                          placeholder="Enter your question here..."
                          value={q.question}
                          setValue={(v) =>
                            handleQuestionChange(index, "question", v)
                          }
                        />
                      </div>

                      {(q.type === "mcq" || q.type === "truefalse") && (
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Options
                          </label>
                          {q.options.map((opt, optIndex) => (
                            <div
                              key={optIndex}
                              className="flex items-center gap-3"
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
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeOption(index, optIndex)}
                                className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addOption(index)}
                            className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 mt-2"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            Add Option
                          </button>

                          {q.type === "truefalse" && q.options.length === 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                handleQuestionChange(index, "options", [
                                  "True",
                                  "False",
                                ]);
                                handleQuestionChange(
                                  index,
                                  "correctAnswer",
                                  "True"
                                );
                              }}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-semibold mt-2"
                            >
                              Generate True/False Options
                            </button>
                          )}
                        </div>
                      )}

                      {q.type === "qa" && (
                        <div>
                          <NormalInputs
                            label="Correct Answer"
                            placeholder="Enter the correct answer..."
                            value={q.correctAnswer}
                            setValue={(v) =>
                              handleQuestionChange(index, "correctAnswer", v)
                            }
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {quizObj.questions.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
                    <svg
                      className="w-16 h-16 text-gray-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-gray-500 text-lg">
                      No questions added yet
                    </p>
                    <p className="text-gray-400 mt-1">
                      Start by adding your first question
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={quizObj.questions.length === 0}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Quiz
                </button>
                <button
                  type="button"
                  onClick={() => setShowQuizForm(false)}
                  className="px-8 py-4 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizForm;
