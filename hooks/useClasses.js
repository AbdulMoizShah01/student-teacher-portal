"use client";

import { useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setClasses } from "@/redux/actions";
import { addToArrayField, createUniqueId, saveData } from "@/utils";

export const useClasses = () => {
  const classes = useSelector((state) => state?.classes || [], shallowEqual);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addClass = async (classObj) => {
    try {
      setLoading(true);
      setError(null);

      const newClass = { ...classObj, _id: createUniqueId() };
      await saveData("classes", newClass);

      const updatedClasses = [...classes, newClass];
      dispatch(setClasses(updatedClasses));
      await Promise.all(
        classObj?.courses?.map(async (courseId) => {
          await addToArrayField("courses", _id, "classIds", classObj?._id);
        })
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

  const deleteClass = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const filtered = classes.filter((cls) => cls._id !== id);
      await saveData("classes", null, id, "delete");
      dispatch(setClasses(filtered));
    } catch (err) {
      console.error("Error deleting class:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    classes,
    addClass,
    updateClass,
    deleteClass,
    loading,
    error,
  };
};
