"use client";

import { shallowEqual, useSelector } from "react-redux";
import { useCourses } from "@/hooks/useCourses";

const page = () => {
  const currentUser = useSelector((s) => s?.activeUser, shallowEqual);
  const { courses } = useCourses();

  const myCourses = (courses || []).filter((c) =>
    Array.isArray(c?.teachers) && c.teachers.includes(currentUser?._id)
  );

  return (
    <div className="w-full h-full p-4">
      <h1 className="text-2xl font-semibold mb-4">My Courses</h1>
      {myCourses?.length === 0 ? (
        <div className="text-gray-500">No assigned courses.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myCourses.map((course) => (
            <div key={course?._id} className="border rounded-xl bg-white p-4 shadow-sm">
              <h3 className="text-lg font-bold">{course?.name || course?.title}</h3>
              <p className="text-sm text-gray-600 mt-1">Classes: {course?.classIds?.length || 0}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default page;