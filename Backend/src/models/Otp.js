const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },

  purpose: {
    type: String,
    enum: [
      "REGISTER",
      "LOGIN",
      "FORGOT_PASSWORD",
      "FORGOT_EMAIL",
      "EMAIL_CHANGE",
    ],
    required: true,
  },

  expiresAt: {
    type: Date,
    required: true,
  },

  verified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});