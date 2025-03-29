import { ReactNode } from "react";

export interface User {
  id: any;
  userid: string;
  created_at: string;
  name: string | null;
  email: string | null;
  password?: string | null; // We generally don't receive this from the database
  phone: number | null;
  university_id: string | null;
  department: string | null;
  role: string | null;
  profile_image: string | null;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface Item {
  product_type: string;
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  category: string;
  description: string;
  seller_id: string;
  price: number;
  status: string;
  images?: string[];
}

export interface FAQ {
  id: string;
  item_id: string;
  user_id: string | null;
  question: string;
  answer: string | null;
  created_at: string;
  answered_at: string | null;
  user_name: string;
  is_answered: boolean;
}

export interface Message {
  id: string;
  sent_at: string;
  sender_id: string;
  reciver_id: string;
  listing_id: number;
  message: string;
  sender_name?: string;
  sender_profile_image?: string;
}

// Export these interfaces in a barrel pattern to ensure usage
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Consider creating a types index file that re-exports these types
// or use them in your components directly
