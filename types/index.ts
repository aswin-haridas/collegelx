export type ChatRoom = {
  id: string; // uuid
  listing_id?: string; // uuid
  buyer_id?: string; // uuid
  seller_id?: string; // uuid
  created_at?: string; // timestamp with time zone
  last_message_at?: string; // timestamp with time zone
};

export type Listing = {
  id: string; // uuid
  owner?: string; // uuid
  name: string; // text
  description: string; // text
  price: number; // numeric(10,2)
  condition: string; // text
  status?: string; // text
  images?: string[]; // text[]
  created_at?: Date | undefined; // timestamp with time zone
  updated_at?: string; // timestamp with time zone
  category?: string; // text
  tags?: string[]; // text[]
};

export type Review = {
  id: string; // uuid
  transaction_id?: string; // uuid
  reviewer_id?: string; // uuid
  reviewed_user_id?: string; // uuid
  rating: number; // integer
  comment?: string; // text
  created_at?: string; // timestamp with time zone
};

export type Transaction = {
  id: string; // uuid
  listing_id?: string; // uuid
  buyer_id?: string; // uuid
  seller_id?: string; // uuid
  amount: number; // numeric(10,2)
  status: string; // text
  created_at?: string; // timestamp with time zone
  updated_at?: string; // timestamp with time zone
};

export type User = {
  id: string; // uuid
  email: string; // text
  full_name: string; // text
  profile_picture?: string; // text
  college_id: string; // text
  created_at?: string; // timestamp with time zone
  updated_at?: string; // timestamp with time zone
  is_active?: boolean; // boolean
  department?: string; // text
  password?: string; // text
  phone?: string; // text
  role: string;
};
