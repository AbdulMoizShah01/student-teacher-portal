"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export const WaitListModal = ({ }) => {
    const searchParams=useSearchParams();
    const isWaiting=searchParams.get("waitlist");
    
    const [isOpen, setIsOpen]= useState(false);
    const toggle = () =>{
        setIsOpen((prev)=>!prev);
    }

useEffect(()=>{
    setIsOpen(isWaiting);
},[isWaiting])

console.log("Waiting",isWaiting);
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") toggle();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [toggle, isOpen]);




  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={toggle}
      />

      <div className="relative w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="relative p-6 border-b border-gray-100">
            <div className="text-center">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-green-600 font-semibold">
                  Successfully joined the waitlist!
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Account has been Registered Successfully
              </h2>

              <p className="text-gray-600">
                You will be notified after your account gets approved
              </p>
            </div>

            <button
              onClick={toggle}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
