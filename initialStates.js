import {
  setClasses,
  setCourses,
  setQuizzes,
  setSubmissions,
  setUsers,
} from "./redux/actions";
import { getAllOfCollection, getDocsByKeyValue } from "./utils";

const initialFetches = {
  /*----------------------ADMIN--------------------*/
  admin: [
    {
      name: "Users",
      fetcher: async () => {
        let users = await getAllOfCollection("users");
        console.log("Users", users);
        return users;
      },
      reduxAction: setUsers,
    },
  ],

  /*----------------------GLOBALS--------------------*/
  globals: [
    {
      name: "classes",
      fetcher: async () => {
        let classes = await getAllOfCollection("classes");
        console.log("classes", classes);
        return classes;
      },
      reduxAction: setClasses,
    },

    {
      name: "Courses",
      fetcher: async () => {
        let courses = await getAllOfCollection("courses");
        console.log("courses", courses);
        return courses;
      },
      reduxAction: setCourses,
    },

    {
      name: "Submissions",
      fetcher: async (user) => {
        //decide for student and teacher
        if (user?.role == "student") {
          let submissions = await getDocsByKeyValue(
            "submissions",
            "studentId",
            user?._id
          );
          return submissions;
        } else if (user?.role === "teacher") {
          let submissions = await getDocsByKeyValue(
            "submissions",
            "teacherId",
            user?._id
          );
          return submissions;
        } else {
          let submissions = await getAllOfCollection("submissions");
          return submissions;
        }
      },
      reduxAction: setSubmissions,
    },

    {
      name: "Quizzes",
     fetcher: async (user) => {
        //decide for student and teacher
        if (user?.role == "student") {
          let quizzess = await getDocsByKeyValue(
            "quizzes",
            "classId",
            user?.classId
          );
          return quizzess;
        } else if (user?.role === "teacher") {
          let quizzess = await getDocsByKeyValue(
            "quizzes",
            "teacherId",
            user?._id
          );
          console.log("teacher s quizzess",quizzess)
          return quizzess;
        } else {
          let quizzess = await getAllOfCollection("quizzes");
          return quizzess;
        }
      },
      reduxAction: setQuizzes,
    },
  ],
};

export default async function getInitialStates(reduxDispatchHook, role, user) {
  if (role && initialFetches[role])
    initialFetches[role]?.forEach((obj) => {
      obj
        ?.fetcher(user)
        ?.then((data) => reduxDispatchHook(obj?.reduxAction(data)));
    });

  initialFetches.globals?.forEach((obj) => {
    obj
      ?.fetcher(user)
      ?.then((data) => reduxDispatchHook(obj?.reduxAction(data)));
  });
}
