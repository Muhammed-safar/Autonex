import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForgotPassword } from "../../hooks/mutations/useForgotPassword.js";

const OTP_SESSION_KEY = "pendingVerification";
const OTP_VALID_MS = 10 * 60 * 1000; // matches backend expiresAt window

const ForgotPassword = () => {
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPassword();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => {
          sessionStorage.setItem(
            OTP_SESSION_KEY,
            JSON.stringify({
              email,
              type: "forgot-password",
              expiresAt: Date.now() + OTP_VALID_MS,
            }),
          );
          navigate("/verify-otp");
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        <nav className="text-xs text-gray-400 mb-12">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <span className="mx-1">/</span>
          <Link to="/auth" className="hover:underline">
            My account
          </Link>
          <span className="mx-1">/</span>
          <span className="text-gray-800 font-medium">Reset password</span>
        </nav>

        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center text-[#0066b2] mb-3">
            Reset Password
          </h1>

          <p className="text-center text-xs text-gray-500 mb-8 leading-relaxed">
            Lost your password? Please enter your email address. You will
            receive an OTP to create a new password via email.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Enter your email address{" "}
                <span className="text-gray-800">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-gray-200 rounded-md p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {forgotPasswordMutation.isError && (
              <p className="text-red-500 text-xs">
                {forgotPasswordMutation.error?.response?.data?.message ||
                  "Something went wrong."}
              </p>
            )}

            <button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="w-full bg-[#0066b2] hover:bg-[#005290] text-white text-xs font-semibold py-3 px-4 rounded-md transition-colors mt-2 disabled:opacity-60"
            >
              {forgotPasswordMutation.isPending ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-[#0066b2] transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
