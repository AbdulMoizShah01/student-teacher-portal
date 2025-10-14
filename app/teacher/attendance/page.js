"use client";

import { shallowEqual, useSelector } from "react-redux";
import { useClasses } from "@/hooks/useClasses";
import { useCourses } from "@/hooks/useCourses";
import { getDocsByKeyValue } from "@/utils";
import { useEffect, useState } from "react";

const page = () => {
  const currentUser = useSelector((s) => s?.activeUser, shallowEqual);
  const { classes } = useClasses();
  const { courses } = useCourses();
  const [records, setRecords] = useState([]);
  const today = new Date().toISOString().slice(0, 10);

  const myCourseIds = new Set(
    (courses || [])
      .filter((c) => Array.isArray(c?.teachers) && c.teachers.includes(currentUser?._id))
      .map((c) => c?._id)
  );
  const myClasses = (classes || []).filter((cls) =>
    Array.isArray(cls?.courses) && cls.courses.some((cid) => myCourseIds.has(cid))
  );

  useEffect(() => {
    (async () => {
      // simple fetch all attendance for today
      const all = await getDocsByKeyValue("attendance", "date", today);
      setRecords(all || []);
    })();
  }, [today]);

  const grouped = myClasses.reduce((acc, cls) => {
    acc[cls._id] = records.filter((r) => r.classId === cls._id);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Today's Attendance</h1>
      {myClasses.map((cls) => (
        <div key={cls._id} className="mb-6">
          <h2 className="text-xl font-bold mb-2">{cls.name}</h2>
          <div className="border rounded-xl bg-white">
            <div className="p-3 text-sm text-gray-600">
              {grouped[cls._id]?.length || 0} students marked present
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default page;