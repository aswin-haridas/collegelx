import { useState, useCallback } from "react";
import { Review } from "@/shared/lib/types";

export function useRating(reviews: Review[]) {
  const [averageRating, setAverageRating] = useState<number>(0);

  const calculateAverageRating = useCallback((reviewData: Review[]) => {
    if (!reviewData || reviewData.length === 0) {
      setAverageRating(0);
      return;
    }

    const sum = reviewData.reduce((total, review) => total + review.rating, 0);
    const average = sum / reviewData.length;
    setAverageRating(Number(average.toFixed(1)));
  }, []);

  return { averageRating, calculateAverageRating };
}
