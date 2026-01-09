export interface Review {
  _id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  avatarUrl?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'Men' | 'Women' | 'Kids';
  type: string;
  images: { url: string; publicId?: string }[];
  sizes: string[];
  stockQuantity: number;
  reviews: Review[];
  featured?: boolean;
}
