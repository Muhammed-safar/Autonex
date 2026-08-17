import API from "./axios.js";

export const getSettings = async () => {
  const { data } = await API.get("/settings");
  return data;
};

export const updateSettings = async (payload) => {
  const { data } = await API.patch("/settings", payload);
  return data;
};