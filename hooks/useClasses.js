"use client";

import { useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setClasses } from "@/redux/actions";
import { addToArrayField, createUniqueId, saveData, deleteData } from "@/utils";

export const useClasses = () => {
  const classes = useSelector((state) => state?.classes || [], shallowEqual);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addClass = async (classObj) => {
    try {
      setLoading(true);
      setError(null);
      const newClassId=createUniqueId()
      const newClass = { ...classObj, _id: newClassId };
      await saveData("classes", newClass);

      const updatedClasses = [...classes, newClass];
      dispatch(setClasses(updatedClasses));
      await Promise.all(
  (classObj?.courses ?? []).map((courseId) =>
    addToArrayField("courses", courseId, "classIds", newClassId)
  )
);

await Promise.all(
  (classObj?.students ?? []).map((userId) =>
    addToArrayField("users", userId, "classIds", newClassId)
  )
);


      return newClass;
    } catch (err) {
      console.error("Error adding class:", err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateClass = async (updatedObj) => {
    try {
      setLoading(true);
      setError(null);

      const updatedClasses = classes.map((cls) =>
        cls._id === updatedObj._id ? updatedObj : cls
      );

      await saveData("classes", updatedObj);
      dispatch(setClasses(updatedClasses));
      return updatedObj;
    } catch (err) {
      console.error("Error updating class:", err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeClass = async (classToRemove, index) => {
    await deleteData("classes", classToRemove);
    let array = [...classes]?.filter((c) => c?._id !== classToRemove?._id);
    dispatch(setClasses(array));
  };

  return {
    classes,
    addClass,
    updateClass,
    removeClass,
    loading,
    error,
  };
};
