import React from "react";
import { styles } from "@/shared/lib/styles";

export const Button = ({
  content,
  onClick,
  type = "submit",
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      className={`py-2 px-4 rounded-lg text-white flex items-center justify-center ${className}`}
      style={{ backgroundColor: styles.warmPrimary }}
      disabled={disabled}
      onClick={onClick}
    >
      {content}
    </button>
  );
};
