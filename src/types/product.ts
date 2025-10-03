export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  subtext?: string;
  notes?: {
    top?: string;
    heart?: string;
    base?: string;
  };
  href?: string;
  hoverImage?: string;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  tag?: string;
  category?: string;
  slug?: string;
  _id?: string;
} 