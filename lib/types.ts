export interface User {
    id: string;
    aikNumber: string;
    role: 'student' | 'admin';
  }
  
  export interface Item {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    sellerId: string;
    approved: boolean;
  }