"use client"
import React, { useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { saveData } from '@/utils'
import { useDispatch } from 'react-redux'
import { setUsers } from '@/redux/actions'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiUsers, 
  FiUser, 
  FiMail, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock,
  FiUserCheck,
  FiUserX,
  FiFilter
} from 'react-icons/fi'

const UsersList = () => {
  const dispatch = useDispatch();
  const state = useSelector((s)=>s, shallowEqual);
  const users = state?.users

  const [filter, setFilter] = useState('all') // all, pending, approved, rejected

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

  // Filter users based on status
  const filteredUsers = users?.filter(user => {
    if (filter === 'all') return true;
    return user?.status === filter;
  });

  // Calculate statistics
  const stats = {
    total: users?.length || 0,
    pending: users?.filter(u => u?.status === 'pending').length || 0,
    approved: users?.filter(u => u?.status === 'approved').length || 0,
    rejected: users?.filter(u => u?.status === 'rejected').length || 0,
    teachers: users?.filter(u => u?.role === 'teacher').length || 0,
    students: users?.filter(u => u?.role === 'student').length || 0
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      approved: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      rejected: "bg-red-100 text-red-800 border-red-200"
    };
    
    const statusIcons = {
      approved: <FiCheckCircle className="w-3 h-3" />,
      pending: <FiClock className="w-3 h-3" />,
      rejected: <FiXCircle className="w-3 h-3" />
    };
    
    return (
      <span className={`px-3 py-2 rounded-full text-xs font-semibold border flex items-center gap-2 ${statusStyles[status] || statusStyles.pending}`}>
        {statusIcons[status]}
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  }

  const getRoleBadge = (role) => {
    const roleStyles = {
      teacher: "bg-blue-100 text-blue-800 border-blue-200",
      student: "bg-purple-100 text-purple-800 border-purple-200",
      admin: "bg-indigo-100 text-indigo-800 border-indigo-200"
    };

    const roleIcons = {
      teacher: <FiUser className="w-3 h-3" />,
      student: <FiUsers className="w-3 h-3" />,
      admin: <FiUserCheck className="w-3 h-3" />
    };
    
    return (
      <span className={`px-3 py-2 rounded-full text-xs font-semibold border flex items-center gap-2 ${roleStyles[role] || roleStyles.student}`}>
        {roleIcons[role]}
        {role?.charAt(0).toUpperCase() + role?.slice(1)}
      </span>
    );
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FiUsers className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  User Management
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Manage user accounts and approval requests
                </p>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiUsers className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                    <p className="text-gray-600 text-sm">Total Users</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <FiClock className="text-yellow-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
                    <p className="text-gray-600 text-sm">Pending</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <FiUserCheck className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.approved}</p>
                    <p className="text-gray-600 text-sm">Approved</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg min-w-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <FiUserX className="text-red-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.rejected}</p>
                    <p className="text-gray-600 text-sm">Rejected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg mb-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <FiFilter className="text-gray-600 w-5 h-5" />
              <h3 className="text-lg font-semibold text-gray-800">Filter Users</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                  filter === 'all' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <FiUsers className="w-4 h-4" />
                All Users
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                  filter === 'pending' 
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <FiClock className="w-4 h-4" />
                Pending
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                  filter === 'approved' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <FiCheckCircle className="w-4 h-4" />
                Approved
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                  filter === 'rejected' 
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <FiXCircle className="w-4 h-4" />
                Rejected
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden"
        >
          {(!filteredUsers || filteredUsers.length === 0) ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FiUsers className="text-white text-3xl" />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-800 mb-3">
                {filter === 'all' ? 'No Users Found' : `No ${filter} Users`}
              </h3>
              <p className="text-gray-600 text-lg mb-8 max-w-sm mx-auto leading-relaxed">
                {filter === 'all' 
                  ? "No users have been registered yet. Users will appear here once they sign up."
                  : `There are no ${filter} users in the system.`
                }
              </p>
            </motion.div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  <AnimatePresence>
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user?._id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="hover:bg-gray-50/80 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 font-mono bg-gray-50/80 px-3 py-2 rounded-lg border border-gray-200/50 group-hover:bg-white transition-colors">
                            {user?._id?.slice(0, 8)}...
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                              <FiUser className="text-white text-sm" />
                            </div>
                            <div className="text-sm font-semibold text-gray-900">
                              {user?.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRoleBadge(user?.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 flex items-center gap-2">
                            <FiMail className="w-4 h-4 text-gray-400" />
                            {user?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user?.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleApproval(user)}
                              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transform transition-all duration-200 shadow-sm border border-green-600 flex items-center gap-2"
                            >
                              <FiCheckCircle className="w-4 h-4" />
                              Approve
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleReject(user)}
                              className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-semibold rounded-lg hover:from-red-600 hover:to-pink-700 transform transition-all duration-200 shadow-sm border border-red-600 flex items-center gap-2"
                            >
                              <FiXCircle className="w-4 h-4" />
                              Reject
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Table Footer */}
        {filteredUsers && filteredUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center text-sm text-gray-500"
          >
            Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
            {filter !== 'all' && ` (${filter})`}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default UsersList