"use client";

import { useQuizzes } from "@/hooks/useQuizzes";
import { useParams } from "next/navigation";

const ViewQuiz = () => {
  const { id } = useParams();
  const {quizzes}=useQuizzes();
  const quiz = quizzes.find((q) => q?._id === id);

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 text-lg">
        Quiz not found 😢
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{quiz.title}</h1>
      <p className="text-gray-600 mb-6">{quiz.description}</p>

      <div className="space-y-6">
        {quiz.questions?.map((q, index) => (
          <div
            key={q?._id || index}
            className="p-5 border border-gray-200 rounded-xl bg-gray-50 shadow-sm"
          >
            <h2 className="font-semibold text-gray-800 mb-2">
              {index + 1}. {q?.question}
            </h2>
            <ul className="space-y-2">
              {q?.options?.map?.((opt, i) => (
                <li
                  key={i}
                  className={`px-4 py-2 rounded-lg border ${
                    q?.correctOption === i
                      ? "bg-green-100 border-green-400 text-green-800"
                      : "bg-white border-gray-200 text-gray-700"
                  }`}
                >
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => window.history.back()}
          className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewQuiz;
