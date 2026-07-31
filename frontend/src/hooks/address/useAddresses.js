import { useQuery } from "@tanstack/react-query";
import { getAddresses } from "../../api/address.api";

export const useAddresses = () => {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
  });
};