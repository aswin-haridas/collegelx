import React from "react";
import { styles } from "@/shared/lib/styles";

interface ActionButtonProps {
  onClick: () => void;
  label: string;
  variant?: "primary" | "danger" | "warning" | "success";
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  label,
  variant = "primary",
}) => {
  const colorClasses = {
    primary: `bg-[${styles.warmPrimary}] hover:bg-[${styles.warmPrimaryDark}] text-white`,
    danger: "bg-red-500 hover:bg-red-600 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent row click when clicking the button
        onClick();
      }}
      className={`${colorClasses[variant]} py-1 px-2 rounded text-sm`}
      style={
        variant === "primary"
          ? { backgroundColor: styles.warmPrimary }
          : undefined
      }
    >
      {label}
    </button>
  );
};

export default ActionButton;
