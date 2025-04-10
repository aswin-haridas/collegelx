// Types for users
export interface User {
  id: string;
  userid?: string;
  name: string;
  email: string;
  profile_image?: string;
  department?: string;
  university_id?: string;
  year?: string;
  phone?: string;
  role: string;
  created_at: string;
  rating?: number;
}

// Types for items
export interface Item {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  status: string;
  department: string;
  year: string;
  seller_id: string;
}

// Types for item sellers (subset of User)
export interface ItemSeller {
  id: string;
  name: string;
  email: string;
  profile_image?: string;
  department?: string;
  university_id?: string;
  year?: string;
  phone?: string;
  role?: string;
}

// Types for wishlist
export interface WishlistItem {
  id: number;
  user_id: string;
  product_id: string;
  created_at: string;
}

// Hook return types
export interface UseItemReturn {
  item: Item | null;
  loading: boolean;
  error: Error | null;
  seller: ItemSeller | null;
  sellerLoading: boolean;
}

export interface UseItemsReturn {
  items: Item[];
  loading: boolean;
  error: Error | null;
  getItem: (id: string) => Promise<UseItemReturn>;
  addItem: (item: Omit<Item, "id" | "created_at">) => Promise<Item>;
  updateItem: (id: string, updates: Partial<Item>) => Promise<Item>;
  deleteItem: (id: string) => Promise<boolean>;
  refreshItems: () => Promise<void>;
  markItemAsSold: (id: string) => Promise<boolean>;
}

export interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  reciever_id: string;
  message: string;
  created_at: string;
  listing_id: string;
  sender_name?: string;
  reciver_name?: string;
}

// Define a new type for grouped conversations
export interface Conversation {
  id: string; // unique identifier for the conversation
  listing_id: string;
  listing_title: string; // Add this field for storing the listing title
  participant_id: string;
  participant_name: string;
  last_message: string;
  last_message_time: string;
  unread_count?: number;
}