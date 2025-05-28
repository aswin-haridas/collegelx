import { useState, useCallback } from "react";

export function useRating() {
  const [averageRating, setAverageRating] = useState<number>(0);

  const calculateAverageRating = useCallback((reviewData: []) => {
    if (!reviewData || reviewData.length === 0) {
      setAverageRating(0);
      return;
    }

    const sum = reviewData.reduce((total, review) => total + review, 0);
    const average = sum / reviewData.length;
    setAverageRating(Number(average.toFixed(1)));
  }, []);

  return { averageRating, calculateAverageRating };
}
