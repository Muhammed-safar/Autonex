import React, { useState, useEffect } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useResetPassword } from "../../hooks/mutations/useResetPassword.js";

const RESET_SESSION_KEY = "pendingPasswordReset";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const resetPasswordMutation = useResetPassword();

  const [email, setEmail] = useState(location.state?.email || null);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Fall back to sessionStorage (e.g. page refresh), else send back to start
  useEffect(() => {
    if (email) return;
    const raw = sessionStorage.getItem(RESET_SESSION_KEY);
    const pending = raw ? JSON.parse(raw) : null;

    if (!pending || !pending.email || Date.now() > pending.expiresAt) {
      sessionStorage.removeItem(RESET_SESSION_KEY);
      navigate("/forgot-password", { replace: true });
      return;
    }
    setEmail(pending.email);
  }, [email, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationError) setValidationError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    // Backend only needs email + password — OTP verification is tracked server-side
    resetPasswordMutation.mutate(
      { email, password: formData.password },
      {
        onSuccess: () => {
          sessionStorage.removeItem(RESET_SESSION_KEY);
          navigate("/auth", { state: { passwordResetSuccess: true } });
        },
      },
    );
  };

  if (!email) return null;

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
            Set New Password
          </h1>

          <p className="text-center text-xs text-gray-500 mb-8 leading-relaxed">
            Please enter your new password for{" "}
            <span className="font-semibold text-gray-700">{email}</span>.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                New Password <span className="text-gray-800">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full border border-gray-200 rounded-md p-2.5 text-xs pr-10 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Confirm New Password <span className="text-gray-800">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                  className="w-full border border-gray-200 rounded-md p-2.5 text-xs pr-10 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {validationError && (
              <p className="text-red-500 text-xs">{validationError}</p>
            )}

            {resetPasswordMutation.isError && (
              <p className="text-red-500 text-xs">
                {resetPasswordMutation.error?.response?.data?.message ||
                  "Something went wrong. Please check your details."}
              </p>
            )}

            <button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="w-full bg-[#0066b2] hover:bg-[#005290] text-white text-xs font-semibold py-3 px-4 rounded-md transition-colors mt-2 disabled:opacity-60"
            >
              {resetPasswordMutation.isPending
                ? "Updating Password..."
                : "Reset Password"}
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

export default ResetPassword;
