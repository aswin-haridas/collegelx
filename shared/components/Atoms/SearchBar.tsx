import React from "react";
import { styles } from "@/shared/lib/styles";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full p-2 rounded-lg ${className}`}
      style={{
        border: `1px solid ${styles.warmBorder}`,
        color: styles.warmText,
      }}
    />
  );
};

export default SearchBar;
