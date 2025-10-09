import { SET_ACTIVEUSER, SET_CLASSES, SET_COURSES, SET_QUIZZES, SET_SUBMSSIONS, SET_USERS, } from "../types"

/*---------------------ADMIN ACTIONS------------------------------*/
export const setUsers=(payload)=>{
    return {type:SET_USERS,payload:payload}
}



/*----------------------------GLOBAL ACTIONS----------------------*/
export const setActiveUser=(payload)=>{
return {type:SET_ACTIVEUSER,payload:payload}
}


export const setQuizzes=(payload)=>{
return {type:SET_QUIZZES,payload:payload}
}

export const setClasses=(payload)=>{
return {type:SET_CLASSES,payload:payload}
}

export const setCourses=(payload)=>{
return {type:SET_COURSES,payload:payload}
}

export const setSubmissions=(payload)=>{
return {type:SET_SUBMSSIONS,payload:payload}
}


