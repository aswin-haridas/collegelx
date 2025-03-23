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
  image_url?: string[]; // Array of image URLs for the item
}
