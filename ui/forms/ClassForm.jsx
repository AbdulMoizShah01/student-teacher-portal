"use client";

import { useEffect, useState } from "react";
import NormalInputs from "../inputs/NormalInputs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import StandardModal from "../inputs/NormalInputs";
import { addToArrayField, getItemsbyKey } from "@/utils";
import { useCourses } from "@/hooks/useCourses";
import MultipleCheckboxInput from "../inputs/MultipleCheckboxInput";
import { useUsers } from "@/hooks/useUsers";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiBook, 
  FiUsers, 
  FiUserPlus, 
  FiBookOpen, 
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
  FiArrowLeft,
  FiCheck
} from "react-icons/fi";

const ClassForm = ({ name, onSubmit, prevState, classArray }) => {
  const [classObj, setClassObj] = useState({
    name: "",
    courses: [],
    students: [],
  });
  const { courses } = useCourses();
  const { students } = useUsers();
  const [courseSelectionOpen, setCourseSelectionOpen] = useState(false);
  const [studentSelectionOpen, setStudentSelectionOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (prevState && JSON.stringify(prevState) !== JSON.stringify(classObj)) {
      setClassObj(prevState);
    }
  }, [prevState]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classObj.name.trim()) {
      toast.error("Please enter a class name", { theme: "colored" });
      return;
    }

    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddClass = () => {};

  const removeStudent = (index) => {
    setClassObj((prev) => ({
      ...prev,
      students: prev.students.filter((_, i) => i !== index),
    }));
  };

  const removeCourse = (index) => {
    setClassObj((prev) => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index),
    }));
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };

  const tagVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300"
          >
            <FiArrowLeft className="text-gray-700 text-xl" />
          </motion.button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {name || "Create Class"}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Manage class details, courses, and student assignments
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Class Name Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FiBook className="text-white text-lg" />
                  </div>
                  <label className="block text-lg font-semibold text-gray-800">
                    Class Name
                  </label>
                </div>
                <NormalInputs
                  type={"text"}
                  placeholder={"Enter class name (e.g., Grade 6 Mathematics)"}
                  value={classObj?.name}
                  setValue={(v) => setClassObj((prev) => ({ ...prev, name: v }))}
                  className="bg-white/70 border border-gray-200 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </motion.div>

              {/* Courses Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-2xl p-6 border border-blue-100/50"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FiBookOpen className="text-blue-600 text-lg" />
                    </div>
                    <div>
                      <label className="block text-lg font-semibold text-gray-800">
                        Course Assignments
                      </label>
                      <p className="text-gray-600 text-sm">
                        Select courses to include in this class
                      </p>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCourseSelectionOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transform shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                  >
                    <FiPlus className="text-lg" />
                    Add Courses
                  </motion.button>
                </div>

                {/* Selected Courses */}
                <div className="flex flex-wrap gap-3 min-h-[60px]">
                  <AnimatePresence>
                    {classObj?.courses?.map((course, index) => (
                      <motion.div
                        key={course?._id || index}
                        variants={tagVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="group relative"
                      >
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                          <span className="font-medium text-sm max-w-[120px] truncate">
                            {course?.title || course?.name}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => removeCourse(index)}
                            className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                          >
                            <FiX className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {(!classObj?.courses || classObj.courses.length === 0) && (
                    <div className="flex-1 flex items-center justify-center py-4">
                      <p className="text-gray-500 text-center">
                        No courses selected yet. Click "Add Courses" to get started.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Students Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-2xl p-6 border border-green-100/50"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <FiUsers className="text-green-600 text-lg" />
                    </div>
                    <div>
                      <label className="block text-lg font-semibold text-gray-800">
                        Student Enrollment
                      </label>
                      <p className="text-gray-600 text-sm">
                        Add students to this class
                      </p>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStudentSelectionOpen(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transform shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                  >
                    <FiUserPlus className="text-lg" />
                    Add Students
                  </motion.button>
                </div>

                {/* Selected Students */}
                <div className="flex flex-wrap gap-3 min-h-[60px]">
                  <AnimatePresence>
                    {classObj.students?.map((student, index) => (
                      <motion.div
                        key={student?._id || index}
                        variants={tagVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="group relative"
                      >
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                          <span className="font-medium text-sm max-w-[120px] truncate">
                            {student?.name}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => removeStudent(index)}
                            className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                          >
                            <FiX className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {(!classObj?.students || classObj.students.length === 0) && (
                    <div className="flex-1 flex items-center justify-center py-4">
                      <p className="text-gray-500 text-center">
                        No students enrolled yet. Click "Add Students" to get started.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-4 pt-6 border-t border-gray-200/50"
              >
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transform shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving Class...</span>
                    </>
                  ) : (
                    <>
                      <FiSave className="text-xl" />
                      <span className="text-lg">Save Class</span>
                    </>
                  )}
                </motion.button>
                
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.back()}
                  className="px-8 py-4 bg-gray-500/80 text-white font-semibold rounded-2xl hover:bg-gray-600/80 backdrop-blur-sm transition-all duration-300 flex items-center gap-2"
                >
                  <FiX className="text-lg" />
                  Cancel
                </motion.button>
              </motion.div>
            </form>
          </div>
        </div>
      </motion.div>

      {/* Course Selection Modal */}
      <AnimatePresence>
        {courseSelectionOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setCourseSelectionOpen(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <FiBookOpen className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Select Courses</h2>
                    <p className="text-blue-100">Choose courses for this class</p>
                  </div>
                </div>
              </div>

              <div className="p-6 max-h-[400px] overflow-y-auto">
                <MultipleCheckboxInput
                 items={courses?.map((c) => ({
                    ...c,
                    title: c?.name,
                  }))}
                  setValue={(v) => setClassObj((prev) => ({ ...prev, courses: v }))}
                  selectedItems={classObj?.courses}
                />
              </div>

              <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCourseSelectionOpen(false)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FiCheck className="text-lg" />
                  Save Changes
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCourseSelectionOpen(false)}
                  className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all duration-300"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Student Selection Modal */}
      <AnimatePresence>
        {studentSelectionOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setStudentSelectionOpen(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <FiUsers className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Select Students</h2>
                    <p className="text-green-100">Choose students for this class</p>
                  </div>
                </div>
              </div>

              <div className="p-6 max-h-[400px] overflow-y-auto">
                <MultipleCheckboxInput
                  items={students.map((s) => ({
                    ...s,
                    title: s?.name,
                  }))}
                  setValue={(v) => setClassObj((prev) => ({ ...prev, students: v }))}
                  selectedItems={classObj?.students}
                />
              </div>

              <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStudentSelectionOpen(false)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FiCheck className="text-lg" />
                  Save Changes
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStudentSelectionOpen(false)}
                  className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all duration-300"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassForm;