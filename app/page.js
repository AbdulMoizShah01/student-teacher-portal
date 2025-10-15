import Header from "@/ui/globals/Header";
import { PiStudentBold } from "react-icons/pi";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { RiAdminLine } from "react-icons/ri";
import { WaitListModal } from "@/ui/modals/WaitListModal";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <WaitListModal />
      <Header />
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Enhanced video background with overlay */}
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
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-full animate-float opacity-60"></div>
        <div
          className="absolute top-1/3 right-1/4 w-6 h-6 bg-purple-400 rounded-full animate-float opacity-40"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-indigo-400 rounded-full animate-float opacity-50"
          style={{ animationDelay: "4s" }}
        ></div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-6xl mx-auto w-full">
          {/* Main heading with enhanced animation */}
          <div className="mb-8 sm:mb-12 animate-slide-in-top">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Welcome to
              <span className="block sm:inline-block mt-2 sm:mt-0 sm:ml-4 bg-gradient-to-r from-blue-400 via-purple-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
                Student Portal
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-light animate-slide-in-bottom">
              Empowering education through innovative technology. Connect,
              learn, and grow in a dynamic digital environment designed for
              academic excellence.
            </p>
          </div>

          {/* Enhanced cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-16 max-w-5xl mx-auto">
            {/* Student Card */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-300 animate-glow"></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:transform hover:scale-105 hover:rotate-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <PiStudentBold className="text-white text-2xl sm:text-3xl" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 group-hover:text-blue-200 transition-colors duration-300">
                  For Students
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  Access courses, submit assignments, and track your academic
                  progress with intuitive tools designed for success.
                </p>
              </div>
            </div>

            {/* Teacher Card */}
            <div className="group relative animate-slide-in-bottom animate-stagger-1">
              <div
                className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-300 animate-glow"
                style={{ animationDelay: "1s" }}
              ></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:transform hover:scale-105 hover:-rotate-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <LiaChalkboardTeacherSolid className="text-white text-2xl sm:text-3xl" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 group-hover:text-green-200 transition-colors duration-300">
                  For Teachers
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  Manage classes, grade assignments, and engage with students
                  effectively through our comprehensive teaching platform.
                </p>
              </div>
            </div>

            {/* Admin Card */}
            <div className="group relative animate-slide-in-bottom animate-stagger-2">
              <div
                className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-300 animate-glow"
                style={{ animationDelay: "2s" }}
              ></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:transform hover:scale-105 hover:rotate-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <RiAdminLine className="text-white text-2xl sm:text-3xl" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 group-hover:text-purple-200 transition-colors duration-300">
                  For Administrators
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  Oversee institution operations and manage academic systems
                  with powerful administrative tools and analytics.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="animate-slide-in-bottom animate-stagger-2">
            <button className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 sm:py-4 px-8 sm:px-12 rounded-2xl text-lg sm:text-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
              <span className="relative z-10">Get Started Today</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
