"use client";
import { useEffect, useState } from "react";
import NormalInputs from "../inputs/NormalInputs";
import { useRouter } from "next/navigation";
import StandardModal from "../modals/StandardModal";
import MultipleCheckboxInput from "../inputs/MultipleCheckboxInput";
import { useUsers } from "@/hooks/useUsers";
import { toast } from "react-toastify";

const CourseForm = ({ name, onSubmit, prevState, courseArray }) => {
  const { teachers } = useUsers();
 
  const [courseObj, setCourseObj] = useState({
    name: "",
    teachers: [],
    classes: [],
  });

  const router = useRouter();
  const [teacherSelectionOpen, setTeacherSelectionOpen] = useState();

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        let obj = {
          ...courseObj,
          teachers: courseObj?.teachers?.map((item) => item?._id),
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

    const handleAddCourse = () => {};

  useEffect(() => {
    if (prevState) {
      setCourseObj({ ...prevState });
    }
  }, [prevState]);


  const handleClassChange = (index, value) => {
    const updatedClasses = [...courseObj.classes];
    updatedClasses[index] = value;
    setCourseObj((prev) => ({ ...prev, classes: updatedClasses }));
  };

  const addClass = () => {
    setCourseObj((prev) => ({
      ...prev,
      classes: [...prev.classes, ""],
    }));
  };

  const removeClass = (index) => {
    setCourseObj((prev) => ({
      ...prev,
      classes: prev.classes.filter((_, i) => i !== index),
    }));
  };

  const handleStudentChange = (index, value) => {
    const updatedStudents = [...courseObj.students];
    updatedStudents[index] = value;
    setCourseObj((prev) => ({ ...prev, students: updatedStudents }));
  };

  const addStudent = () => {
    setCourseObj((prev) => ({
      ...prev,
      students: [...prev.students, ""],
    }));
  };

  const removeStudent = (index) => {
    setCourseObj((prev) => ({
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
            Manage course details and assignments
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <NormalInputs
            type={"text"}
            label={"Course Name"}
            placeholder={"Enter course name (e.g., Mathematics 101)"}
            value={courseObj?.name}
            setValue={(v) => setCourseObj((prev) => ({ ...prev, name: v }))}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700">
                Assigned Teacher
              </label>
              <button
                type="button"
                onClick={()=>setTeacherSelectionOpen(true)}
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
                Assign
              </button>
            </div>

                   <div className="flex gap-3 space-y-0 ">
              {courseObj.teachers?.map((teacher, index) => (
                 
                 <div
                  key={index}
                  className=" bg-pink-300 max-w-[100px] text-center rounded-full px-3 py-2 "
                >
                  {teacher?.name}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              onClick={handleAddCourse}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Save Course
            </button>
            <button
              onClick={() => router.back()}
              type="button"
              className="px-8 py-4 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      {/* Teacher list modal */}
      <StandardModal
        isOpen={teacherSelectionOpen}
        setisOpen={setTeacherSelectionOpen}
      >
        <div className="p-3 ">
          <h5 className="text-lg font-semibold mb-2">Select Teacher </h5>
          <p className="mb-3">Choose from given Teacher</p>
          <MultipleCheckboxInput
            items={teachers.map((s) => ({
              ...s,
              title: s.name, // or label: s.name depending on how your input expects it
            }))}
            setValue={(v) => setCourseObj((prev) => ({ ...prev, teachers: v }))}
          />
          <div className="text-end">
            <button
              onClick={() => setTeacherSelectionOpen(false)}
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

export default CourseForm;
