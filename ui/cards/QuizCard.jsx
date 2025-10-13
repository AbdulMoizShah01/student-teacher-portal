"use client";

import { useRouter } from "next/navigation";
import { useQuizzes } from "@/hooks/useQuizzes";
import { Loader2, FileQuestion } from "lucide-react";
import { roleBasedUrl } from "@/config";

const TeacherQuizList = () => {
  const router = useRouter();
  const { quizzes, loading } = useQuizzes(); // ✅ from Redux via custom hook

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-72 text-gray-500">
        <Loader2 className="animate-spin w-7 h-7 mb-3 text-blue-500" />
        <p className="text-sm">Loading your quizzes...</p>
      </div>
    );

  if (!quizzes || quizzes.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-72">
        <FileQuestion className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-600 text-lg font-medium">No quizzes created yet</p>
        <p className="text-gray-400 text-sm mt-1">
          Click “Add Quiz” to create one.
        </p>
      </div>
    );

  return (
    <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {quizzes.map((quiz) => (
        <div
          key={quiz._id}
          className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 truncate">
              {quiz.title || "Untitled Quiz"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Class:{" "}
              <span className="font-medium">
                {quiz.className || quiz.classId || "N/A"}
              </span>
            </p>
          </div>

          {/* Body */}
          <div className="p-5 flex-1">
            <p className="text-sm text-gray-600">
              Total Questions:{" "}
              <span className="font-semibold text-gray-800">
                {quiz.questions?.length || 0}
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Created on{" "}
              {quiz.createdAt
                ? new Date(quiz.createdAt).toLocaleDateString()
                : "—"}
            </p>
          </div>

          {/* Actions */}
          <div className="px-5 pb-5 flex gap-3 mt-auto">
            <button
              onClick={() => router.push(roleBasedUrl(`/quizzes/${quiz?._id}`))}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-medium text-sm hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-md"
            >
              View Quiz
            </button>

            <button
              onClick={() => router.push(`/submissions/${quiz._id}`)}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 transition-all duration-200"
            >
              Submissions
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeacherQuizList;
