export type Item = {
  id: string;
  owner: string;
  name: string;
  description: string;
  price: number;
  condition: string;
  status: string;
  images: string[];
  category: string;
  tags: string[];
};

export type User = {
  id: string;
  email: string;
  full_name: string;
  profile_pictrue: string;
  college_id: number;
  is_active: boolean;
  department: string;
  role: string;
  password: string;
  phone: number;
};
