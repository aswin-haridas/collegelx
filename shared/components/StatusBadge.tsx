import React from "react";
import { styles } from "@/shared/lib/styles";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
}) => {
  // Determine color based on status with warm theme
  const getBadgeColor = () => {
    switch (status.toLowerCase()) {
      case "available":
        return {
          bg: "#E6F2E8", // Light green with warmth
          text: "#2F6B35", // Dark green with warmth
        };
      case "pending":
        return {
          bg: "#FEF3C7", // Warm yellow
          text: "#92400E", // Amber brown
        };
      case "unlisted":
        return {
          bg: styles.warmBorder,
          text: styles.warmText,
        };
      case "sold":
        return {
          bg: "#DCE6F2", // Light blue with warmth
          text: "#295B9E", // Warm blue
        };
      default:
        return {
          bg: styles.warmAccent,
          text: "#ffffff",
        };
    }
  };

  const colors = getBadgeColor();

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${className}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
