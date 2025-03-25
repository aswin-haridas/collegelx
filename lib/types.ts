export interface User {
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
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  status: string;
  images?: string[]; // Changed from image_url to images to match usage in components
  imageUrl?: string; // For backward compatibility with ItemCard component
  image_url?: string[]; // For backward compatibility
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

// Export these interfaces in a barrel pattern to ensure usage
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
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

// Consider creating a types index file that re-exports these types
// or use them in your components directly
