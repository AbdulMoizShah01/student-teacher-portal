import { useEffect, useState } from "react"
import NormalInputs from "../inputs/NormalInputs"
import { useRouter } from "next/navigation"

const CourseForm = ({ name, onSubmit, prevState, courseArray }) => {
  const [courseObj, setCourseObj] = useState({
    name: "",
    teachers: [],
    classes: [],
    students: [],
  })

  const router=useRouter();


  useEffect(() => {
    if (prevState) {
      setCourseObj({ ...prevState })
    }
  }, [prevState])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(courseObj)
    }
  }

  const handleClassChange = (index, value) => {
    const updatedClasses = [...courseObj.classes]
    updatedClasses[index] = value
    setCourseObj(prev => ({ ...prev, classes: updatedClasses }))
  }

  const addClass = () => {
    setCourseObj(prev => ({
      ...prev,
      classes: [...prev.classes, ""]
    }))
  }

  const removeClass = (index) => {
    setCourseObj(prev => ({
      ...prev,
      classes: prev.classes.filter((_, i) => i !== index)
    }))
  }

  const handleStudentChange = (index, value) => {
    const updatedStudents = [...courseObj.students]
    updatedStudents[index] = value
    setCourseObj(prev => ({ ...prev, students: updatedStudents }))
  }

  const addStudent = () => {
    setCourseObj(prev => ({
      ...prev,
      students: [...prev.students, ""]
    }))
  }

  const removeStudent = (index) => {
    setCourseObj(prev => ({
      ...prev,
      students: prev.students.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">{name}</h2>
          <p className="text-gray-600 mt-2">Manage course details and assignments</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <NormalInputs 
            type={"text"}
            label={"Course Name"}
            placeholder={"Enter course name (e.g., Mathematics 101)"}
            value={courseObj?.name}
            setValue={(v) => setCourseObj(prev => ({ ...prev, name: v }))}
          />

          <NormalInputs 
            type={"text"}
            label={"Course Description"}
            placeholder={"Enter course description"}
            value={courseObj?.description}
            setValue={(v) => setCourseObj(prev => ({ ...prev, description: v }))}
          />

          <NormalInputs 
            type={"text"}
            label={"Teacher"}
            placeholder={"Enter teacher name or ID"}
            value={courseObj?.teachers}
            setValue={(v) => setCourseObj(prev => ({ ...prev, teacher: v }))}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700">Assigned Classes</label>
              <button
                type="button"
                onClick={addClass}
                className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Class
              </button>
            </div>
            
            <div className="space-y-3">
              {courseObj.classes?.map((classItem, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={classItem}
                    onChange={(e) => handleClassChange(index, e.target.value)}
                    placeholder="Enter class ID"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeClass(index)}
                    className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700">Enrolled Students</label>
              <button
                type="button"
                onClick={addStudent}
                className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Student
              </button>
            </div>
            
            <div className="space-y-3">
              {courseObj.students?.map((student, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={student}
                    onChange={(e) => handleStudentChange(index, e.target.value)}
                    placeholder="Enter student ID"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeStudent(index)}
                    className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
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
    </div>
  )
}

export default CourseForm