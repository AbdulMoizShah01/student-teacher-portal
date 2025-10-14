"use client";

import { useEffect, useState } from "react";
import { getDocsByKeyValue } from "@/utils";
import { useClasses } from "@/hooks/useClasses";

const page = () => {
  const today = new Date().toISOString().slice(0, 10);
  const [records, setRecords] = useState([]);
  const { classes } = useClasses();

  useEffect(() => {
    (async () => {
      const all = await getDocsByKeyValue("attendance", "date", today);
      setRecords(all || []);
    })();
  }, [today]);

  const classIdToName = new Map((classes || []).map((c) => [c?._id, c?.name]));
  const grouped = (records || []).reduce((acc, r) => {
    acc[r.classId] = (acc[r.classId] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Today's Attendance (All Classes)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(grouped).map(([classId, count]) => (
          <div key={classId} className="border rounded-xl p-4 bg-white">
            <h3 className="text-lg font-bold">{classIdToName.get(classId) || classId}</h3>
            <p className="text-sm text-gray-600 mt-1">Present: {count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;


