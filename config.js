"use client";
export const adminRoutes=[
    {title:"Classes", path:"/classes"},
    {title:"Courses", path:"/courses"},
    {title:"Quizzes", path:"/quizzes"},
    {title:"Submissions", path:"/submissions"},
    {title:"Users", path:"/users"}];


export const teacherRoutes=[
    {title:"Classes", path:"/classes"},
    {title:"Courses", path:"/courses"},
    {title:"Quizzes", path:"/quizzes"},
    {title:"Submissions", path:"/submissions"},
    {title:"Users", path:"/users"}];

    
export const studentRoutes=[ 
    {title:"Class", path:"/class"},
    {title:"Quizzes", path:"/quizzs"},
    {title:"Attendance", path:"/attendance"},
  ];

 export const roleBasedUrl=(url)=>{
    const _window=typeof window!=="undefined"?window:null;
    const location=_window.location.toString();
    const role=location.split("/")?.[3];
    console.log("role ",role);

    return `${_window.location.origin}/${role}${url}`;


 }   