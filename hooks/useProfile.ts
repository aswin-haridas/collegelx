import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase"; 
import { Listing, User, Review } from "@/types/index.ts"; 

export const useProfile = (userId: string | null) => {
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]); 
  const [wishlist, setWishlist] = useState<Listing[]>([]); 
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  // Define column strings for consistency and maintainability
  const userColumns = "id, email, username, full_name, profile_picture, college_id, created_at, updated_at, is_active";
  const listingColumns = "id, user_id, category_id, title, description, price, condition, status, images, created_at, updated_at";
  const reviewColumns = "id, transaction_id, reviewer_id, reviewed_user_id, rating, comment, created_at";

  const fetchUserData = useCallback(async (id: string) => {
    const { data, error: userError } = await supabase
      .from("users")
      .select(userColumns) 
      .eq("id", id)
      .single();
    if (userError) throw userError;
    setUser(data as User | null);
    return data as User | null;
  }, []);

  const fetchUserListings = useCallback(async (id: string) => { 
    const { data, error: listingsError } = await supabase
      .from("listings")
      .select(listingColumns) // MODIFIED: Specific columns
      .eq("user_id", id);
    if (listingsError) throw listingsError;
    setListings(data as Listing[] || []);
    return data as Listing[] || [];
  }, []);

  const fetchUserReviews = useCallback(async (id: string) => { 
    const { data, error: reviewsError } = await supabase
      .from("reviews")
      .select(reviewColumns) // MODIFIED: Specific columns
      .eq("reviewed_user_id", id)
      .order("created_at", { ascending: false });
    if (reviewsError) throw reviewsError;
    setReviews(data as Review[] || []);
    return data as Review[] || [];
  }, []);

  const fetchUserWishlist = useCallback(async (id: string) => { 
    const { data, error: wishlistError } = await supabase
      .from('wishlist')
      .select(`listings (${listingColumns})`) // MODIFIED: Specific columns for nested listings
      .eq('user_id', id);

    if (wishlistError) throw wishlistError;
    
    const userWishlist = data?.map(item => item.listings).filter(Boolean) as Listing[] || [];
    setWishlist(userWishlist);
    return userWishlist;
  }, []);

  const fetchAllProfileData = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      // Using Promise.allSettled to ensure all fetches complete
      const results = await Promise.allSettled([
        fetchUserData(id),
        fetchUserListings(id),
        fetchUserReviews(id),
        fetchUserWishlist(id),
      ]);

      // Check for and log any rejected promises (errors)
      results.forEach(result => {
        if (result.status === 'rejected') {
          console.error("Error in fetchAllProfileData sub-fetch:", result.reason);
          // Optionally set a general error state, or rely on individual fetch errors
        }
      });

    } catch (e: any) { // This catch block might be redundant if individual fetches handle their errors
      console.error("Error fetching profile data:", e);
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [fetchUserData, fetchUserListings, fetchUserReviews, fetchUserWishlist]);

  useEffect(() => {
    if (userId) {
      fetchAllProfileData(userId);
    } else {
      setLoading(false); 
      setUser(null);
      setListings([]);
      setWishlist([]);
      setReviews([]);
    }
  }, [userId, fetchAllProfileData]);
  
  const updateUserProfile = useCallback(
    async (formData: Partial<User>) => {
      if (!userId) return null; 
      try {
        const { data, error: updateError } = await supabase
          .from("users")
          .update(formData)
          .eq("id", userId)
          .select(userColumns) // MODIFIED: Specific columns
          .single();

        if (updateError) throw updateError;
        
        setUser(data as User); 
        return data as User;
      } catch (e: any) {
        console.error("Error updating user data:", e);
        setError(e.message);
        return null; 
      }
    },
    [userId]
  );

  const updateListing = useCallback( 
    async (listingId: string, updates: Partial<Listing>) => {
      if (!userId) return null;
      try {
        const { data, error: updateError } = await supabase
          .from("listings")
          .update(updates)
          .eq("id", listingId)
          .select(listingColumns) // MODIFIED: Specific columns
          .single();

        if (updateError) throw updateError;

        setListings((prevListings) =>
          prevListings.map((listing) =>
            listing.id === listingId ? { ...listing, ...data } : listing 
          )
        );
        return data as Listing;
      } catch (e: any) {
        console.error("Error updating listing:", e);
        setError(e.message);
        return null;
      } 
    },
    [userId]
  );

  return {
    user,
    listings, 
    reviews,
    wishlist, 
    loading,
    error,
    fetchAllProfileData, 
    updateUserProfile,
    updateListing, 
  };
};
