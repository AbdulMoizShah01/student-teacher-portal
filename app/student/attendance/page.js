"use client";

import { shallowEqual, useSelector } from "react-redux";
import { useClasses } from "@/hooks/useClasses";
import { saveData, getDocsByKeyValue } from "@/utils";
import { useEffect, useMemo, useState } from "react";

const page = () => {
  const currentUser = useSelector((s) => s?.activeUser, shallowEqual);
  const { classes } = useClasses();
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const myClasses = useMemo(() => {
    return (classes || []).filter((c) => {
      const arr = Array.isArray(c?.students) ? c.students : [];
      return arr.some((s) => (typeof s === "string" ? s === currentUser?._id : s?._id === currentUser?._id));
    });
  }, [classes, currentUser?._id]);

  const [myRecords, setMyRecords] = useState([]);

  useEffect(() => {
    (async () => {
      if (!currentUser?._id) return;
      const recs = await getDocsByKeyValue("attendance", "studentId", currentUser._id);
      setMyRecords(recs || []);
    })();
  }, [currentUser?._id]);

  const alreadyMarkedToday = useMemo(() => {
    const set = new Set(
      (myRecords || []).filter((r) => r?.date === today).map((r) => r?.classId)
    );
    return set;
  }, [myRecords, today]);

  const markAttendance = async (classId) => {
    try {
      setSaving(true);
      const record = {
        _id: `${classId}-${currentUser?._id}-${today}`,
        classId,
        studentId: currentUser?._id,
        date: today,
        status: "present",
      };
      await saveData("attendance", record);
      alert("Attendance marked");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Mark Attendance</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myClasses.map((cls) => (
          <div key={cls?._id} className="border rounded-xl p-4 bg-white">
            <h3 className="text-lg font-bold">{cls?.name}</h3>
            <button
              disabled={saving || alreadyMarkedToday.has(cls?._id)}
              onClick={() => markAttendance(cls?._id)}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {alreadyMarkedToday.has(cls?._id)
                ? "Already marked today"
                : saving
                ? "Saving..."
                : `Mark Present (${today})`}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Attendance History</h2>
        <div className="space-y-2">
          {(myRecords || [])
            .slice()
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .map((r) => (
              <div key={`${r.classId}-${r.date}`} className="border rounded-lg p-3 bg-white text-sm text-gray-700">
                <span className="font-semibold mr-2">{classes?.find((c) => c?._id === r.classId)?.name || r.classId}</span>
                <span className="mr-2">{r.date}</span>
                <span className={r.status === "present" ? "text-green-600" : "text-gray-500"}>{r.status}</span>
              </div>
            ))}
          {(myRecords || []).length === 0 && (
            <div className="text-gray-500 text-sm">No attendance records yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;