"use client"
import AttemptQuiz from '@/ui/page-sections/AttemptQuiz'
import React from 'react'
import { useSubmissions } from '@/hooks/useSubmissions'

const page = () => {
  const {addSubmission}=useSubmissions();
  return (
    <main>
        <AttemptQuiz 
         onSubmit={addSubmission}
         />
    </main>
  )
}

export default page