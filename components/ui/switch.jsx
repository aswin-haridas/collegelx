import { useState } from "react";


const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-green-500 peer transition-all">
        <div
          className={`w-4 h-4 bg-white rounded-full absolute top-0.5 left-1 transition-all ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
    </label>
  );
};

export default ToggleSwitch;
