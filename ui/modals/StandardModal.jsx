"use client";

import { useRef } from "react";

const StandardModal = ({ isOpen, setisOpen, children }) => {
  const ref = useRef();
  const listener = (e) => {
    if (ref?.current) {
      if (!ref?.current?.contains(e?.target)) {
        setisOpen(false);
      }
    }
  };

  return (
    <div
      onClick={listener}
      className={`fixed ${
        isOpen ? "scale-100" : "scale-0"
      } transition-all flex items-center justify-center top-0 left-0 bg-[rgba(0,0,0,0.5)] h-screen w-screen`}
    >
      <div
        ref={ref}
        className="max-h-screen scrollbar-hidden  min-w-[300px] bg-white rounded-2xl shadow-black  max-w-screen overflow-y-scroll"
      >
        {children}
      </div>
    </div>
  );
};

export default StandardModal;
