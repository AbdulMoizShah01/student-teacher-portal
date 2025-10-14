"use client";

import { useRouter } from "next/navigation";
import { useQuizzes } from "@/hooks/useQuizzes";
import { useClasses } from "@/hooks/useClasses";
import { useCourses } from "@/hooks/useCourses";
import { shallowEqual, useSelector } from "react-redux";
import { Loader2, FileQuestion } from "lucide-react";
import { roleBasedUrl } from "@/config";

const TeacherQuizList = () => {
  const router = useRouter();
  const { quizzes, loading } = useQuizzes();
  const { classes } = useClasses();
  const { courses } = useCourses();
  const currentUser = useSelector((s) => s?.activeUser, shallowEqual);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-72 text-gray-500">
        <Loader2 className="animate-spin w-7 h-7 mb-3 text-blue-500" />
        <p className="text-sm">Loading your quizzes...</p>
      </div>
    );

  // Map classId to class object for grouping
  const classIdToClass = new Map((classes || []).map((c) => [c?._id, c]));

  // Build courseId set for teacher
  const myCourseIds = new Set(
    (courses || [])
      .filter((c) => Array.isArray(c?.teachers) && c.teachers.includes(currentUser?._id))
      .map((c) => c?._id)
  );

  // Determine visible quizzes based on role
  let eligibleQuizzes = [];
  if (currentUser?.role === "admin") {
    // Admin can view all quizzes
    eligibleQuizzes = quizzes || [];
  } else {
    // Teacher: only own quizzes in classes tied to assigned courses
    const myQuizzes = (quizzes || []).filter((q) => q?.teacherId === currentUser?._id);
    eligibleQuizzes = myQuizzes.filter((q) => {
      const cls = classIdToClass.get(q?.classId);
      return Array.isArray(cls?.courses) && cls.courses.some((cid) => myCourseIds.has(cid));
    });
  }

  // Group by classId
  const groupedByClass = eligibleQuizzes.reduce((acc, q) => {
    const key = q?.classId || "unknown";
    acc[key] = acc[key] || [];
    acc[key].push(q);
    return acc;
  }, {});

  if (!eligibleQuizzes || eligibleQuizzes.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-72">
        <FileQuestion className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-600 text-lg font-medium">No eligible quizzes</p>
        <p className="text-gray-400 text-sm mt-1">
          Create a quiz for one of your assigned classes.
        </p>
      </div>
    );

  return (
    <div className="p-6 space-y-8">
      {Object.entries(groupedByClass).map(([classId, list]) => {
        const cls = classIdToClass.get(classId);
        return (
          <div key={classId}>
            <h2 className="text-xl font-bold mb-3">Class: {cls?.name || classId}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {list.map((quiz) => (
                <div
                  key={quiz._id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <div className="p-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 truncate">
                      {quiz.title || "Untitled Quiz"}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      {quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : "—"}
                    </p>
                  </div>
                  <div className="p-5 flex-1">
                    <p className="text-sm text-gray-600">
                      Total Questions: <span className="font-semibold text-gray-800">{quiz.questions?.length || 0}</span>
                    </p>
                  </div>
                  <div className="px-5 pb-5 flex gap-3 mt-auto">
                    <button
                      onClick={() => router.push(roleBasedUrl(`/quizzes/${quiz?._id}`))}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-medium text-sm hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-md"
                    >
                      View Quiz
                    </button>
                    {currentUser?.role === "teacher" && quiz?.teacherId === currentUser?._id && (
                      <>
                        <button
                          onClick={() => router.push(roleBasedUrl(`/quizzes/edit?id=${quiz?._id}`))}
                          className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 transition-all duration-200"
                        >
                          Edit
                        </button>
                        <DeleteQuizButton quiz={quiz} />
                      </>
                    )}
                    <button
                      onClick={() => router.push(roleBasedUrl(`/quizzes/submissions/${quiz._id}`))}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 transition-all duration-200"
                    >
                      Submissions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DeleteQuizButton = ({ quiz }) => {
  const { removeQuiz } = useQuizzes();
  return (
    <button
      onClick={() => removeQuiz(quiz)}
      className="flex-1 border border-red-300 text-red-600 py-2 rounded-lg font-medium text-sm hover:bg-red-50 transition-all duration-200"
    >
      Delete
    </button>
  );
};

export default TeacherQuizList;
