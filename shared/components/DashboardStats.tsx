import React from "react";
import StatCard from "./Atoms/StatCard";

interface DashboardStatsProps {
  userCount: number;
  itemCount: number;
  unlistedItemCount: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  userCount,
  itemCount,
  unlistedItemCount,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <StatCard title="Total Users" value={userCount} />
      <StatCard title="Total Products" value={itemCount} />
      <StatCard title="Unlisted Products" value={unlistedItemCount} />
    </div>
  );
};

export default DashboardStats;
