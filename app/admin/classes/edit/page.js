"use client";

import { useSearchParams } from "next/navigation";
import { useClasses } from "@/hooks/useClasses";
import { useCourses } from "@/hooks/useCourses";
import { useUsers } from "@/hooks/useUsers";
import { getItemsbyKey } from "@/utils";
import ClassForm from "@/ui/forms/ClassForm";

const page = () => {
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  const { classes, updateClass } = useClasses();
  const { courses } = useCourses();
  const { students } = useUsers();

  const selected = classes?.find((c) => c?._id === id) || {};

  const coerceToObjects = (maybeIdsOrObjects = [], source = []) => {
    return (maybeIdsOrObjects || []).map((item) => {
      if (item && typeof item === "object") return item;
      return source?.find((s) => s?._id === item) || {};
    });
  };

  const prevState = {
    ...selected,
    courses: coerceToObjects(selected?.courses ?? [], courses ?? []),
    students: coerceToObjects(selected?.students ?? [], students ?? []),
  };

  return (
    <ClassForm
      prevState={prevState}
      onSubmit={updateClass}
      classArray={classes}
      name={"Edit Class"}
    />
  );
};

export default page;
