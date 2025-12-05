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

// Helper interface for enhanced product
interface EnhancedProduct extends Product {
  sku?: string;
  tags?: string[];
  brand?: string;
  stock?: number;
  discountPercentage?: number;
  inStock?: boolean;
}

// Direct API methods for non-React contexts
export class ProductService {
  private api: ApiService;

  constructor() {
    this.api = getApiInstance(apiConfig);
  }

  // Get all products with comprehensive filtering
  async getAllProducts(filters?: ProductFilters): Promise<ProductsResponse> {
    try {
      // First, get all products from the API
      const response = await this.api.get<Product[]>('/products');
      let products = response.data as EnhancedProduct[];
      
      // Enhance products with additional data for better search/filtering
      products = this.enhanceProducts(products);
      
      // Apply all filters locally since fakestoreapi has limited filtering support
      const filteredProducts = this.applyAllFilters(products, filters);
      
      // Apply sorting
      const sortedProducts = this.applySorting(filteredProducts, filters?.sortBy, filters?.order);
      
      // Apply pagination
      const offset = filters?.offset || 0;
      const limit = filters?.limit || sortedProducts.length;
      const paginatedProducts = sortedProducts.slice(offset, offset + limit);
      
      return {
        products: paginatedProducts,
        total: sortedProducts.length,
        limit: limit,
        offset: offset,
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Enhance products with additional fields for better search
  private enhanceProducts(products: Product[]): EnhancedProduct[] {
    return products.map((product, index) => ({
      ...product,
      sku: `SKU-${String(product.id).padStart(3, '0')}`,
      tags: this.generateTags(product.category, product.title),
      brand: this.extractBrand(product.title),
      stock: Math.floor(Math.random() * 100) + 10, // Mock stock data
      discountPercentage: Math.random() > 0.7 ? Math.floor(Math.random() * 40) + 10 : 0,
      inStock: Math.random() > 0.1, // Mock in-stock status
    }));
  }

  private generateTags(category: string, title: string): string[] {
    const tags = [category.toLowerCase()];
    
    // Add tags based on title keywords
    const titleWords = title.toLowerCase().split(' ');
    const commonTags = ['new', 'sale', 'popular', 'trending', 'best', 'featured'];
    
    titleWords.forEach(word => {
      if (word.length > 3 && !tags.includes(word) && !commonTags.includes(word)) {
        tags.push(word);
      }
    });
    
    // Add some random common tags
    if (Math.random() > 0.5) {
      const randomTag = commonTags[Math.floor(Math.random() * commonTags.length)];
      if (!tags.includes(randomTag)) {
        tags.push(randomTag);
      }
    }
    
    return tags.slice(0, 5); // Limit to 5 tags
  }

  private extractBrand(title: string): string {
    const brands = ['Nike', 'Adidas', 'Apple', 'Samsung', 'Sony', 'Microsoft', 'Dell', 'HP', 'Levi\'s', 'Zara'];
    
    // Check if any brand name appears in the title
    const foundBrand = brands.find(brand => 
      title.toLowerCase().includes(brand.toLowerCase())
    );
    
    return foundBrand || 'Generic';
  }

  // Apply all filters to products
  private applyAllFilters(products: EnhancedProduct[], filters?: ProductFilters): EnhancedProduct[] {
    if (!filters) return products;
    
    return products.filter(product => {
      // 1. Category filter
      if (filters.category && !this.matchesCategory(product.category, filters.category)) {
        return false;
      }
      
      // 2. Price range filter
      if (filters.minPrice !== undefined && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
        return false;
      }
      
      // 3. Rating filter
      if (filters.minRating !== undefined && product.rating.rate < filters.minRating) {
        return false;
      }
      
      // 4. Search filter (most important - searches across multiple fields)
      if (filters.search && !this.matchesSearch(product, filters.search)) {
        return false;
      }
      
      // 5. In-stock filter (if needed in future)
      if (filters.hasOwnProperty('inStock') && product.inStock !== filters.inStock) {
        return false;
      }
      
      return true;
    });
  }

  // Category matching with support for multiple categories
  private matchesCategory(productCategory: string, filterCategory: string): boolean {
    const productCat = productCategory.trim().toLowerCase();
    const filterCats = filterCategory.split(',').map(cat => cat.trim().toLowerCase());
    
    // If multiple categories are specified, check if product belongs to any of them
    return filterCats.some(cat => 
      cat === productCat || 
      productCat.includes(cat) || 
      cat.includes(productCat)
    );
  }

  // Comprehensive search across all relevant fields
  private matchesSearch(product: EnhancedProduct, searchQuery: string): boolean {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) return true;
    
    // Search in all relevant fields with different weights
    const searchFields = [
      { value: product.title.toLowerCase(), weight: 3 }, // Highest weight
      { value: product.description.toLowerCase(), weight: 2 },
      { value: product.category.toLowerCase(), weight: 2 },
      { value: product.sku?.toLowerCase() || '', weight: 1 },
      { value: product.brand?.toLowerCase() || '', weight: 2 },
      { value: product.tags?.join(' ').toLowerCase() || '', weight: 1 },
    ];
    
    // Check if query appears in any field
    return searchFields.some(field => {
      if (!field.value) return false;
      
      // Exact match check
      if (field.value === query) return true;
      
      // Contains check
      if (field.value.includes(query)) return true;
      
      // Word boundary check for multi-word queries
      if (query.includes(' ')) {
        const queryWords = query.split(' ');
        return queryWords.every(word => field.value.includes(word));
      }
      
      return false;
    });
  }

  // Apply sorting to products
  private applySorting(products: EnhancedProduct[], sortBy?: string, order?: 'asc' | 'desc'): EnhancedProduct[] {
    if (!sortBy) return products;
    
    const sorted = [...products].sort((a, b) => {
      const dir = order === 'desc' ? -1 : 1;
      
      
      switch (sortBy) {
        case 'price':
          return (a.price - b.price) * dir;
          
        case 'rating':
          return (a.rating.rate - b.rating.rate) * dir;
          
        case 'title':
          return a.title.localeCompare(b.title) * dir;
          
        case 'popularity':
          return (a.rating.count - b.rating.count) * dir;
          
        case 'discount':
          const discountA = a.discountPercentage || 0;
          const discountB = b.discountPercentage || 0;
          return (discountB - discountA) * dir; // Higher discount first
          
        case 'newest':
          return (b.id - a.id) * dir; // Higher ID (assumed newer) first
          
        default:
          return 0;
      }
    });
    
    return sorted;
  }

  // Get price statistics for filters
  async getPriceStatistics(): Promise<{
    min: number;
    max: number;
    avg: number;
    median: number;
  }> {
    try {
      const response = await this.api.get<Product[]>('/products');
      const prices = response.data.map(p => p.price).sort((a, b) => a - b);
      
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
      
      // Calculate median
      const middle = Math.floor(prices.length / 2);
      const median = prices.length % 2 === 0
        ? (prices[middle - 1] + prices[middle]) / 2
        : prices[middle];
      
      return { min, max, avg, median };
    } catch (error) {
      console.error('Error fetching price statistics:', error);
      throw error;
    }
  }

  // Get rating statistics
  async getRatingStatistics(): Promise<{
    min: number;
    max: number;
    avg: number;
    distribution: Record<string, number>;
  }> {
    try {
      const response = await this.api.get<Product[]>('/products');
      const ratings = response.data.map(p => p.rating.rate);
      
      const min = Math.min(...ratings);
      const max = Math.max(...ratings);
      const avg = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      
      // Calculate rating distribution
      const distribution: Record<string, number> = {
        '1-2': 0,
        '2-3': 0,
        '3-4': 0,
        '4-5': 0,
      };
      
      ratings.forEach(rating => {
        if (rating >= 4) distribution['4-5']++;
        else if (rating >= 3) distribution['3-4']++;
        else if (rating >= 2) distribution['2-3']++;
        else distribution['1-2']++;
      });
      
      return { min, max, avg, distribution };
    } catch (error) {
      console.error('Error fetching rating statistics:', error);
      throw error;
    }
  }

  // Get search suggestions
  async getSearchSuggestions(query: string): Promise<{
    products: string[];
    categories: string[];
    brands: string[];
    tags: string[];
  }> {
    try {
      const response = await this.api.get<Product[]>('/products');
      const enhancedProducts = this.enhanceProducts(response.data);
      
      const searchQuery = query.toLowerCase();
      
      // Get matching products
      const matchingProducts = enhancedProducts
        .filter(product => 
          product.title.toLowerCase().includes(searchQuery) ||
          product.description.toLowerCase().includes(searchQuery)
        )
        .map(product => product.title)
        .slice(0, 5);
      
      // Get matching categories
      const allCategories = await this.getCategories();
      const matchingCategories = allCategories
        .filter(category => category.toLowerCase().includes(searchQuery))
        .slice(0, 5);
      
      // Get unique brands
      const uniqueBrands = [...new Set(enhancedProducts.map(p => p.brand))] as string[];
      const matchingBrands = uniqueBrands
        .filter(brand => brand.toLowerCase().includes(searchQuery))
        .slice(0, 5);
      
      // Get unique tags
      const allTags = enhancedProducts.flatMap(p => p.tags || []);
      const uniqueTags = [...new Set(allTags)];
      const matchingTags = uniqueTags
        .filter(tag => tag.includes(searchQuery))
        .slice(0, 5);
      
      return {
        products: matchingProducts,
        categories: matchingCategories,
        brands: matchingBrands,
        tags: matchingTags,
      };
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return { products: [], categories: [], brands: [], tags: [] };
    }
  }

  // Get single product with enhanced data
  async getProduct(id: number): Promise<EnhancedProduct> {
    try {
      const response = await this.api.get<Product>(`/products/${id}`);
      const enhancedProduct = this.enhanceProducts([response.data])[0];
      return enhancedProduct;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  // Get products by category
  async getProductsByCategory(category: string): Promise<EnhancedProduct[]> {
    try {
      const response = await this.api.get<Product[]>(`/products/category/${category}`);
      return this.enhanceProducts(response.data);
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      throw error;
    }
  }

  // Get all categories
  async getCategories(): Promise<string[]> {
    try {
      const response = await this.api.get<string[]>('/products/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Create new product
  async createProduct(productData: CreateProductDto): Promise<Product> {
    try {
      const response = await this.api.post<Product>('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update product
  async updateProduct(id: number, productData: UpdateProductDto): Promise<Product> {
    try {
      const response = await this.api.put<Product>(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  }

  // Delete product
  async deleteProduct(id: number): Promise<{ id: number }> {
    try {
      const response = await this.api.delete<{ id: number }>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }

  // Batch operations (if needed)
  async getMultipleProducts(ids: number[]): Promise<EnhancedProduct[]> {
    try {
      const promises = ids.map(id => this.getProduct(id));
      return Promise.all(promises);
    } catch (error) {
      console.error('Error fetching multiple products:', error);
      throw error;
    }
  }

  // Get featured products (top rated)
  async getFeaturedProducts(limit: number = 5): Promise<EnhancedProduct[]> {
    try {
      const response = await this.api.get<Product[]>('/products');
      const enhancedProducts = this.enhanceProducts(response.data);
      
      return enhancedProducts
        .sort((a, b) => b.rating.rate - a.rating.rate)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  // Get discounted products
  async getDiscountedProducts(limit: number = 5): Promise<EnhancedProduct[]> {
    try {
      const response = await this.api.get<Product[]>('/products');
      const enhancedProducts = this.enhanceProducts(response.data);
      
      return enhancedProducts
        .filter(p => (p.discountPercentage || 0) > 0)
        .sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0))
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching discounted products:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const productService = new ProductService();