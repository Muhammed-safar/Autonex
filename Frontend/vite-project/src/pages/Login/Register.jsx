import React, { useState } from "react";
import { Eye, EyeOff, ChevronUp } from "lucide-react";

const Register = () => {

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
    <div className="min-h-fit bg-white text-gray-700 font-sans flex flex-col justify-between relative">
      <main className="max-w-md w-full mx-auto py-8">
        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            email address <span className="text-gray-800">*</span>
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
          <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            full name <span className="text-gray-800">*</span>
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
            phone <span className="text-gray-800">*</span>
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

          <div className="flex items-center justify-center pt-1">
           <span className="text-start text-xs text-gray-500">
            Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our 
            <span className="flex w-full text-center text-xs text-blue-500 shrink-0 hover:underline">
                privacy policy
            </span>
           </span>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0066b2] hover:bg-[#005290] text-white text-xs font-semibold py-3 px-4 rounded-md transition-colors mt-2"
          >
            Log in
          </button>
        </form>
      </main>
    </div>
  );
};

export default Register;
