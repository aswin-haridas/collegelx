export interface User {
  id: string;
  userid?: string;
  name?: string;
  email?: string;
  profile_image?: string;
  created_at?: string;
  updated_at?: string;
  password?: string | null;
  phone?: string | number | null;
  university_id?: string | null;
  department?: string | null;
  role?: string | null;
  year?: string | null;
  rating?: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface Item {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  price?: number;
  image?: string;
  images: string[];
  imageUrl?: string;
  status?: "available" | "pending" | "sold";
  seller_id?: string;
  seller_id_id?: string;
  user_id?: string;
  sender_id?: string;
  seller?: string;
  created_at?: string;
  updated_at?: string;
  category?: string;
  condition?: string;
}

export interface WishlistItem extends Item {
  added_at?: string;
  wishlist_id?: string;
}

export interface Review {
  id: string;
  user_id: string;
  reviewer_id: string;
  reviewer_name?: string;
  rating: number;
  comment: string;
  created_at: string;
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
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  item_id?: string;
  read?: boolean;
  sender_name?: string;
  receiver_name?: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender_name?: string;
}

export interface Conversation {
  id: string;
  listing_id: string;
  listing_title: string;
  participant_id: string;
  participant_name: string;
  last_message: string;
  last_message_time: string;
  unread_count?: number;
}

export interface ListingInfo {
  title: string;
  price: number;
  id: string;
}

export interface ItemEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  onItemUpdated: () => void;
}

export interface ProfileHeaderProps {
  user: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface PayloadType {
  [key: string]: any;
}
