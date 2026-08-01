import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { getWishlist } from "../../api/wishlist.api";
import { getLocalWishlist } from "../../utils/localWishlist.js";

export const useWishlist = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);

  return useQuery({
    queryKey: ["wishlist"],

    queryFn: () => {
      if (accessToken) {
        return getWishlist();
      }

      return Promise.resolve({
        products: getLocalWishlist(),
      });
    },
  });
};
