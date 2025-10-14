"use client";

import { useSearchParams } from "next/navigation";
import { useCourses } from "@/hooks/useCourses";
import { useUsers } from "@/hooks/useUsers";
import CourseForm from "@/ui/forms/CourseForm";

const page = () => {
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  const { courses, updateCourse } = useCourses();
  const { teachers } = useUsers();

  const selected = courses?.find((c) => c?._id === id) || {};

  const coerceToObjects = (maybeIdsOrObjects = [], source = []) => {
    return (maybeIdsOrObjects || []).map((item) => {
      if (item && typeof item === "object") return item;
      return source?.find((s) => s?._id === item) || {};
    });
  };

  const prevState = {
    ...selected,
    teachers: coerceToObjects(selected?.teachers ?? [], teachers ?? []),
  };

  return (
    <CourseForm
      prevState={prevState}
      onSubmit={updateCourse}
      courseArray={courses}
      name={"Edit Course"}
    />
  );
};

export default page;


