"use client";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setQuizzes } from "@/redux/actions";
import { createUniqueId, saveData, deleteData } from "@/utils";

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

  const updateQuiz = async (updatedQuiz) => {
    try {
      await saveData("quizzes", updatedQuiz);
      const updated = (quizzes || []).map((q) => (q?._id === updatedQuiz?._id ? updatedQuiz : q));
      dispatch(setQuizzes(updated));
      return true;
    } catch (error) {
      console.error("Error updating quiz:", error);
      throw error;
    }
  };

  const removeQuiz = async (quizToRemove) => {
    try {
      await deleteData("quizzes", quizToRemove);
      const filtered = (quizzes || []).filter((q) => q?._id !== quizToRemove?._id);
      dispatch(setQuizzes(filtered));
      return true;
    } catch (error) {
      console.error("Error deleting quiz:", error);
      throw error;
    }
  };

  return { quizzes, addQuiz, updateQuiz, removeQuiz };
};
