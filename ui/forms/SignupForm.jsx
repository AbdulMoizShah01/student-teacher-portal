"use client";
import React, { useEffect, useState } from "react";
import InputField from "../inputs/NormalInputs";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiUsers, 
  FiArrowRight,
  FiCheckCircle,
  FiBook,
  FiAward,
  FiShield,
  FiEye,
  FiEyeOff
} from "react-icons/fi";

const SignupForm = ({ onSubmit, role }) => {
  const createdAt = Date.parse(new Date());
  const [form, setForm] = useState({ 
    email: "", 
    name: "", 
    role: role ?? "", 
    password: "", 
    status: "pending", 
    createdAt: createdAt 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (onSubmit) {
      onSubmit(form);
    }
    
    setIsLoading(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  useEffect(() => {
    setForm((prev) => ({ ...prev, role: role ?? "" }));
  }, [role]);

  const getRoleIcon = () => {
    switch (form.role) {
      case "student": return <FiBook className="text-blue-500 text-xl" />;
      case "teacher": return <FiAward className="text-green-500 text-xl" />;
      case "admin": return <FiShield className="text-purple-500 text-xl" />;
      default: return <FiUsers className="text-gray-500 text-xl" />;
    }
  };

  const getRoleDescription = () => {
    switch (form.role) {
      case "student": return "Access courses, submit assignments, and track your progress";
      case "teacher": return "Manage classes, grade assignments, and engage with students";
      case "admin": return "Oversee institution operations and manage systems";
      default: return "Select your role to get started";
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 z-50 backdrop-blur-sm"
          >
            <FiCheckCircle className="text-xl flex-shrink-0" />
            <span className="font-semibold">Account created successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Form */}
          <div className="p-8 sm:p-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center lg:text-left mb-8"
            >
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FiUsers className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Join Student Portal
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base mt-1">
                    Create your account and start your journey
                  </p>
                </div>
              </div>
            </motion.div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <FiUser className="text-gray-400 text-lg group-focus-within:text-blue-500 transition-colors duration-300" />
                  </div>
                  <InputField
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="pl-12 pr-4 py-4 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 w-full group-hover:bg-white/90 group-hover:border-gray-300"
                  />
                </div>
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <FiMail className="text-gray-400 text-lg group-focus-within:text-blue-500 transition-colors duration-300" />
                  </div>
                  <InputField
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="pl-12 pr-4 py-4 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 w-full group-hover:bg-white/90 group-hover:border-gray-300"
                  />
                </div>
              </motion.div>

              {/* Role Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                  Select Role
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <FiUsers className="text-gray-400 text-lg group-focus-within:text-blue-500 transition-colors duration-300" />
                  </div>
                  <InputField
                    type="select"
                    name="role"
                    placeholder="Select your role"
                    value={form.role}
                    onChange={handleChange}
                    required
                    options={["student", "teacher", "admin"]}
                    className="pl-12 pr-10 py-4 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 w-full appearance-none group-hover:bg-white/90 group-hover:border-gray-300 cursor-pointer"
                  />
                  {/* Custom dropdown arrow */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Role Description */}
                <AnimatePresence>
                  {form.role && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      className="mt-3 flex items-start space-x-3 text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100/50"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5">
                        {getRoleIcon()}
                      </div>
                      <span className="leading-relaxed">{getRoleDescription()}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <FiLock className="text-gray-400 text-lg group-focus-within:text-blue-500 transition-colors duration-300" />
                  </div>
                  <InputField
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="pl-12 pr-12 py-4 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 w-full group-hover:bg-white/90 group-hover:border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100/50"
                  >
                    {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                  </button>
                </div>
                <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>Use 8+ characters with letters and numbers</span>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="pt-4"
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-3 group relative overflow-hidden"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Content */}
                  <span className="relative z-10 flex items-center space-x-2">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                </button>
              </motion.div>
            </form>

            {/* Additional Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-8 text-center text-sm text-gray-600"
            >
              <p>
                Already have an account?{" "}
                <a href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline">
                  Sign in here
                </a>
              </p>
            </motion.div>
          </div>

          {/* Right Side - Preview/Info */}
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 sm:p-10 text-white hidden lg:flex flex-col justify-center relative overflow-hidden">
            {/* Enhanced Background Pattern */}
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16 blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative z-10"
            >
              {/* Role Preview Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    {getRoleIcon()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {form.role ? `Join as ${form.role.charAt(0).toUpperCase() + form.role.slice(1)}` : "Welcome!"}
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">
                      {form.role ? "Ready to get started?" : "Choose your role to begin"}
                    </p>
                  </div>
                </div>
                <p className="text-blue-100 leading-relaxed text-sm">
                  {getRoleDescription()}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                <motion.div 
                  className="flex items-center space-x-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <FiCheckCircle className="text-sm" />
                  </div>
                  <div>
                    <span className="text-blue-100 font-medium block">Secure & Reliable</span>
                    <span className="text-blue-200/70 text-xs">Enterprise-grade security</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center space-x-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <FiCheckCircle className="text-sm" />
                  </div>
                  <div>
                    <span className="text-blue-100 font-medium block">24/7 Access</span>
                    <span className="text-blue-200/70 text-xs">Learn anytime, anywhere</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center space-x-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <FiCheckCircle className="text-sm" />
                  </div>
                  <div>
                    <span className="text-blue-100 font-medium block">Real-time Collaboration</span>
                    <span className="text-blue-200/70 text-xs">Connect with peers & mentors</span>
                  </div>
                </motion.div>
              </div>

              {/* Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-8 pt-6 border-t border-white/20"
              >
          
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupForm;