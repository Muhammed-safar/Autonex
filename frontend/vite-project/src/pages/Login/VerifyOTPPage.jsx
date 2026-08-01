import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useResendOTP } from "../../hooks/mutations/useResendOTP.js";
import { useVerifyOTP } from "../../hooks/mutations/useVerifyOTP.js";
import { useForgotPassword } from "../../hooks/mutations/useForgotPassword.js";
import { useVerifyForgotPasswordOTP } from "../../hooks/mutations/useVerifyForgotPasswordOTP.js";

const OTP_SESSION_KEY = "pendingVerification";

const VerifyOTPPage = () => {
  const navigate = useNavigate();
  // Registration flow mutations
  const verifyRegistrationOtp = useVerifyOTP();
  const resendRegistrationOtp = useResendOTP();

  // Forgot-password flow mutations
  const verifyForgotPasswordOtp = useVerifyForgotPasswordOTP();
  const resendForgotPasswordOtp = useForgotPassword(); // same "send OTP" endpoint, reused to resend

  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [pendingEmail, setPendingEmail] = useState(null);
  const [type, setType] = useState(null); // "registration" | "forgot-password"
  const inputRefs = useRef([]);

  // Pick the right mutation set based on which flow we're in
  const verifyOtpMutation =
    type === "forgot-password"
      ? verifyForgotPasswordOtp
      : verifyRegistrationOtp;
  const resendOtpMutation =
    type === "forgot-password"
      ? resendForgotPasswordOtp
      : resendRegistrationOtp;

  // On mount, make sure there's a valid pending verification (either flow)
  useEffect(() => {
    const raw = sessionStorage.getItem(OTP_SESSION_KEY);
    const pending = raw ? JSON.parse(raw) : null;

    if (
      !pending ||
      !pending.email ||
      !pending.type ||
      Date.now() > pending.expiresAt
    ) {
      sessionStorage.removeItem(OTP_SESSION_KEY);
      navigate("/account", { replace: true });
      return;
    }

    setPendingEmail(pending.email);
    setType(pending.type);
  }, [navigate]);

  // Handle input change and auto-focus next field
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return; // Allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle keyboard events like Backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste operation for full OTP codes
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, OTP_LENGTH).split("");
    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      newOtp[index] = digit;
    });
    setOtp(newOtp);

    const nextIndex = Math.min(digits.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length < OTP_LENGTH || !pendingEmail) return;

    verifyOtpMutation.mutate(
      { otp: otpCode, email: pendingEmail },
      {
        onSuccess: () => {
          if (type === "forgot-password") {
            // Keep the email around for the reset-password step, drop the "pending" flag
            sessionStorage.setItem(
              "pendingPasswordReset",
              JSON.stringify({
                email: pendingEmail,
                expiresAt: Date.now() + 10 * 60 * 1000,
              }),
            );
            sessionStorage.removeItem(OTP_SESSION_KEY);
            navigate("/reset-password", { state: { email: pendingEmail } });
          } else {
            sessionStorage.removeItem(OTP_SESSION_KEY);
            navigate("/");
          }
        },
      },
    );
  };

  const handleResend = () => {
    if (!pendingEmail) return;
    resendOtpMutation.mutate({ email: pendingEmail });
  };

  // Avoid flashing the form before the redirect check above resolves
  if (!pendingEmail) return null;

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-12">
          <Link to={"/"} className="hover:underline">
            Home
          </Link>
          <span className="mx-1">/</span>
          <Link to={"/account"} className="hover:underline">
            My account
          </Link>
          <span className="mx-1">/</span>
          <span className="text-gray-800 font-medium">Verify OTP</span>
        </nav>

        {/* Centered Auth Card Container */}
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex justify-center items-center mb-4">
            <h1 className="text-2xl font-bold text-[#0066b2]">Verify OTP</h1>
          </div>

          {/* Subtitle */}
          <p className="text-center text-xs text-gray-500 mb-8">
            Please enter the 6-digit verification code sent to{" "}
            <span className="font-semibold text-gray-700">{pendingEmail}</span>.
          </p>

          {/* VERIFY OTP FORM */}
          <form onSubmit={handleVerifySubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-3 text-center">
                Enter Code <span className="text-gray-800">*</span>
              </label>

              {/* 6 Digit Input Group */}
              <div className="flex justify-between items-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    required
                    className="w-11 h-12 text-center text-base font-bold border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800"
                  />
                ))}
              </div>
            </div>

            {/* Error Message */}
            {verifyOtpMutation.isError && (
              <p className="text-red-500 text-xs text-center">
                {verifyOtpMutation.error?.response?.data?.message ||
                  "Invalid verification code. Please try again."}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                verifyOtpMutation.isPending || otp.join("").length < OTP_LENGTH
              }
              className="w-full bg-[#0066b2] hover:bg-[#005290] text-white text-xs font-semibold py-3 px-4 rounded-md transition-colors disabled:opacity-60"
            >
              {verifyOtpMutation.isPending ? "Verifying..." : "Verify Code"}
            </button>

            {/* Resend OTP Section */}
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendOtpMutation.isPending}
                  className="text-[#0066b2] hover:underline font-semibold disabled:opacity-50"
                >
                  {resendOtpMutation.isPending ? "Sending..." : "Resend OTP"}
                </button>
              </p>
              {resendOtpMutation.isSuccess && (
                <p className="text-green-600 text-xs mt-1">
                  A new verification code has been sent!
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
