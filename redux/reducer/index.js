import { SET_ACTIVEUSER, SET_CLASSES, SET_COURSES, SET_QUIZZES, SET_SUBMSSIONS, SET_USERS } from "../types"

export const rootState = {

    /*--------------GLOBALS*---------------*/
    activeUser: null,
    classes:[],
    courses:[],
    quizzes:[],
    submissions:[],

/*-------------------------ADMIN-------------*/
    users:[],

}




export const dataReducer = (initialState = rootState, action) => {
    let type = action.type;
    switch (type) {
        /*-------------------------ADMIN-------------*/
        case SET_USERS:return {...initialState,users:action.payload}

        /*--------------GLOBALS*---------------*/
        case SET_ACTIVEUSER: return { ...initialState, activeUser: action.payload }
        case SET_COURSES:return {...initialState, courses: action.payload}
        case SET_CLASSES:return {...initialState, classes: action.payload}
        case SET_QUIZZES:return {...initialState, quizzes: action.payload}
        case SET_SUBMSSIONS: return{...initialState, submissions: action.payload}
      


//create new state-handlers here

        default: return { ...initialState }


    }

}