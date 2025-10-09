"use client";
import { IoAdd } from "react-icons/io5";
import { useSelector, shallowEqual } from 'react-redux';
import { useRouter } from "next/navigation";

const CourseCard = () => {
  const state = useSelector((s) => s, shallowEqual);
  const courses = state?.courses;
  const router=useRouter();
  
  return (
    <div className="w-full p-6">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Courses</h1>
                  <p className="text-gray-600 mt-2">Create and manage your courses</p>
                </div>
                <button
                  onClick={() => {
                    router.push("/admin/courses/add");
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2"
                >
                  <IoAdd size={26} />
                  Add New Class
                </button>
              </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses?.map((course, index) => (
          <div 
            key={course?._id || index}
            className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 truncate">
                  {course?.title || "Unnamed Course"}
                </h3>
                <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full">
                  ID: {course?._id?.slice(0, 8)}...
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm">Teacher: {course?.teacher || "Not assigned"}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="text-sm">Classes: {course?.classes?.length || 0}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm">Students: {course?.students?.length || 0}</span>
                </div>
              </div>
              
              {course?.classes && course.classes.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Assigned Classes:</h4>
                  <div className="flex flex-wrap gap-1">
                    {course.classes.slice(0, 2).map((classItem, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {classItem}
                      </span>
                    ))}
                    {course.classes.length > 2 && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        +{course.classes.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                  Active
                </span>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-semibold">
                  Manage Course
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {(!courses || courses.length === 0) && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No courses available</div>
          <p className="text-gray-400 mt-2">Courses will appear here once created</p>
        </div>
      )}
    </div>
  );
};

export default CourseCard;