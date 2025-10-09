import Header from "@/ui/globals/Header";

import { PiStudentBold } from "react-icons/pi";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { RiAdminLine } from "react-icons/ri";
import { WaitListModal } from "@/ui/modals/WaitListModal";

export default function Home() {
  return (
    <main className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <WaitListModal/>
      <Header />

      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          className="absolute w-full h-full object-cover"
        >
          <source src="/vid.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
              Welcome to
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {" "}
                Student Portal
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Empowering education through innovative technology. Connect,
              learn, and grow in a dynamic digital environment designed for
              academic excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <PiStudentBold color="white" size={30} />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                For Students
              </h3>
              <p className="text-gray-300">
                Access courses, submit assignments, and track your academic
                progress.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <LiaChalkboardTeacherSolid color="white" size={30} />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                For Teachers
              </h3>
              <p className="text-gray-300">
                Manage classes, grade assignments, and engage with students
                effectively.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <RiAdminLine color="white" size={30} />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                For Administrators
              </h3>
              <p className="text-gray-300">
                Oversee institution operations and manage academic systems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
