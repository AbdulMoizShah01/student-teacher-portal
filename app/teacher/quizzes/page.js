import TeacherQuizList from '@/ui/cards/QuizCard'
import QuizForm from '@/ui/forms/QuizForm'
import React from 'react'

const page = () => {
  return (
   <main>
    <TeacherQuizList/>
    <QuizForm/>
   </main>
  )
}

export default page