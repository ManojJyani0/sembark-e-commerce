import React from "react";
import type { Product } from "~/types";
import { AddToCartButton } from "./AddToCart";
import { Link } from "react-router";
import RattingStars from "./RattingStars";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    
      <div className="bg-white flex flex-col overflow-hidden hover:shadow-md transition-all">
        <div className="w-full bg-gray-50">
          <a href="javascript:void(0)" className="block">
            <img
              src={product?.image}
              alt="Product 1"
              className="w-full object-fill object-top aspect-230/307"
            />
          </a>
        </div>
        <div className="p-2 flex-1 flex flex-col">
          <div className="flex-1">
            <Link to={`/product/${product.id}`} className="block border-0 outline-0">
              <h5 className="text-sm sm:text-base font-semibold text-slate-900 truncate">
                {product.title}
              </h5>
            </Link>
            <p className="text-sm mt-1 text-slate-600 truncate">
              {product.description}
            </p>
            <div className="flex flex-wrap justify-between gap-2 mt-3">
              <div className="flex gap-2">
                <h6 className="text-sm sm:text-base font-bold text-slate-900">
                  {/* todo we can add here to toggle inr and usd exchange rate also since this data is only for dollar not for inr
                   */}
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(product.price)}
                </h6>
              </div>
              <RattingStars {...product.rating} />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div
              className="bg-pink-200 hover:bg-pink-300 w-12 h-9 flex items-center justify-center rounded-sm cursor-pointer"
              title="Wishlist"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16px"
                className="fill-pink-600 inline-block"
                viewBox="0 0 64 64"
              >
                <path
                  d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
                  data-original="#000000"
                />
              </svg>
            </div>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
  );
}
