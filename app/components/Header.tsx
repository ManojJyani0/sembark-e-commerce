import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useCart } from "~/context/cart";

type Props = {};

export function Header({}: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { totalItems } = useCart();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  }, []);
  const isInitialMount = useRef(true);

  // Get initial search from URL
  useEffect(() => {
    const initialSearch = searchParams.get("search") || "";
    setSearchQuery(initialSearch);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams.toString());
        if (searchQuery.trim()) {
          newParams.set("search", searchQuery);
        } else {
          newParams.delete("search");
        }

        // Keep existing category if present
        if (searchParams.get("category")) {
          newParams.set("category", searchParams.get("category")!);
        }

        return newParams;
      });
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Handle mobile search submission
  const handleMobileSearch = () => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (searchQuery.trim()) {
      newSearchParams.set("search", searchQuery);
    } else {
      newSearchParams.delete("search");
    }

    // Keep existing category if present
    if (searchParams.get("category")) {
      newSearchParams.set("category", searchParams.get("category")!);
    }

    setSearchParams(newSearchParams);
    setShowMobileSearch(false);
  };

  // Handle Enter key in mobile search
  const handleMobileSearchKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleMobileSearch();
    }
  };

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="mx-auto lg:max-w-6xl md:max-w-3xl">
        {/* First Row - Always Visible */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex-shrink-0">
              <div className="flex items-center">
                <img
                  src="https://readymadeui.com/readymadeui-short.svg"
                  alt="logo"
                  className="w-10 h-10 bg-white p-1 rounded"
                />
                <span className="ml-2 text-xl font-bold hidden sm:block">
                  ShopNow
                </span>
              </div>
            </a>

            {/* Search Toggle (Mobile) */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="flex-1 mx-4 sm:hidden bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="text-sm">Search products...</span>
            </button>

            {/* Desktop Search */}
            <div className="hidden sm:flex flex-1 mx-4 w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  value={searchQuery}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 rounded-xl text-gray-900 focus:outline-none text-lg bg-gray-200"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 absolute left-3 top-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            {/* Cart Navigation */}
            <Link
              to="/cart"
              className="relative shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors group"
              aria-label={`Shopping cart with ${totalItems} items`}
            >
              <div className="relative">
                {/* Cart Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 text-gray-700 group-hover:text-gray-900 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>

                {/* Item Count Badge */}
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </div>

              {/* Optional: Tooltip on hover */}
              <span className="absolute -bottom-8 right-0 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                View Cart ({totalItems} items)
              </span>
            </Link>
          </div>

          {/* Mobile Search Bar (Expanded) */}
          {showMobileSearch && (
            <div className="mt-3 sm:hidden">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={handleChange}
                  onKeyDown={handleMobileSearchKeyDown}
                  className="w-full px-4 py-3 rounded-sm text-gray-900 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleMobileSearch}
                  className="absolute right-0 top-0 h-full px-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-r-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style  jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </header>
  );
}
