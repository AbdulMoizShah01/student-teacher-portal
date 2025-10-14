"use client"

import { setCourses } from "@/redux/actions";
import { createUniqueId, saveData, deleteData } from "@/utils";
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

const updateCourse = async(updatedObj)=>{
    try{
        await saveData("courses", updatedObj);
        const updated = courses.map(c=> c?._id===updatedObj?._id ? updatedObj : c);
        dispatch(setCourses(updated));
        return updatedObj;
    }catch(e){
        return e;
    }
}

const removeCourse = async(courseToRemove)=>{
    await deleteData("courses", courseToRemove);
    const filtered = courses?.filter(c=>c?._id !== courseToRemove?._id);
    dispatch(setCourses(filtered));
}

  return {courses,addCourse,updateCourse,removeCourse};
}
