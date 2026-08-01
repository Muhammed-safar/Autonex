import { useQuery } from "@tanstack/react-query";
import { getDefaultAddress } from "../../api/address.api";

export const useGetDefaultAddress = () => {
  return useQuery({
    queryKey: ["default-address"],
    queryFn: getDefaultAddress,
  });
};