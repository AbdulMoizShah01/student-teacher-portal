"use client";

import { useEffect } from "react";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useQuizzes } from "@/hooks/useQuizzes";
import { shallowEqual, useSelector } from "react-redux";

const StudentSubmissions = () => {
  const { submissions} = useSubmissions();
  const currentUser=useSelector((s)=>s?.activeUser, shallowEqual);
  const { quizzes } = useQuizzes();



  const studentSubs = submissions.filter(
    (s) => s?.studentId === currentUser?._id
  );

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        My Quiz Submissions
      </h2>

      {studentSubs.length === 0 ? (
        <p>No quizzes submitted yet.</p>
      ) : (
        studentSubs.map((s) => {
          const quiz = quizzes?.find((q) => q?._id === s?.quizId);
          return (
            <div
              key={s?._id}
              className="border border-gray-300 rounded-xl p-4 mb-4 bg-gray-50"
            >
              <h3 className="font-semibold text-lg">{quiz?.title}</h3>
              <p className="mt-1 text-gray-600">
                Status:{" "}
                {s?.evaluated ? (
                  <span className="text-green-600 font-semibold">
                    Evaluated
                  </span>
                ) : (
                  <span className="text-yellow-600">Pending</span>
                )}
              </p>
              {s.evaluated && (
                <p className="mt-2 font-semibold text-blue-600">
                  Marks: {s?.marks}
                </p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default StudentSubmissions;
