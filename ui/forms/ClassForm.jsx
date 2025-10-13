"use client";

import { useEffect, useState } from "react";
import NormalInputs from "../inputs/NormalInputs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import StandardModal from "../modals/StandardModal";
import { addToArrayField,getItemsbyKey } from "@/utils";
import { useCourses } from "@/hooks/useCourses";
import MultipleCheckboxInput from "../inputs/MultipleCheckboxInput";
import { useUsers } from "@/hooks/useUsers";

const ClassForm = ({ name, onSubmit, prevState, classArray }) => {
  const [classObj, setClassObj] = useState({
    name: "",
    courses: [],
    students: [],
  });
  const { courses } = useCourses();
  const { students } = useUsers();
  const [courseSelectionOpen, setCourseSelectionOpen] = useState();
  const [studentSelectionOpen, setStudentSelectionOpen] = useState();

  const router = useRouter();

  useEffect(() => {
    if (prevState && JSON.stringify(prevState) !== JSON.stringify(classObj)) {
      setClassObj(prevState);
    }
  }, [prevState]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let obj = {
        ...classObj,
        courses: classObj?.courses?.map((item) => item?._id),
      };
      if (onSubmit) {
        await onSubmit(obj);
      }
      toast.success("Class has been added successfully 🎉", {
        theme: "colored",
      });

      setTimeout(() => {
        router.back();
      }, 1200);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while adding the class.", {
        theme: "colored",
      });
    }
  };

  const handleAddClass = () => {};




  const removeStudent = (index) => {
    setClassObj((prev) => ({
      ...prev,
      students: prev.students.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">{name}</h2>
          <p className="text-gray-600 mt-2">
            Manage class details and assignments
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <NormalInputs
            type={"text"}
            label={"Class Name"}
            placeholder={"Enter class name (e.g., Grade 6 Mathematics)"}
            value={classObj?.name}
            setValue={(v) => setClassObj((prev) => ({ ...prev, name: v }))}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700">
                Courses
              </label>

              <button
                type="button"
                onClick={() => setCourseSelectionOpen(true)}
                className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Course
              </button>
            </div>

            <div className="space-y-0 flex gap-3 ">
              {classObj?.courses?.map((course, index) => (
                <div
                  key={index}
                  className=" bg-pink-300 max-w-[100px] text-center rounded-full px-3 py-2 "
                >
                  {course?.title}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700">
                Students
              </label>
              <button
                type="button"
                onClick={() => setStudentSelectionOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Student
              </button>
            </div>

            <div className="flex gap-3 space-y-0 ">
              {classObj.students?.map((student, index) => (
                 
                 <div
                  key={index}
                  className=" bg-pink-300 max-w-[100px] text-center rounded-full px-3 py-2 "
                >
                  {student?.name}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                handleAddClass();
              }}
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Save Class
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-4 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* course list modal */}
      <StandardModal
        isOpen={courseSelectionOpen}
        setisOpen={setCourseSelectionOpen}
      >
        <div className="p-3 ">
          <h5 className="text-lg font-semibold mb-2">Select courses </h5>
          <p className="mb-3">Choose from given courses</p>
          <MultipleCheckboxInput
            items={courses}
            setValue={(v) => setClassObj((prev) => ({ ...prev, courses: v }))}
          />
          <div className="text-end">
            <button
              onClick={() => setCourseSelectionOpen(false)}
              className="bg-blue-700 text-white rounded-full px-3 py-2 cursor-pointer"
            >
              Save changes
            </button>
          </div>
        </div>
      </StandardModal>
      {/* ----------------- */}

      {/* Student list modal */}
      <StandardModal
        isOpen={studentSelectionOpen}
        setisOpen={setStudentSelectionOpen}
      >
        <div className="p-3 ">
          <h5 className="text-lg font-semibold mb-2">Select Students </h5>
          <p className="mb-3">Choose from given courses</p>
          <MultipleCheckboxInput
            items={students.map((s) => ({
              ...s,
              title: s.name, // or label: s.name depending on how your input expects it
            }))}
           
            setValue={(v) => setClassObj((prev) => ({ ...prev, students: v }))}
          />
          <div className="text-end">
            <button
              onClick={() => setStudentSelectionOpen(false)}
              className="bg-blue-700 text-white rounded-full px-3 py-2 cursor-pointer"
            >
              Save changes
            </button>
          </div>
        </div>
      </StandardModal>
      {/* ----------------- */}
    </div>
  );
};

export default ClassForm;
