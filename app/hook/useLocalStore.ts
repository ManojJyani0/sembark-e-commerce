

// total count 
// add to wish list 
// remove to wishlist 
// all-ready in wishlist or not

import { useEffect, useState } from "react"
import { LocalStoreKey } from "~/constant/localStoreKeys"
import type { Product } from "~/types"


export const useWishlist = () => {
    const [wishlistProducts, setProducts] = useState<Array<Product>>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(() => true)
        if (window.localStorage) {
            const data = localStorage.getItem(LocalStoreKey.Wishlist);
            if (data) {
                const wishlist = JSON.parse(data) as Array<Product>;
                setProducts(wishlist);
            }
        }
        setIsLoading(false)
    }, [])

    function hasProductInWishlist(productId: number): boolean {
        if (window.localStorage) {
            const data = localStorage.getItem(LocalStoreKey.Wishlist);
            if (data) {
                const wishlist = JSON.parse(data) as Array<Product>;
                const findIndex = wishlist.findIndex(item => item.id == productId);
                if (findIndex >= 0) {
                    return true
                } else {
                    false
                }
            } else false
        }
        return false
    }

    return { wishlistProducts, totalCount: wishlistProducts.length, isLoading, hasProductInWishlist }

}