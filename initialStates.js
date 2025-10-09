import { setClasses, setCourses, setQuizzes, setSubmissions, setUsers, } from "./redux/actions"
import { getAllOfCollection } from "./utils";

const initialFetches = {


    

    /*----------------------ADMIN--------------------*/
    admin:[
    
    {
        name: "Users", fetcher: async () => {

            let users = await getAllOfCollection("users");
            console.log("Users",users)
            return users;


        }
        , reduxAction: setUsers
    },

  




],




    /*----------------------GLOBALS--------------------*/
globals:[
  
    {
        name: "classes", fetcher: async () => {

            let classes = await getAllOfCollection("classes");
            console.log("classes",classes)
            return classes;


        }
        , reduxAction: setClasses
    },


        {
        name: "Courses", fetcher: async () => {

            let courses = await getAllOfCollection("courses");
            console.log("courses",courses)
            return courses;


        }
        , reduxAction: setCourses
    },


        {
        name: "Submissions", fetcher: async () => {

            let submissions = await getAllOfCollection("submissions");
            console.log("submissions",submissions)
            return submissions;


        }
        , reduxAction: setSubmissions
    },



        {
        name: "Quizzes", fetcher: async () => {

            let quizzes = await getAllOfCollection("quizzes");
            console.log("quizzes",quizzes)
            return quizzes;


        }
        , reduxAction: setQuizzes
    },
    
]

}





export default async function getInitialStates(reduxDispatchHook, role) {
    if(role && initialFetches[role])
    initialFetches[role]?.forEach((obj) => {
        obj?.fetcher()?.then((data) => reduxDispatchHook(obj?.reduxAction(data)));
    });

       initialFetches.globals?.forEach((obj) => {
        obj?.fetcher()?.then((data) => reduxDispatchHook(obj?.reduxAction(data)));
    });
}