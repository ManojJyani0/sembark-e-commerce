
export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;

}

export interface CreateProductDto {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  rating?: Partial<Rating>;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  limit?: number;
  offset?: number;
  sortBy?: 'price' | 'rating' | 'title';
  order?: 'asc' | 'desc';
  inStock?: boolean
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}

export interface CategoriesResponse {
  categories: string[];
}

export interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  helpful: number;
}