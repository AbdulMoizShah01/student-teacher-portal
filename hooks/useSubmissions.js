"use client";

import { saveData, getAllOfCollection } from "@/utils";
import { createUniqueId } from "@/utils";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setSubmissions } from "@/redux/actions";

export const useSubmissions = () => {
  const submissions = useSelector((s) => s?.submissions, shallowEqual);
  const dispatch = useDispatch();

  const addSubmission = async (submissionObj) => {
    const newSub = { ...submissionObj, _id: createUniqueId(), evaluated: false };
    await saveData("submissions", newSub);
    dispatch(setSubmissions([...submissions, newSub]));
    return true;
  };

  const updateMarks = async (submissionId, marks) => {
    const updated = submissions.map((s) =>
      s._id === submissionId ? { ...s, marks, evaluated: true } : s
    );
    await saveData("submissions", {
      ...updated.find((s) => s._id === submissionId),
    });
    dispatch(setSubmissions(updated));
  };


  return { submissions, addSubmission, updateMarks };
};
