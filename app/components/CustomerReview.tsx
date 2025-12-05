import React from "react";
import RattingStars from "./RattingStars";
import { getRandomReviews } from "~/constant/reviewData";
import type { Review } from "~/types";

type Props = {productId?: number};

function CustomerReview({productId}: Props) {
    const reviews = getRandomReviews(productId);
    const ratings = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = reviews.length ? ratings / reviews.length : 0;   
  return (
    <>
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
          Customer Reviews
        </h3>
        <RattingStars rate={Math.round(averageRating)} count={reviews.length} />
        <div className="flex items-center flex-wrap gap-4 mt-4">
          <h4 className="text-2xl sm:text-3xl text-slate-900 font-semibold">
            {Math.round(averageRating)} / 5
          </h4>
          <p className="text-sm text-slate-500">Based on 253 ratings</p>
        </div>
      </div>
      <div className="mt-6">
        {reviews.map((review) => (
          <div key={review.id} className="mb-6">
            <Review review={review} />
          </div>
        ))}
      </div>
    </>
  );
}

export default CustomerReview;


type ReviewProps = {
    review: Review
}

function Review({review}: ReviewProps) {
  return (
    <div className="flex items-start">
          <img
            src={review.avatar}
            className="w-12 h-12 rounded-full border-2 border-white"
          />
          <div className="ml-3">
            <h4 className="text-slate-900 text-sm font-semibold">{review.name}</h4>
            <div className="flex space-x-1 mt-1">
                <RattingStars rate={review.rating} count={0} />
              <p className="text-xs text-slate-500 !ml-2">{review.date}</p>
            </div>
            <p className="text-sm text-slate-500 mt-4">{review.comment}
            </p>
          </div>
        </div>
  )
}