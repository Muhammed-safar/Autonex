import axios from "../api/axios.js";

export const sendContactMessage = async (data) => {
  const response = await axios.post("/contact", data);
  return response.data;
};