"use client";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setQuizzes } from "@/redux/actions";
import { createUniqueId, saveData } from "@/utils";

export const useQuizzes = () => {
  const quizzes = useSelector((s) => s?.quizzes, shallowEqual);
  const dispatch = useDispatch();

  const addQuiz = async (quizObj) => {
    try {
      const newQuiz = { ...quizObj, _id: createUniqueId() };
      await saveData("quizzes", newQuiz);
      dispatch(setQuizzes([...quizzes, newQuiz]));
      return true;
    } catch (error) {
      console.error("Error adding quiz:", error);
      throw error;
    }
  };

  return { quizzes, addQuiz };
};
