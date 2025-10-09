"use client";

import { useClasses } from "@/hooks/useClasses";
import ClassForm from "@/ui/forms/ClassForm";

const page = () => {
  const { classes, addClass } = useClasses();
  return (
    <ClassForm
      prevState={{}}
      onSubmit={addClass}
      classArray={classes}
      name={"Add new Class"}
    />
  );
};

export default page;
