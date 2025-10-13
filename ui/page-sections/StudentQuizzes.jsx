"use client";

import { useRouter } from "next/navigation";
import { useQuizzes } from "@/hooks/useQuizzes";
import { motion } from "framer-motion";

const StudentQuizzes = () => {
  const router = useRouter();
  const { quizzes, loading } = useQuizzes();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <p className="text-gray-600 text-lg animate-pulse">
          Loading quizzes...
        </p>
      </div>
    );
  }

  if (!quizzes?.length) {
    return (
      <div className="flex justify-center items-center h-80">
        <p className="text-gray-500 text-lg">No quizzes available yet.</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Available Quizzes
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz, index) => (
          <motion.div
            key={quiz._id || quiz.id || index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white shadow-md rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="p-6 flex flex-col justify-between h-full">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {quiz.title || "Untitled Quiz"}
                </h2>
                <p className="text-gray-600 mt-1 text-sm">
                  {quiz.description || "No description provided"}
                </p>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    <strong>Questions:</strong> {quiz?.questions?.length || 0}
                  </p>
                  {quiz.className && (
                    <p className="text-sm text-gray-500">
                      <strong>Class:</strong> {quiz.className}
                    </p>
                  )}
                  {quiz.teacherName && (
                    <p className="text-sm text-gray-500">
                      <strong>Teacher:</strong> {quiz.teacherName}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() =>
                    router.push(`/student/quizzes/attempt/${quiz._id || quiz.id}`)
                  }
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:scale-105 transition-transform duration-300 shadow-md"
                >
                  Attempt Quiz
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StudentQuizzes;
