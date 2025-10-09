"use client"

import { setCourses } from "@/redux/actions";
import { createUniqueId } from "@/utils";
import { shallowEqual, useDispatch, useSelector } from "react-redux"

export const useCourses = () => {
 
    const courses = useSelector((s)=>s?.courses,shallowEqual);
    const dispatch =useDispatch()

const addCourse =async (courseObj)=>{
    try{
        
        const newCourse={...courseObj, _id:createUniqueId()};
        await saveData("courses",newCourse);

        let array=[...courses];
        array.push(newCourse);
        dispatch(setCourses(array));
        
    }catch(e){
        return (e);
    }

}

  return {courses,addCourse};
}
