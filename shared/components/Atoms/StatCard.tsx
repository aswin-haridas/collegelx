import React from "react";
import { styles } from "@/shared/lib/styles";

interface StatCardProps {
  title: string;
  value: number | string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  className = "",
}) => {
  return (
    <div className={`p-4 bg-white rounded-lg shadow ${className}`}>
      <h3 className="text-2xl font-bold" style={{ color: styles.warmPrimary }}>
        {value}
      </h3>
      <p style={{ color: styles.warmText }}>{title}</p>
    </div>
  );
};

export default StatCard;
