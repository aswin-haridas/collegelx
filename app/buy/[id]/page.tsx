import Header from "@/shared/components/Header";
// Import the server client
import { createSupabaseServerClient } from '@/shared/lib/supabase/server';
import ProductDetailClientView from "./components/ProductDetailClientView";
import { Item, User } from "@/types"; // Assuming User type is correctly defined for seller
import { notFound } from "next/navigation"; // For handling item not found
// Note: The client-side 'supabase' import might be removed if only server client is used here.
// For now, we keep it if ProductDetailClientView or other parts might need it,
// but the server-side fetching will use createSupabaseServerClient.
// Actually, the original supabase client from shared/lib/supabase is fine for server components too if not using user-specific auth.
// However, to get user session on server, we need the server client.
// Let's remove the old one if all data fetching is done with the new server client.
// For this step, the server client is specifically for auth & user-specific data.
// The initial item fetch could technically use the old client if it doesn't need auth context,
// but it's cleaner to use the server client for all server-side Supabase calls.
// Let's adjust the initial item fetch to use the new server client as well.

interface ItemPageProps {
  params: { id: string };
}

// Define a more specific type for the item with seller information
type ItemWithSeller = Item & {
  seller_id: User | null; // Or Partial<User> if not all fields are selected
};

export default async function ItemPage({ params }: ItemPageProps) {
  const supabase = createSupabaseServerClient(); // Create server client
  const { id: itemId } = params;

  // Fetch item data using the server client
  const { data: item, error: itemError } = await supabase
    .from("listings")
    .select("*, seller_id (id, full_name, profile_picture, department)")
    .eq("id", itemId)
    .single<ItemWithSeller>();

  if (itemError || !item) {
    console.error("Error fetching item or item not found:", itemError?.message);
    notFound();
  }

  // Fetch user
  const { data: { user } } = await supabase.auth.getUser();

  // Determine if the current user is the seller
  const isSeller = !!user && !!item?.seller_id && user.id === item.seller_id.id;

  // Fetch wishlist status
  let isWishlistedInitial = false;
  if (user && item) {
    const { data: wishlistItem, error: wishlistError } = await supabase
      .from("wishlist")
      .select("id")
      .eq("product_id", itemId) // Use itemId (params.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (wishlistError) {
      console.error("Error fetching wishlist status:", wishlistError.message);
      // Not critical, default to false
    }
    isWishlistedInitial = !!wishlistItem;
  }

  return (
    <>
      <Header />
      <ProductDetailClientView
        item={item}
        user={user}
        isSeller={isSeller}
        isWishlistedInitial={isWishlistedInitial}
      />
    </>
  );
}
