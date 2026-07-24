import API from "./axios";

// Register
export const register = async (formData) => {
  const { data } = await API.post("/auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

// Login
export const login = async (credentials) => {
  const { data } = await API.post("/auth/login", credentials);

  return data;
};

// Verify Registration OTP
export const verifyOTP = async (payload) => {
  const { data } = await API.post("/auth/verify-otp", payload);

  return data;
};


// Resend Registration OTP
export const resendOTP = async (payload) => {
  const { data } = await API.post("/auth/resend-otp", payload);

  return data;
};

// Forgot Password
export const forgotPassword = async (payload) => {
  const { data } = await API.post("/auth/forgot-password", payload);

  return data;
};

// Verify Forgot Password OTP
export const verifyForgotPassword = async (payload) => {
  const { data } = await API.post("/auth/verify-forgot-password", payload);

  return data;
};

// Reset Password
export const resetPassword = async (payload) => {
  const { data } = await API.post("/auth/reset-password", payload);

  return data;
};

// Get Current User Profile
export const getProfile = async () => {
  const { data } = await API.get("/auth/profile");

  return data;
};

// Update Profile
export const updateProfile = async (formData) => {
  const { data } = await API.put("/auth/updateUser", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

// Refresh Access Token
export const refreshAccessToken = async () => {
  const { data } = await API.post("/auth/refresh");

  return data;
};

// Logout
export const logout = async () => {
  const { data } = await API.post("/auth/logout");

  return data;
};

// Delete User
export const deleteUser = async () => {
  const { data } = await API.delete("/auth/delete");

  return data;
};