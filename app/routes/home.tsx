import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { productService } from "~/services/product";
import { ProductCard } from "~/components/ProductCard";
import type { Product } from "~/types";
import type { Route } from "./+types/home";
import { CategoryFilter } from "~/components/CategoryFilter";
import { ProductCardSkeleton } from "~/components/skeletons/ProductCardSkeleton";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ShopNow - Discover Amazing Products" },
    {
      name: "description",
      content:
        "Browse our wide selection of products across multiple categories. Find the best deals on electronics, fashion, home goods, and more!",
    },
    {
      name: "keywords",
      content: "shopping, ecommerce, products, deals, electronics, fashion",
    },
    { property: "og:title", content: "ShopNow - Your One-Stop Online Shop" },
    {
      property: "og:description",
      content: "Discover amazing products at great prices.",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());

    if (url.searchParams.get("search")) {
    }

    const result = await productService.getAllProducts(searchParams);

    // Group products by category with performance optimization
    const grouped = result.products.reduce<Record<string, Product[]>>(
      (acc, product) => {
        const category = product.category.trim();
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(product);
        return acc;
      },
      {}
    );
    return {
      products: result.products,
      grouped,
      categories: Object.keys(grouped).sort(),
      total: result.products.length,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Loader error:", error);
    throw new Response("Failed to load products", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}

export function HydrateFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
        <svg
          className="w-12 h-12 text-red-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-red-700 mb-2">
          Unable to Load Products
        </h2>
        <p className="text-red-600 mb-4">
          There was an error loading the products. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();

  // Memoize selected categories to prevent unnecessary re-renders
  const selectedCategories = useMemo(() => {
    const categoryParam = searchParams.get("category");
    return categoryParam ? categoryParam.split(",").filter(Boolean) : [];
  }, [searchParams]);

  // Memoize query parameters
  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  }, [searchParams]);

  // Use React Query with proper configuration
  const {
    data: productsData,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => productService.getAllProducts(queryParams),
    initialData: loaderData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });

  // Store categories in localStorage for persistence
  useEffect(() => {
    try {
      if (productsData?.categories) {
        localStorage.setItem(
          "categoryList",
          JSON.stringify(productsData.categories)
        );
        localStorage.setItem(
          "lastProductFetch",
          productsData.timestamp.toString()
        );
      }
    } catch (err) {
      console.warn("Failed to store categories in localStorage:", err);
    }
  }, [productsData?.categories, productsData?.timestamp]);

  // Memoize category check function
  const isCategorySelected = useCallback(
    (category: string) => {
      if (selectedCategories.length === 0) return true;
      return selectedCategories.includes(category);
    },
    [selectedCategories]
  );

  // Memoize grouped products for performance
  const groupedProducts = useMemo(() => {
    return productsData?.grouped || {};
  }, [productsData?.grouped]);

  // Get sorted categories
  const sortedCategories = useMemo(() => {
    return Object.keys(groupedProducts).sort();
  }, [groupedProducts]);

  // Calculate total visible products
  const totalVisibleProducts = useMemo(() => {
    return sortedCategories.reduce((total, category) => {
      if (isCategorySelected(category)) {
        return total + groupedProducts[category].length;
      }
      return total;
    }, 0);
  }, [sortedCategories, groupedProducts, isCategorySelected]);

  // Loading state
  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            Products Unavailable
          </h2>
          <p className="text-yellow-700 mb-4">
            We're having trouble loading products. Using cached data instead.
          </p>
          {/* Fallback to loaderData */}
          {loaderData && (
            <ProductsDisplay
              grouped={loaderData.grouped}
              selectedCategories={selectedCategories}
            />
          )}
        </div>
      </div>
    );
  }

  // No products found
  if (sortedCategories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <svg
          className="w-16 h-16 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          No Products Found
        </h2>
        <p className="text-gray-600">
          Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Stats */}
      <div className="bg-white ">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {selectedCategories.length > 0
                  ? `Products in ${selectedCategories.join(", ")}`
                  : "All Products"}
              </h1>
              <p className="text-sm text-gray-600">
                Showing {totalVisibleProducts} of {productsData.total} products
              </p>
            </div>
            <CategoryFilter
              categories={productsData.categories}
              selectedCategories={selectedCategories}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-8">
          {sortedCategories.map(
            (category) =>
              isCategorySelected(category) && (
                <section
                  key={category}
                  className="bg-white rounded-xl shadow-sm  p-4 md:p-6"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 capitalize">
                        {category}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {groupedProducts[category].length} products
                      </p>
                    </div>
                    <a
                      href={`/category/${category.toLowerCase()}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View all →
                    </a>
                  </div>

                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {groupedProducts[category].map((product) => (
                      <ProductCard
                        key={`${product.id}-${product.sku || product.title}`}
                        product={product}
                      />
                    ))}
                  </div>
                </section>
              )
          )}
        </div>
      </main>

      {/* Empty state when no categories match filters */}
      {totalVisibleProducts === 0 && selectedCategories.length > 0 && (
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-md mx-auto">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No products match your filter
            </h3>
            <p className="text-gray-600 mb-6">
              Try selecting different categories or clearing all filters.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Skeleton loading component
function ProductGridSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Products display component for better separation
interface ProductsDisplayProps {
  grouped: Record<string, Product[]>;
  selectedCategories: string[];
}

function ProductsDisplay({
  grouped,
  selectedCategories,
}: ProductsDisplayProps) {
  const isCategorySelected = useCallback(
    (category: string) => {
      if (selectedCategories.length === 0) return true;
      return selectedCategories.includes(category);
    },
    [selectedCategories]
  );

  return (
    <div className="grid gap-8">
      {Object.keys(grouped).map(
        (category) =>
          isCategorySelected(category) && (
            <section
              key={category}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">
                {category}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {grouped[category].map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )
      )}
    </div>
  );
}
