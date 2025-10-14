"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useUsers } from "@/hooks/useUsers";
import { useQuizzes } from "@/hooks/useQuizzes";
import { useClasses } from "@/hooks/useClasses";

const ViewQuizSubmissions = () => {
  const { quizId } = useParams();
  const router = useRouter();

  const { submissions} =useSubmissions();
   const {users}=useUsers();
   const {quizzes}=useQuizzes(); 
   const{classes } = useClasses();
   console.log("quizzzzeeeeeessss.................",quizzes)

  const quiz = quizzes?.find((q) => q?._id === (quizId));
  const quizSubmissions = submissions?.filter(
    (s) => s?.quizId === quizId
  );

  console.log("quizId from params:", quizId);
console.log("quiz IDs in store:", quizzes.map(q => q._id));

  console.log("quizzzz..................",quiz);

   if (!quiz)
    return (
      <div className="flex flex-col items-center justify-center h-72 text-gray-500">
        <ClipboardList className="w-12 h-12 mb-3 text-gray-400" />
        <p className="text-lg font-medium">Quiz not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Go Back
        </button>
      </div>
    );

  if (!quizSubmissions || quizSubmissions.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-72 text-gray-500">
        <ClipboardList className="w-12 h-12 mb-3 text-gray-400" />
        <p className="text-lg font-medium">No student has submitted this quiz yet.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
 
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Submissions for:{" "}
            <span className="text-blue-600">{quiz?.title}</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Total Submissions: {quizSubmissions.length}
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizSubmissions.map((sub) => {
          const student = users?.find((u) => u?._id === sub?.studentId);
          const classInfo = classes?.find((c) => c?._id === sub?.classId);

          return (
            <div
              key={sub?._id}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-gray-800">
                  {student?.name || "Unknown Student"}
                </h2>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    sub.score / sub.total >= 0.7
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {sub.score}/{sub.total}
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-1">
                Class: {classInfo?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Email: {student?.email || "N/A"}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                Submitted on:{" "}
                {sub.submittedAt
                  ? new Date(sub.submittedAt).toLocaleString()
                  : "—"}
              </p>

           
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewQuizSubmissions;
