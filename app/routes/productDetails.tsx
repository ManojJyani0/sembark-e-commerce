// provides type safety/inference
import { AddToCartButton } from "~/components/AddToCart";
import type { Route } from "./+types/productDetails";
import { productService } from "~/services/product";
import RattingStars from "~/components/RattingStars";
import CustomerReview from "~/components/CustomerReview";
import { useNavigate, useNavigation } from "react-router";

// provides `loaderData` to the component
export async function loader({ params }: Route.LoaderArgs) {
  let response = await productService.getProduct(Number(params.id));
  return response;
}


// renders after the loader is done
export default function Component({ loaderData,  }: Route.ComponentProps) {
  let navigate = useNavigate()

  function handleNavigationBack(){
    navigate(-1)
  }
  const numberOfReviews = Math.floor(Math.random() * 10) + 1;
  return (
    <div className="p-4">
      <div className="lg:max-w-6xl max-w-xl mx-auto">
        <button onClick={handleNavigationBack} className="hover:text-blue-600">Go Back</button>
        <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-8 max-lg:gap-12 max-sm:gap-8">
          <div className="w-full lg:sticky top-0">
            <div className="flex flex-row gap-2">
              {/* <div className="flex flex-col gap-2 w-16 max-sm:w-14 shrink-0">
                <img
                  src="https://readymadeui.com/images/fashion-img-1.webp"
                  alt="Product1"
                  className="aspect-[64/85] object-cover object-top w-full cursor-pointer  border-b-2 border-black"
                />
                <img
                  src="https://readymadeui.com/images/fashion-img-2.webp"
                  alt="Product2"
                  className="aspect-[64/85] object-cover object-top w-full cursor-pointer  border-b-2 border-transparent"
                />
                <img
                  src="https://readymadeui.com/images/fashion-img-3.webp"
                  alt="Product3"
                  className="aspect-[64/85] object-cover object-top w-full cursor-pointer  border-b-2 border-transparent"
                />
                <img
                  src="https://readymadeui.com/images/fashion-img-4.webp"
                  alt="Product4"
                  className="aspect-[64/85] object-cover object-top w-full cursor-pointer  border-b-2 border-transparent"
                />
              </div> */}
              <div className="flex-1">
                <img
                  src={loaderData.image}
                  alt="Product"
                  className="w-full  aspect-[548/712] object-cover"
                />
              </div>
            </div>
          </div>
          <div className="w-full">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                {loaderData.title}
              </h3>
              <p className="text-slate-500 mt-2 text-sm">
                {loaderData?.description}
              </p>
              <div className="flex items-center flex-wrap gap-4 mt-6">
                <h4 className="text-slate-900 text-2xl sm:text-3xl font-semibold">
                  $12
                </h4>
                <p className="text-slate-500 text-lg">
                  <strike>$16</strike>{" "}
                  <span className="text-sm ml-1.5">Tax included</span>
                </p>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <RattingStars {...loaderData.rating} />
                <p className="text-slate-500 text-sm">
                  {loaderData.rating.count} ratings and {numberOfReviews}{" "}
                  reviews
                </p>
              </div>
            </div>
            <hr className="my-6 border-slate-300" />
            {loaderData.category.includes("cloths") && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                  Sizes
                </h3>
                <div className="flex flex-wrap gap-4 mt-4">
                  <button
                    type="button"
                    className="w-10 h-9 border border-slate-300 hover:border-blue-600 text-sm cursor-pointer flex items-center justify-center shrink-0"
                  >
                    SM
                  </button>
                  <button
                    type="button"
                    className="w-10 h-9 border border-blue-600 hover:border-blue-600 text-sm cursor-pointer flex items-center justify-center shrink-0"
                  >
                    MD
                  </button>
                  <button
                    type="button"
                    className="w-10 h-9 border border-slate-300 hover:border-blue-600 text-sm cursor-pointer flex items-center justify-center shrink-0"
                  >
                    LG
                  </button>
                  <button
                    type="button"
                    className="w-10 h-9 border border-slate-300 hover:border-blue-600 text-sm cursor-pointer flex items-center justify-center shrink-0"
                  >
                    XL
                  </button>
                </div>
                <div className="mt-6 flex flex-wrap gap-4">
                  <button
                    type="button"
                    className="px-4 py-3 w-[45%] cursor-pointer border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-medium"
                  >
                    Add to wishlist
                  </button>
                  <AddToCartButton product={loaderData} />
                </div>
              </div>
            )}
            <hr className="my-6 border-slate-300" />
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                Select Delivery Location
              </h3>
              <p className="text-slate-500 text-sm mt-2">
                Enter the pincode of your area to check product availability.
              </p>
              <div className="flex items-center gap-2 mt-6 max-w-sm">
                <input
                  type="number"
                  placeholder="Enter pincode"
                  className="bg-slate-100 px-4 py-2.5 text-sm w-full  border-0 outline-0"
                />
                <button
                  type="button"
                  className="border-0 outline-0 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer px-4 py-2.5 text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
            <hr className="my-6 border-slate-300" />
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                Product Information
              </h3>
              <div className="mt-4" role="accordion">
                <div className="hover:bg-slate-100 transition-all">
                  <button
                    type="button"
                    className="w-full text-sm font-semibold cursor-pointer text-left px-4 py-2.5 text-slate-900 flex items-center"
                  >
                    <span className="mr-4">Product details</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 fill-current ml-auto shrink-0 -rotate-180"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
                        clipRule="evenodd"
                        data-original="#000000"
                      />
                    </svg>
                  </button>
                  <div className="pb-4 px-4">
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                  </div>
                </div>
                <div className="hover:bg-slate-100 transition-all">
                  <button
                    type="button"
                    className="w-full text-sm font-semibold cursor-pointer text-left px-4 py-2.5 text-slate-900 flex items-center"
                  >
                    <span className="mr-4">Vendor details</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 fill-current ml-auto shrink-0 -rotate-90"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
                        clipRule="evenodd"
                        data-original="#000000"
                      />
                    </svg>
                  </button>
                  <div className="pb-4 px-4 hidden">
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                  </div>
                </div>
                <div className="hover:bg-slate-100 transition-all">
                  <button
                    type="button"
                    className="w-full text-sm font-semibold cursor-pointer text-left px-4 py-2.5 text-slate-900 flex items-center"
                  >
                    <span className="mr-4">Return and exchange policy</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 fill-current ml-auto shrink-0 -rotate-90"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
                        clipRule="evenodd"
                        data-original="#000000"
                      />
                    </svg>
                  </button>
                  <div className="pb-4 px-4 hidden">
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <hr className="my-6 border-slate-300" />
            <CustomerReview productId={numberOfReviews} />
          </div>
        </div>
      </div>
    </div>
  );
}
