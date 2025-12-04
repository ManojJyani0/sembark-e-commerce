import { ApiService, getApiInstance } from "~/services/api";
import type { CreateProductDto, Product, ProductFilters, ProductsResponse, UpdateProductDto } from "~/types";

// Initialize API service
const apiConfig = {
  baseURL: "https://fakestoreapi.com",
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
  },
};

const apiService = getApiInstance(apiConfig);

// Direct API methods for non-React contexts
export class ProductService {
  private api: ApiService;

  constructor() {
    this.api = getApiInstance(apiConfig);
  }

  // Get all products
  async getAllProducts(filters?: ProductFilters): Promise<ProductsResponse> {
    const response = await this.api.get<Product[]>('/products', { params: filters });
    
    // Since fakestoreapi returns array, we need to format it as ProductsResponse
    const products = response.data;
    return {
      products,
      total: products.length,
      limit: filters?.limit || products.length,
      offset: filters?.offset || 0,
    };
  }

  // Get single product
  async getProduct(id: number): Promise<Product> {
    const response = await this.api.get<Product>(`/products/${id}`);
    return response.data;
  }

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await this.api.get<Product[]>(`/products/category/${category}`);
    return response.data;
  }

  // Get all categories
  async getCategories(): Promise<string[]> {
    const response = await this.api.get<string[]>('/products/categories');
    return response.data;
  }

  // Create new product
  async createProduct(productData: CreateProductDto): Promise<Product> {
    const response = await this.api.post<Product>('/products', productData);
    return response.data;
  }

  // Update product
  async updateProduct(id: number, productData: UpdateProductDto): Promise<Product> {
    const response = await this.api.put<Product>(`/products/${id}`, productData);
    return response.data;
  }

  // Delete product
  async deleteProduct(id: number): Promise<{ id: number }> {
    const response = await this.api.delete<{ id: number }>(`/products/${id}`);
    return response.data;
  }
}

// Export singleton instance
export const productService = new ProductService();