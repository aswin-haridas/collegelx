import { useState, useCallback } from "react";
import { Review } from "@/types/index.ts"; // MODIFIED: Import path

// Parameter name 'reveiws' has a typo, should be 'reviews' if it's meant to be used.
// However, it's not used in the current implementation of calculateAverageRating.
// calculateAverageRating takes reviewData as a parameter.
export function useRating(initialReviews?: Review[]) { // Made parameter optional and typed
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

  // Optional: Initial calculation if initialReviews are provided
  useEffect(() => {
    if (initialReviews) {
      calculateAverageRating(initialReviews);
    }
  }, [initialReviews, calculateAverageRating]);

  return { averageRating, calculateAverageRating };
}
