export interface User {
  id: string;
<<<<<<< HEAD
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
=======
  email: string;
  name: string;
  role?: string;
  department?: string;
  university_id?: string;
  year?: string;
  profile_image?: string;
  created_at: string;
  phone?: string;
>>>>>>> feature
}

export interface Item {
  id: string;
  title: string;
<<<<<<< HEAD
  description: string;
  price: number;
  imageUrl: string;
  images: string[];
  status: "available" | "pending" | "sold";
  seller_id: string;
  user_id: string;
  category: string;
  condition: string;
  sender_id?: string; 
  seller?: string; 
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
=======
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
>>>>>>> feature
}



export interface Message {
  id: string;
<<<<<<< HEAD
  sender_id: string;
  receiver_id: string;
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
=======
  created_at: string;
  seller_id: string | null;
  buyer_id: string | null;
  message: string | null;
  product_id: string | null;
}

export interface Chat {
  id: number;
  created_at: string;
  product_id: string | null;
  buyer_id: string | null;
  seller_id: string | null;
}

>>>>>>> feature
