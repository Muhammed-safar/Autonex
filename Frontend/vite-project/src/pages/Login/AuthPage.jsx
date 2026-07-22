import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Register from "./Register";
import { Link } from "react-router-dom";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login"); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Login Submitted:", loginData);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    console.log("Register Submitted:", registerData);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-12">
          <Link to={"/"} className="hover:underline">
            Home
          </Link>
          <span className="mx-1">/</span>
          <span className="text-gray-800 font-medium">My account</span>
        </nav>

        {/* Centered Auth Card Container */}
        <div className="max-w-md mx-auto">
          {/* Tab Navigation: Login / Register */}
          <div className="flex justify-center items-center gap-6 mb-4">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`text-2xl font-bold transition-colors ${
                activeTab === "login"
                  ? "text-[#0066b2]"
                  : "text-gray-300 hover:text-gray-400"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={`text-2xl font-bold transition-colors ${
                activeTab === "register"
                  ? "text-[#0066b2]"
                  : "text-gray-300 hover:text-gray-400"
              }`}
            >
              Register
            </button>
          </div>

          {/* Subtitle */}
          <p className="text-center text-xs text-gray-500 mb-8">
            {activeTab === "login"
              ? "If you have an account, sign in with your username or email address."
              : "There are many advantages to creating an account: the payment processis faster, shipment tracking is possible and much more."}
          </p>

          {/* LOGIN FORM */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Username or email address{" "}
                  <span className="text-gray-800">*</span>
                </label>
                <input
                  type="text"
                  name="identifier"
                  required
                  value={loginData.identifier}
                  onChange={handleLoginChange}
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
                    required
                    value={loginData.password}
                    onChange={handleLoginChange}
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

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={loginData.rememberMe}
                    onChange={handleLoginChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-0"
                  />
                  <span>Remember me</span>
                </label>

                <a
                  href="#"
                  className="text-xs text-[#0066b2] hover:underline font-medium"
                >
                  Lost your password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0066b2] hover:bg-[#005290] text-white text-xs font-semibold py-3 px-4 rounded-md transition-colors mt-2"
              >
                Log in
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {activeTab === "register" && (
            <Register/>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
