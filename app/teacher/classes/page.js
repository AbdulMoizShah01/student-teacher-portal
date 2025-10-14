"use client";

import { shallowEqual, useSelector } from "react-redux";
import { useClasses } from "@/hooks/useClasses";
import { useCourses } from "@/hooks/useCourses";

const page = () => {
  const currentUser = useSelector((s) => s?.activeUser, shallowEqual);
  const { classes } = useClasses();
  const { courses } = useCourses();

  // Build a set of course IDs assigned to this teacher from courses state
  const myCourseIds = new Set(
    (courses || [])
      .filter((c) => Array.isArray(c?.teachers) && c.teachers.includes(currentUser?._id))
      .map((c) => c?._id)
  );

  // A class is visible if it contains any course from myCourseIds
  const myClasses = (classes || []).filter((cls) =>
    Array.isArray(cls?.courses) && cls.courses.some((courseId) => myCourseIds.has(courseId))
  );

  return (
    <div className="w-full h-full p-4">
      <h1 className="text-2xl font-semibold mb-4">My Classes</h1>
      {myClasses?.length === 0 ? (
        <div className="text-gray-500">No assigned classes.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myClasses.map((cls) => (
            <div key={cls?._id} className="border rounded-xl bg-white p-4 shadow-sm">
              <h3 className="text-lg font-bold">{cls?.name}</h3>
              <p className="text-sm text-gray-600 mt-1">Courses: {cls?.courses?.length || 0}</p>
              <p className="text-sm text-gray-600">Students: {cls?.students?.length || 0}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default page;