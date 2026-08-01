import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRegister } from "../../hooks/mutations/useRegister.js";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useRegister();

  // Register form state
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    country:"",
  });

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (registerMutation.isPending) return;

    registerMutation.mutate(registerData);
  };
  return (
    <div className="min-h-fit bg-white text-gray-700 font-sans flex flex-col justify-between relative">
      <main className="max-w-md w-full mx-auto py-8">
        <form onSubmit={handleRegisterSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              email address <span className="text-gray-800">*</span>
            </label>
            <input
              type="email"
              autoComplete="email"
              required
              name="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              disabled={registerMutation.isPending}
              className="w-full border border-gray-200 rounded-md p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Password <span className="text-gray-800">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                required
                value={registerData.password}
                onChange={handleRegisterChange}
                disabled={registerMutation.isPending}
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
              full name <span className="text-gray-800">*</span>
            </label>
            <input
              type="text"
              autoComplete="name"
              name="fullName"
              required
              value={registerData.fullName}
              onChange={handleRegisterChange}
              disabled={registerMutation.isPending}
              className="w-full border border-gray-200 rounded-md p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              phone <span className="text-gray-800">*</span>
            </label>
            <input
              type="tel"
              maxLength={10}
              autoComplete="tel"
              name="phone"
              required
              value={registerData.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setRegisterData((prev) => ({
                  ...prev,
                  phone: value,
                }));
              }}
              disabled={registerMutation.isPending}
              className="w-full border border-gray-200 rounded-md p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Country <span className="text-gray-800">*</span>
            </label>
            <input
              type="text"
              autoComplete="country"
              name="country"
              required
              value={registerData.country}
              onChange={handleRegisterChange}
              disabled={registerMutation.isPending}
              className="w-full border border-gray-200 rounded-md p-2.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {registerMutation.isError && (
            <p className="text-red-500 text-xs">
              {registerMutation.error?.response?.data?.message ||
                "Something went wrong."}
            </p>
          )}

          <div className="flex items-center justify-center pt-1">
            <span className="text-start text-xs text-gray-500">
              Your personal data will be used to support your experience
              throughout this website, to manage access to your account, and for
              other purposes described in our
              <span className="flex w-full text-center text-xs text-blue-500 shrink-0 hover:underline">
                privacy policy
              </span>
            </span>
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full bg-[#0066b2] hover:bg-[#005290] text-white text-xs font-semibold py-3 px-4 rounded-md transition-colors mt-2 disabled:opacity-60"
          >
            {registerMutation.isPending ? "Creating Account..." : "Register"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Register;
