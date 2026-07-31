import { useQuery } from "@tanstack/react-query";
import { getAddress } from "../../api/address.api";

export const useAddress = (id) => {
  return useQuery({
    queryKey: ["address", id],
    queryFn: () => getAddress(id),
    enabled: !!id,
  });
};