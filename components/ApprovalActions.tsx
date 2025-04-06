"use client";

import React, { useState } from "react";
import { styles } from "@/lib/styles";

import { Item } from "@/lib/types";

interface ApprovalActionsProps {
  item: Item;
}

const ApprovalActions = ({ item }: ApprovalActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/items/${item.id}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to approve item");
      }

      // Refresh the page to show updated data
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/items/${item.id}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to reject item");
      }

      // Refresh the page to show updated data
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleApprove}
        className="px-3 py-1 rounded"
        style={{ backgroundColor: styles.warmPrimary, color: "white" }}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Approve"}
      </button>
      <button
        onClick={handleReject}
        className="px-3 py-1 rounded"
        style={{ backgroundColor: "red", color: "white" }}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Reject"}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default ApprovalActions;
