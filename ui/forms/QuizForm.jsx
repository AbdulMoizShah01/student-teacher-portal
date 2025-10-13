"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useClasses } from "@/hooks/useClasses";
import { useQuizzes } from "@/hooks/useQuizzes";
import StandardModal from "../modals/StandardModal";
import NormalInputs from "../inputs/NormalInputs";
import { useSelector, shallowEqual } from "react-redux";

const QuizForm = () => {
  const router = useRouter();
  const { classes } = useClasses();
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
    <div className="flex flex-col items-center p-6">
      {/* Add Quiz Button */}
      <button
        onClick={handleAddQuizClick}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
      >
        + Add Quiz
      </button>

      {/* Class Selection Modal */}
      <StandardModal isOpen={classSelectionOpen} setisOpen={setClassSelectionOpen}>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3">Select Class</h3>
          <div className="flex flex-col gap-3">
            {classes?.map((cls) => (
              <button
                key={cls._id}
                onClick={() => handleClassSelect(cls._id)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
              >
                {cls.name}
              </button>
            ))}
          </div>
        </div>
      </StandardModal>

      {showQuizForm && (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl mt-6 bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Quiz</h2>

          <NormalInputs
            label="Quiz Title"
            placeholder="Enter quiz title"
            value={quizObj.title}
            setValue={(v) => setQuizObj((p) => ({ ...p, title: v }))}
          />

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Questions</h3>
            {quizObj.questions.map((q, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-xl p-4 mb-4 bg-gray-50"
              >
                <div className="flex gap-3 mb-3">
                  <select
                    value={q.type}
                    onChange={(e) =>
                      handleQuestionChange(index, "type", e.target.value)
                    }
                    className="border border-gray-300 rounded-lg p-2 flex-1"
                  >
                    <option value="">Select Question Type</option>
                    <option value="qa">Q/A</option>
                    <option value="mcq">MCQ</option>
                    <option value="truefalse">True/False</option>
                  </select>
                </div>

                <NormalInputs
                  label="Question"
                  placeholder="Enter question text"
                  value={q.question}
                  setValue={(v) => handleQuestionChange(index, "question", v)}
                />

                {(q.type === "mcq" || q.type === "truefalse") && (
                  <div className="mt-3 space-y-2">
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${index}`}
                          checked={q.correctAnswer === opt}
                          onChange={() =>
                            handleQuestionChange(index, "correctAnswer", opt)
                          }
                          className="cursor-pointer"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) =>
                            handleOptionChange(index, optIndex, e.target.value)
                          }
                          placeholder={`Option ${optIndex + 1}`}
                          className="border border-gray-300 rounded-lg p-2 flex-1"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption(index)}
                      className="text-blue-600 text-sm font-semibold hover:underline mt-2"
                    >
                      + Add Option
                    </button>

                    {q.type === "truefalse" && q.options.length === 0 && (
                      <div className="mt-2 flex gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleQuestionChange(index, "options", ["True", "False"])
                          }
                          className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                          Generate True/False Options
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {q.type === "qa" && (
                  <NormalInputs
                    label="Answer"
                    placeholder="Enter correct answer"
                    value={q.correctAnswer}
                    setValue={(v) =>
                      handleQuestionChange(index, "correctAnswer", v)
                    }
                  />
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="mt-2 px-5 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg shadow hover:scale-105 transition-all"
            >
              + Add Question
            </button>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Save Quiz
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default QuizForm;
