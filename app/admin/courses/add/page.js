"use client";
import { useCourses } from '@/hooks/useCourses';
import CourseForm from '@/ui/forms/CourseForm';

import React from 'react'

const page = () => {
const { courses, addCourse } = useCourses();
  return (
    <CourseForm
      prevState={{}}
      onSubmit={addCourse}
      classArray={courses}
      name={"Add new Course"}
    />
  )
}

export default page