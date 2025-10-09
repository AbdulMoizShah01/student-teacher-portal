"use client"
import React, { useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { saveData } from '@/utils'
import { useDispatch } from 'react-redux'
import { setUsers } from '@/redux/actions'

const UsersList = () => {
  const dispatch = useDispatch();
  const state = useSelector((s)=>s, shallowEqual);
  const users = state?.users

 const handleApproval = async(userObj) => {
  let array = [...users];
  let index = array?.findIndex((user)=>user?._id === userObj._id);
  array[index].status = "approved";
  await saveData("users", array[index]);
  dispatch(setUsers(array));
 }

 const handleReject = async(userObj) => {
  let array = [...users];
  let index = array?.findIndex((user)=>user?._id === userObj._id);
  array[index].status = "rejected";
  await saveData("users", array[index]);
  dispatch(setUsers(array));
 }

 const getStatusBadge = (status) => {
  const statusStyles = {
    approved: "bg-green-100 text-green-800 border-green-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    rejected: "bg-red-100 text-red-800 border-red-200"
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[status] || statusStyles.pending}`}>
      {status}
    </span>
  );
 }

 const getRoleBadge = (role) => {
  const roleStyles = {
    teacher: "bg-blue-100 text-blue-800 border-blue-200",
    student: "bg-purple-100 text-purple-800 border-purple-200",
    admin: "bg-indigo-100 text-indigo-800 border-indigo-200"
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${roleStyles[role] || roleStyles.student}`}>
      {role}
    </span>
  );
 }

  return (
    <div className='w-full bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden'>
   
      
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-widest border-b border-gray-200'>User ID</th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-widest border-b border-gray-200'>Name</th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-widest border-b border-gray-200'>Role</th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-widest border-b border-gray-200'>Email</th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-widest border-b border-gray-200'>Status</th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-widest border-b border-gray-200'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {users?.map((user, index) => (
              <tr key={user?._id} className={`hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-600 font-mono'>{user?._id?.slice(0, 8)}...</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm font-medium text-gray-900'>{user?.name}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {getRoleBadge(user?.role)}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-600'>{user?.email}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {getStatusBadge(user?.status)}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex gap-2'>
                    <button 
                      onClick={() => handleApproval(user)}
                      className='px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-200 shadow-sm border border-green-600'
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleReject(user)}
                      className='px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transform hover:scale-105 transition-all duration-200 shadow-sm border border-red-600'
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(!users || users.length === 0) && (
        <div className='text-center py-12 bg-gray-50'>
          <div className='text-gray-500 text-lg'>No users found</div>
          <p className='text-gray-400 mt-2'>All users will appear here once registered</p>
        </div>
      )}
    </div>
  )
}

export default UsersList