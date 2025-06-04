import React from "react";
import { LoaderCircle } from "lucide-react";

export const Loading = () => {
  return (
    <div className="flex items-center justify-center">
      <LoaderCircle className="animate-spin " />
    </div>
  );
};

export const LoadingSpinner = () => {
  return (
    <svg
      className="h-10 w-10 animate-spin overflow-visible"
      viewBox="0 0 40 40"
    >
      <circle
        className="opacity-10 transition-colors"
        cx="20"
        cy="20"
        r="17.5"
        pathLength="100"
        strokeWidth="5px"
        fill="none"
      />
      <circle
        className="[stroke-dasharray:25,75] [stroke-dashoffset:0] stroke-linecap-round transition-colors"
        cx="20"
        cy="20"
        r="17.5"
        pathLength="100"
        strokeWidth="5px"
        fill="none"
      />
    </svg>
  );
};
