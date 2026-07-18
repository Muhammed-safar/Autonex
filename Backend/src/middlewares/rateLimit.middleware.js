import rateLimit from "express-rate-limit";

export const createRateLimiter = ({ windowMs, max, message }) => {
  return rateLimit({
    windowMs,
    max,

    message: {
      success: false,
      message,
    },

    standardHeaders: true,
    legacyHeaders: false,
  });
};

// OTP
export const otpLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many OTP requests. Please try again later.",
});

// Register
export const registerLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many registration attempts. Please try again later.",
});

// Login
export const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts. Please try again later.",
});

export const verifyOtpLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: "Too many OTP verification attempts. Please try again later.",
});

export const uploadLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many upload requests. Please try again later.",
});

// Forgot Password
export const forgotPasswordLimiter = createRateLimiter({
  windowMs: 30 * 60 * 1000,
  max: 3,
  message: "Too many password reset requests.",
});

// search Limiter
export const searchLimiter = createRateLimiter({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: "Too many search requests. Please try again later.",
});