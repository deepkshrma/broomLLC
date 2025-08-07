import React from "react";

function TogglebuttonSmall({ isOn, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`w-12 h-6 flex items-center rounded-full p-[2px] transition-all duration-300 ease-in-out cursor-pointer shadow-md
        ${isOn ? "bg-green-500" : "bg-blue-500"}
      `}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full  transform transition-transform duration-300 ease-in-out
          ${isOn ? "translate-x-6" : "translate-x-0"}
        `}
      />
    </button>
  );
}

export default TogglebuttonSmall;
