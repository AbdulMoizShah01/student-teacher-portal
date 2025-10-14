"use client";

import { useEffect, useState } from "react";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useQuizzes } from "@/hooks/useQuizzes";
import NormalInputs from "../inputs/NormalInputs";
import { toast } from "react-toastify";

const EvaluateSubmissions = () => {
  const { submissions, updateMarks } = useSubmissions();
  const { quizzes } = useQuizzes();
  const [selected, setSelected] = useState(null);
  const [marks, setMarks] = useState("");


  const handleEvaluate = async (submissionId) => {
    await updateMarks(submissionId, marks);
    toast.success("Marks updated successfully ✅", { theme: "colored" });
    setSelected(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Submissions</h2>

      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        submissions.map((sub) => {
          const quiz = quizzes.find((q) => q?._id === sub?.quizId);
          return (
            <div
              key={sub?._id}
              className="border border-gray-300 rounded-xl p-4 mb-4 bg-white shadow"
            >
              <h3 className="font-semibold text-lg">
                {sub?.studentName} - {quiz?.title}
              </h3>

              <button
                className="text-blue-600 mt-2"
                onClick={() => setSelected(selected === sub?._id ? null : sub?._id)}
              >
                {selected === sub?._id ? "Hide Details" : "View Details"}
              </button>

              {selected === sub?._id && (
                <div className="mt-3 space-y-4">
                  {sub?.answers.map((ans, i) => (
                    <div key={i} className="bg-gray-50 rounded p-3">
                      <p className="font-semibold">
                        {i + 1}. {ans?.question}
                      </p>
                      <p>
                        <span className="text-gray-600">Student Answer:</span>{" "}
                        {ans.answer}
                      </p>
                      {ans.correctAnswer && (
                        <p className="text-green-600">
                          Correct: {ans.correctAnswer}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center gap-3 mt-3">
                    <NormalInputs
                      label="Marks"
                      placeholder="Enter marks"
                      type="number"
                      value={marks}
                      setValue={setMarks}
                    />
                    <button
                      onClick={() => handleEvaluate(sub?._id)}
                      className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default EvaluateSubmissions;
