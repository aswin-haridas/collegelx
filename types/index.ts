export type Listing = {
  id: string; // uuid
  user_id: string; // uuid
  category_id: number; // int4
  title: string; // varchar
  description: string; // text
  price: number; // numeric
  condition: string; // varchar
  status: string; // varchar
  images: string[]; // _text (string[])
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
};

export type User = {
  id: string; // uuid
  email: string; // varchar
  username: string; // varchar
  full_name: string; // varchar
  profile_picture: string; // varchar
  college_id: string; // varchar
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
  is_active: boolean; // bool
  // Fields from old User type that are not in the schema, remove if not needed elsewhere
  // department: string;
  // role: string;
  // password: string; 
  // phone: number;
};

export type Transaction = {
  id: string; // uuid
  listing_id: string; // uuid
  buyer_id: string; // uuid
  seller_id: string; // uuid
  amount: number; // numeric
  status: string; // varchar
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
};

export type Review = {
  id: string; // uuid
  transaction_id: string; // uuid
  reviewer_id: string; // uuid
  reviewed_user_id: string; // uuid
  rating: number; // int4
  comment: string; // text
  created_at: string; // timestamptz
};

export type ChatRoom = {
  id: string; // uuid
  listing_id: string; // uuid
  buyer_id: string; // uuid
  seller_id: string; // uuid
  created_at: string; // timestamptz
  last_message_at: string; // timestamptz
};

export type ChatMessage = {
  id: string; // uuid
  chat_room_id: string; // uuid
  sender_id: string; // uuid
  message: string; // text
  created_at: string; // timestamptz
  is_read: boolean; // bool
};

export type Category = {
  id: number; // int4
  name: string; // varchar
  description: string; // text
  created_at: string; // timestamptz
};

export type Conversation = {
  id: string;
  listing_id: string;
  listing_name: string;
  participant_id: string;
  participant_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
};
