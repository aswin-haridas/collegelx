import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

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
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const { userName } = useAuth();

  // Calculate average rating from reviews
  const calculateAverageRating = useCallback((reviewList: Review[]) => {
    if (!reviewList || reviewList.length === 0) {
      setAverageRating(null);
      return;
    }

    const sum = reviewList.reduce((total, review) => total + review.rating, 0);
    const avg = parseFloat((sum / reviewList.length).toFixed(1));
    setAverageRating(avg);
  }, []);

  const fetchUserReviews = async () => {
    if (!profileId) return;
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("user_id", profileId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
      calculateAverageRating(data || []);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
    }
  };

  const handleReviewInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const value =
      e.target.name === "rating" ? parseInt(e.target.value) : e.target.value;
    setReviewData({ ...reviewData, [e.target.name]: value });
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUserId || !profileId) {
      alert("You must be logged in to post a review");
      return;
    }

    // Validate input
    if (!reviewData.comment.trim()) {
      alert("Please enter a review comment");
      return;
    }

    try {
      // Use the userName from useAuth instead of querying the database
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
        .select();

      if (error) throw error;

      if (data) {
        // Correctly append the new review to the beginning of the reviews array
        const updatedReviews = [data[0], ...reviews];
        setReviews(updatedReviews);
        calculateAverageRating(updatedReviews);
        setReviewData({ rating: 5, comment: "" });
        setIsPostingReview(false);
      }
    } catch (error) {
      console.error("Error posting review:", error);
      alert("Failed to post review. Please try again.");
    }
  };

  // Run calculation when reviews change
  useEffect(() => {
    calculateAverageRating(reviews);
  }, [reviews, calculateAverageRating]);

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
