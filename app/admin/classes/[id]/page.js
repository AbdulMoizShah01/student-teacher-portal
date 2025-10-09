"use client";

import { useClasses } from "@/hooks/useClasses";
import { useCourses } from "@/hooks/useCourses";
import { getItemsbyKey } from "@/utils";
import { useParams } from "next/navigation";

const page = () => {
const {id}=useParams();
const {classes}=useClasses();
const {courses}=useCourses();
const state=classes?.find((item)=>item?._id===id);
const coursesArray=getItemsbyKey(state?.courses??[],courses??[]);
const teachersArray=getItemsbyKey(state?.teachers??[],[]);



  return (
    <div>
       <h2 className="text-lg">Class Detail</h2>
       <p className="mb-10">Showing details of {state?.name}</p>
      <div className="border border-[#eee] rounded-2xl md:px-5 md:py-4 px-3 py-3 ">
        <h2 className="text-xl font-semibold">Class {state?.name}</h2>
      </div>
      <div className="mt-4 border border-[#eee] rounded-2xl md:px-5 md:py-4 px-3 py-3">
      <h2 className="text-xl font-semibold mb-3 ">Courses</h2>
      <div className="flex items-stretch gap-3 flex-wrap ">
        {coursesArray?.map((course)=><div key={`${course?._id}`} className="border bg-white shadow shadow-[#111] rounded-2xl px-3 py-2">
         <h3 className="font-bold">{course?.title}</h3>
        </div>)}
      </div>
      </div>

    </div>
  )
}

export default page