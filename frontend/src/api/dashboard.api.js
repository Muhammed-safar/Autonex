import API from "./axios";

export const getDashboardStats = async () => {
  const { data } = await API.get("/dashboard");
  return data;
};

export const getAdminDashboardAnalytics = async () => {
  const response = await API.get("/dashboard/dashboar");

  return response.data;
};