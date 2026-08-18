import { useQuery } from "@tanstack/react-query";

import { getAdminDashboardAnalytics } from "../../api/dashboard.api"; 

export const useAdminDashboardAnalytics = () => {
  return useQuery({
    queryKey: ["adminDashboardAnalytics"],

    queryFn: getAdminDashboardAnalytics,

    staleTime: 1000 * 60 * 5,

    retry: 1,
  });
};