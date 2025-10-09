"use client";
import { useRouter } from "next/navigation";
import { useClasses } from "@/hooks/useClasses";
import { IoAdd } from "react-icons/io5";
import { useCourses } from "@/hooks/useCourses";
import { createRoleBasedUrl } from "@/utils";
import { roleBasedUrl } from "@/config";

const ClassCard = () => {
  const { classes } = useClasses();
  const { courses } = useCourses();
  const router = useRouter();

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Class Management</h1>
          <p className="text-gray-600 mt-2">Create and manage your classes</p>
        </div>
        <button
          onClick={() => {
            router.push("/admin/classes/add");
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2"
        >
          <IoAdd size={26} />
          Add New Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {classes?.map((classItem, index) => (
          <div
            onClick={() => {
              router.push(roleBasedUrl(`/classes/${classItem?._id}`));
            }}
            key={classItem?._id || index}
            className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 truncate">
                  {classItem?.name || "Unnamed Class"}
                </h3>
                <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full">
                  ID: {classItem?._id?.slice(0, 8)}...
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span className="text-sm">
                    Courses: {classItem?.courses?.length || 0}
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="text-sm">
                    Students: {classItem?.students?.length || 0}
                  </span>
                </div>
              </div>

              <div onClick={(e)=>e?.stopPropagation()} className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                  Active
                </span>
                <div className="flex gap-2">
                  <button  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-semibold">
                    Manage
                  </button>
                  <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm font-semibold">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!classes || classes.length === 0) && (
        <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-gray-300">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div className="text-gray-500 text-xl font-semibold mb-2">
            No classes available
          </div>
          <p className="text-gray-400 mb-6">
            Get started by creating your first class
          </p>
          <button
            onClick={() => {
              router.push("/admin/classes/add");
            }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-8 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Create Your First Class
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassCard;
