import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../../api/dashboard.api.js";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
  });
};