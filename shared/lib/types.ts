export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  department?: string;
  university_id?: string;
  year?: string;
  profile_image?: string;
  created_at: string;
  phone?: string;
}

export interface Item {
  id: string;
  title: string;
  name?: string;
  description: string;
  price: number;
  category: string;
  year: string;
  department: string;
  status: string;
  images: string[];
  created_at: string;
  user_id: string;
  seller_id: string;
}

export interface Review {
  id: string;
  user_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  listing_id: string;
  listing_title: string;
  participant_id: string;
  participant_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  listing_id: string;
  message: string;
  created_at: string;
}

export interface Listing {
  id: string;
  title: string;
  price: number;
}
