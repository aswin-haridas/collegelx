import { useState, useCallback } from "react";
import { supabase } from "@/shared/lib/supabase";
import { Review } from "@/shared/lib/types";
import { useAuth } from "@/app/auth/useAuth";
import { useRating } from "./useRating";

export function useReview(
  profileId: string | null,
  currentUserId: string | null
) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isPostingReview, setIsPostingReview] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
  });
  const { userName } = useAuth();
  const { averageRating, calculateAverageRating } = useRating(reviews);

  // Fetch only the data needed for display
  const fetchUserReviews = useCallback(async () => {
    if (!profileId) return;

    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, reviewer_name, rating, comment, created_at")
        .eq("user_id", profileId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setReviews(data || []);
      calculateAverageRating(data || []);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
    }
  }, [profileId, calculateAverageRating]);

  const handleReviewInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const value =
        e.target.name === "rating" ? parseInt(e.target.value) : e.target.value;
      setReviewData((prev) => ({ ...prev, [e.target.name]: value }));
    },
    []
  );

  const handlePostReview = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!currentUserId || !profileId) {
        alert("You must be logged in to post a review");
        return;
      }

      if (!reviewData.comment.trim()) {
        alert("Please enter a review comment");
        return;
      }

      setIsPostingReview(true);

      try {
        const reviewerName = userName || "Anonymous";

        const { data, error } = await supabase
          .from("reviews")
          .insert([
            {
              user_id: profileId,
              reviewer_name: reviewerName,
              rating: reviewData.rating,
              comment: reviewData.comment,
              created_at: new Date().toISOString(),
            },
          ])
          .select("id, reviewer_name, rating, comment, created_at");

        if (error) throw error;

        setReviews((prev) => [data[0], ...prev]);
        setReviewData({ rating: 5, comment: "" });
        calculateAverageRating([data[0], ...reviews]);
      } catch (error) {
        console.error("Error posting review:", error);
        alert("Failed to post review. Please try again.");
      } finally {
        setIsPostingReview(false);
      }
    },
    [
      currentUserId,
      profileId,
      reviewData,
      userName,
      reviews,
      calculateAverageRating,
    ]
  );

  return {
    reviews,
    isPostingReview,
    setIsPostingReview,
    reviewData,
    handleReviewInputChange,
    handlePostReview,
    fetchUserReviews,
    averageRating,
  };
}
