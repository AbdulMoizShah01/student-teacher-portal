"use client"
import { setUsers } from "@/redux/actions";
import { shallowEqual, useSelector } from "react-redux";

export const useUsers = () => {
  const users = useSelector((s) => s?.users??[],shallowEqual);
  const students = users.filter((u) => u?.role === "student");
  const teachers = users.filter((u) => u?.role === "teacher");

  const addUser = async (userObj) => {
    try {
      setLoading(true);
      setError(null);

      const newUser = { ...userObj, _id: createUniqueId() };
      await saveData("user", newUser);

      const updatedUser = [...users, newUser];
      dispatch(setUsers(updatedUser));
      await Promise.all(
        userObj?.courses?.map(async (courseId) => {
          await addToArrayField("courses", courseId, "studentIds", userObj?._id);
        })
      );

      return newUser;
    } catch (err) {
      console.error("Error adding user:", err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };




  return {users, teachers, students ,addUser};
};

