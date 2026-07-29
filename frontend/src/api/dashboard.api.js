import API from "./axios";

export const getDashboardStats = async () => {
  const { data } = await axios.get("/brands");
  return data;
};