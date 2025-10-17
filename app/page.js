"use client"
import Header from "@/ui/globals/Header";
import { PiStudentBold } from "react-icons/pi";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { RiAdminLine } from "react-icons/ri";
import { WaitListModal } from "@/ui/modals/WaitListModal";
import { motion } from "framer-motion";
import { 
  FiBook, 
  FiUsers, 
  FiAward, 
  FiTrendingUp, 
  FiArrowRight,
  FiCheckCircle
} from "react-icons/fi";

export default function Home() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      <WaitListModal />
      <Header />
      
      {/* Fixed Video Background Section */}
      <section className="fixed inset-0 h-screen w-full flex items-center justify-center overflow-hidden z-0">
        {/* Video Background */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover scale-105"
        >
          <source src="/vid.mp4" type="video/mp4" />
        </video>

        {/* Floating background elements */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-full animate-float opacity-60 z-10"></div>
        <div
          className="absolute top-1/3 right-1/4 w-6 h-6 bg-purple-400 rounded-full animate-float opacity-40 z-10"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-indigo-400 rounded-full animate-float opacity-50 z-10"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Banner Content - Centered on Video */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4 sm:px-6 max-w-4xl mx-auto w-full"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Welcome to
            <span className="block mt-2 sm:mt-4 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Student-Teacher Portal
            </span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-6 sm:mb-10 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed font-light px-4">
            Transform your educational experience with our comprehensive platform designed for 
            seamless learning, teaching, and administration.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-3 mx-auto shadow-2xl hover:shadow-3xl text-base sm:text-lg"
          >
            <span>Get Started Today</span>
            <FiArrowRight className="text-lg sm:text-xl" />
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <span className="text-white text-xs sm:text-sm font-medium">Scroll to Explore</span>
            <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/50 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-2 sm:h-3 bg-white/70 rounded-full mt-2"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Main Content Sections - Scrolls over video */}
      <div className="relative z-10">
        {/* Stats Section - First overlay on video */}
        <section className="min-h-[200px] sm:min-h-[300px] flex items-center justify-center pt-16 sm:pt-20 mt-[50vh] sm:mt-[90rem] bg-white/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto px-4 sm:px-6 w-full"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-20">
              {[
                { number: "50K+", label: "Active Students", icon: FiUsers },
                { number: "5K+", label: "Expert Teachers", icon: LiaChalkboardTeacherSolid },
                { number: "200+", label: "Courses", icon: FiBook },
                { number: "99%", label: "Satisfaction Rate", icon: FiAward }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={cardVariants}
                  whileHover="hover"
                  className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg sm:shadow-2xl"
                >
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto shadow-lg">
                    <stat.icon className="text-white text-sm sm:text-xl" />
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Role Cards Section */}
        <section className="min-h-[400px] sm:min-h-[500px] flex items-center justify-center bg-white/80 backdrop-blur-sm py-10 sm:py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 w-full"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                Designed for Everyone
              </h2>
              <p className="text-base sm:text-xl text-gray-600 max-w-2xl sm:max-w-3xl mx-auto px-4">
                Our platform caters to all roles in the educational ecosystem with tailored features and experiences.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto"
            >
              {/* Student Card */}
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="group relative bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 left-0 right-0 h-1 sm:h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <div className="p-6 sm:p-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl sm:shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <PiStudentBold className="text-white text-2xl sm:text-3xl" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    For Students
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6 group-hover:text-gray-700 transition-colors duration-300">
                    Access courses, submit assignments, track progress, and engage with interactive 
                    learning materials designed for academic success.
                  </p>
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {['Course Access', 'Assignment Submission', 'Progress Tracking', 'Interactive Learning'].map((feature) => (
                      <div key={feature} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                        <FiCheckCircle className="text-green-500 flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Teacher Card */}
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="group relative bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 left-0 right-0 h-1 sm:h-2 bg-gradient-to-r from-green-500 to-emerald-600"></div>
                <div className="p-6 sm:p-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl sm:shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <LiaChalkboardTeacherSolid className="text-white text-2xl sm:text-3xl" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-green-600 transition-colors duration-300">
                    For Teachers
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6 group-hover:text-gray-700 transition-colors duration-300">
                    Manage classes, create assessments, grade assignments, and engage with students 
                    through our comprehensive teaching platform.
                  </p>
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {['Class Management', 'Quiz Creation', 'Grade Assignment', 'Student Analytics'].map((feature) => (
                      <div key={feature} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                        <FiCheckCircle className="text-green-500 flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Admin Card */}
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="group relative bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 left-0 right-0 h-1 sm:h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
                <div className="p-6 sm:p-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl sm:shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <RiAdminLine className="text-white text-2xl sm:text-3xl" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-purple-600 transition-colors duration-300">
                    For Administrators
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6 group-hover:text-gray-700 transition-colors duration-300">
                    Oversee institution operations, manage academic systems, and access powerful 
                    analytics with comprehensive administrative tools.
                  </p>
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {['System Management', 'Analytics Dashboard', 'User Management', 'Institution Settings'].map((feature) => (
                      <div key={feature} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                        <FiCheckCircle className="text-green-500 flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 py-10 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 text-center w-full"
          >
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Ready to Transform Education?
            </h2>
            <p className="text-base sm:text-xl text-blue-100 mb-6 sm:mb-10 max-w-xl sm:max-w-2xl mx-auto px-4">
              Join thousands of educational institutions already using EduPortal to enhance their teaching and learning experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <span>Get Started Today</span>
                <FiArrowRight className="text-base sm:text-lg" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl hover:bg-white/10 transition-all duration-300 text-sm sm:text-base"
              >
                Schedule a Demo
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="min-h-[300px] sm:min-h-[400px] flex items-center justify-center bg-white py-10 sm:py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-6xl mx-auto px-4 sm:px-6 text-center w-full"
          >
            <motion.div variants={itemVariants} className="mb-8 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Why Choose EduPortal?
              </h2>
              <p className="text-base sm:text-xl text-gray-600 max-w-2xl sm:max-w-3xl mx-auto px-4">
                Discover the features that make our platform the preferred choice for educational institutions worldwide.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              {[
                {
                  icon: FiTrendingUp,
                  title: "Real-time Analytics",
                  description: "Track student progress and engagement with comprehensive analytics and detailed reporting tools."
                },
                {
                  icon: FiAward,
                  title: "Quality Education",
                  description: "Access to high-quality educational resources, interactive tools, and proven learning methodologies."
                },
                {
                  icon: FiUsers,
                  title: "Collaborative Learning",
                  description: "Foster collaboration between students and teachers with interactive forums and group projects."
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="text-center group px-4"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="text-white text-xl sm:text-2xl" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}