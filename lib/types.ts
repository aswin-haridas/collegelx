export interface User {
  id: string;
  userid: string;
  name: string;
  email: string;
  profile_image: string;
  password: string | null;
  phone: string | number | null;
  university_id: string | null;
  department: string | null;
  role: string | null;
  year: string | null;
  rating: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  images: string[];
  status: "available" | "pending" | "sold";
  seller_id: string;
  user_id: string;
  category: string;
  condition: string;
}

export interface WishlistItem extends Item {
  wishlist_id: string;
}

export interface Review {
  id: string;
  user_id: string;
  reviewer_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
}

export interface Message {
  id: string;
  sender_id: string;
  reciever_id: string;
  content: string;
  item_id: string;
  read: boolean;
  sender_name: string;
  receiver_name: string;
  listing_id: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  content: string;
  sender_name: string;
}
