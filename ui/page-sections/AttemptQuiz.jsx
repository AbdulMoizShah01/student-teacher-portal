"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useQuizzes } from "@/hooks/useQuizzes";
import { useSubmissions } from "@/hooks/useSubmissions";
import NormalInputs from "../inputs/NormalInputs"
import { shallowEqual, useSelector } from "react-redux";

const AttemptQuiz = (onSubmit) => {
  const router = useRouter();
  const { id: quizId } = useParams();
  const { quizzes, loading } = useQuizzes();
  const { addSubmission } = useSubmissions();
  const currentUser  = useSelector((s)=>s?.activeUser,shallowEqual);

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (!loading && quizzes?.length > 0) {
      const q = quizzes?.find((qz) => qz?._id === quizId || qz?.id === quizId);
      if (q) {
        setQuiz(q);
        setAnswers(
          q.questions.map((ques) => ({
            questionId: ques?._id || Math.random().toString(),
            question: ques?.question,
            type: ques?.type,
            answer: "",
            correctAnswer: ques?.correctAnswer ?? null,
          }))
        );
      }
    }
  }, [quizId, quizzes, loading]);

  const handleAnswer = (index, value) => {
    const updated = [...answers];
    updated[index].answer = value;
    setAnswers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSubmission({
        quizId: quiz?._id || quiz?.id,
        studentId: currentUser?._id,
        studentName: currentUser?.name,
        answers,
      });
      toast.success("Quiz submitted successfully 🎉", { theme: "colored" });
      router.push("/student/submissions");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit quiz", { theme: "colored" });
    }
  };

  if (loading)
    return <p className="text-center p-6 animate-pulse">Loading quizzes...</p>;
  if (!quiz) return <p className="text-center p-6">Quiz not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{quiz?.title}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {quiz.questions?.map((q, i) => (
          <div key={i} className="border p-4 rounded-lg bg-gray-50">
            <p className="font-semibold text-gray-800 mb-2">
              {i + 1}?. {q.question}
            </p>

            {q?.type === "qa" && (
              <NormalInputs
                placeholder="Type your answer"
                value={answers[i]?.answer}
                setValue={(v) => handleAnswer(i, v)}
              />
            )}

            {(q?.type === "mcq" || q?.type === "truefalse") &&
              q?.options?.map((opt, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`q-${i}`}
                    checked={answers[i]?.answer === opt}
                    onChange={() => handleAnswer(i, opt)}
                    className="cursor-pointer"
                  />
                  <span>{opt}</span>
                </label>
              ))}
          </div>
        ))}

        <div className="text-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Submit Quiz
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttemptQuiz;
