import API from "./axios";

export const checkout = async (data) => {
  const response = await API.post("/checkout", data);
  return response.data;
};