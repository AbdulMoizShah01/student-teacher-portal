"use client";
import { useEffect, useState } from "react";
import NormalInputs from "../inputs/NormalInputs";
import { useRouter } from "next/navigation";
import StandardModal from "../modals/StandardModal";
import MultipleCheckboxInput from "../inputs/MultipleCheckboxInput";
import { useUsers } from "@/hooks/useUsers";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiBook, 
  FiUsers, 
  FiUserPlus, 
  FiSave,
  FiX,
  FiPlus,
  FiArrowLeft,
  FiCheck,
  FiAward
} from "react-icons/fi";

const CourseForm = ({ name, onSubmit, prevState, courseArray }) => {
  const { teachers } = useUsers();
  const [courseObj, setCourseObj] = useState({
    name: "",
    teachers: [],
    classes: [],
  });
  const [teacherSelectionOpen, setTeacherSelectionOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseObj.name.trim()) {
      toast.error("Please enter a course name", { theme: "colored" });
      return;
    }

    setIsSubmitting(true);
    try {
      let obj = {
        ...courseObj,
        teachers: courseObj?.teachers?.map((item) => item?._id),
      };
      if (onSubmit) {
        await onSubmit(obj);
      }
      toast.success("Course has been added successfully 🎉", {
        theme: "colored",
      });

      setTimeout(() => {
        router.back();
      }, 1200);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while adding the course.", {
        theme: "colored",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCourse = () => {};

  useEffect(() => {
    if (prevState) {
      setCourseObj({ ...prevState });
    }
  }, [prevState]);

  const removeTeacher = (index) => {
    setCourseObj((prev) => ({
      ...prev,
      teachers: prev.teachers.filter((_, i) => i !== index),
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
              {name || "Create Course"}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Manage course details and teacher assignments
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Course Name Input */}
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
                    Course Name
                  </label>
                </div>
                <NormalInputs
                  type={"text"}
                  placeholder={"Enter course name (e.g., Mathematics 101)"}
                  value={courseObj?.name}
                  setValue={(v) => setCourseObj((prev) => ({ ...prev, name: v }))}
                  className="bg-white/70 border border-gray-200 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </motion.div>

              {/* Teachers Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-2xl p-6 border border-purple-100/50"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <FiAward className="text-purple-600 text-lg" />
                    </div>
                    <div>
                      <label className="block text-lg font-semibold text-gray-800">
                        Assigned Teachers
                      </label>
                      <p className="text-gray-600 text-sm">
                        Select teachers for this course
                      </p>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTeacherSelectionOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transform shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                  >
                    <FiUserPlus className="text-lg" />
                    Assign Teachers
                  </motion.button>
                </div>

                {/* Selected Teachers */}
                <div className="flex flex-wrap gap-3 min-h-[60px]">
                  <AnimatePresence>
                    {courseObj?.teachers?.map((teacher, index) => (
                      <motion.div
                        key={teacher?._id || index}
                        variants={tagVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="group relative"
                      >
                        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                            <FiUsers className="w-3 h-3" />
                          </div>
                          <span className="font-medium text-sm max-w-[120px] truncate">
                            {teacher?.name}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => removeTeacher(index)}
                            className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                          >
                            <FiX className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {(!courseObj?.teachers || courseObj.teachers.length === 0) && (
                    <div className="flex-1 flex items-center justify-center py-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <FiAward className="text-purple-500 text-xl" />
                        </div>
                        <p className="text-gray-500">
                          No teachers assigned yet. Click "Assign Teachers" to get started.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Teacher Statistics */}
                {courseObj?.teachers && courseObj.teachers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-white/50 rounded-xl border border-white/50"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-medium">
                        Total Teachers Assigned:
                      </span>
                      <span className="bg-purple-500 text-white px-3 py-1 rounded-full font-bold">
                        {courseObj.teachers.length}
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Course Information Section */}
     

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
                      <span>Saving Course...</span>
                    </>
                  ) : (
                    <>
                      <FiSave className="text-xl" />
                      <span className="text-lg">Save Course</span>
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

      {/* Teacher Selection Modal */}
      <AnimatePresence>
        {teacherSelectionOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setTeacherSelectionOpen(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <FiAward className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Select Teachers</h2>
                    <p className="text-purple-100">Choose teachers for this course</p>
                  </div>
                </div>
              </div>

              <div className="p-6 max-h-[400px] overflow-y-auto">
                <MultipleCheckboxInput
                  items={teachers.map((s) => ({
                    ...s,
                    title: s.name,
                  }))}
                  setValue={(v) => setCourseObj((prev) => ({ ...prev, teachers: v }))}
                  selectedItems={courseObj.teachers}
                />
              </div>

              <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTeacherSelectionOpen(false)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FiCheck className="text-lg" />
                  Save Changes
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTeacherSelectionOpen(false)}
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

export default CourseForm;