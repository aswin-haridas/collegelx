import React from "react";
import TabButton from "./Atoms/TabButton";
import { styles } from "@/shared/lib/styles";

interface Tab {
  id: string;
  label: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <div
        className="flex"
        style={{ borderBottom: `1px solid ${styles.warmBorder}` }}
      >
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            isActive={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
