// Types for users
export interface User {
  id: string;
  userid?: string;
  name?: string;
  email: string;
  profile_image?: string;
  department?: string;
  university_id?: string;
  year?: string;
  phone?: string;
  role?: string;
  created_at: string;
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
