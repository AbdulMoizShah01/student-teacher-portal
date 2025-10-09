import { studentRoutes } from '@/config'
import SideBar from '@/ui/globals/SideBar'
import React from 'react'

const layout = ({children}) => {
  return (
   <main className='flex flex-row items-stretch h-screen w-screen '>
     <SideBar links={studentRoutes} role={"student"} />
    <div className="flex-1 lg:p-5 p-3 h-screen overflow-y-scroll">{children}</div>
    </main>
  )
}

export default layout