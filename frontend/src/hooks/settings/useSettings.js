import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../api/settings.api.js";

export const useSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });
};