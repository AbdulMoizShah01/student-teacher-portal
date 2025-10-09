import React from 'react'
import SideBar from '@/ui/globals/SideBar'
import { teacherRoutes } from '@/config'
const layout = ({children}) => {
  return (
   <main className='flex flex-row items-stretch h-screen w-screen '>
     <SideBar links={teacherRoutes} role={"teacher"} />
    <div className="flex-1 lg:p-5 p-3 h-screen overflow-y-scroll">
      {children}
      </div>
    </main>
  )
}

export default layout