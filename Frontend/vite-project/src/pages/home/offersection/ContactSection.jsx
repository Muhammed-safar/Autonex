import React, { useState } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* 1. LEFT PROMOTIONAL BANNER */}
        <div className="relative rounded-2xl overflow-hidden min-h-[420px] sm:min-h-[480px] flex flex-col justify-between p-6 sm:p-10 text-white shadow-sm">
          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1000"
            alt="Spring Deals Banner"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>

          {/* Banner Content */}
          <div className="relative z-10 space-y-4 max-w-md">
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-gray-300 uppercase">
              REFRESHING SPRING DEALS
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none text-white">
              Because <br />
              Every Mile <br />
              Matters.
            </h2>

            <p className="text-xs sm:text-sm text-gray-200 font-normal leading-relaxed pt-1">
              Boost your vehicle's performance with top-tier parts made to last and built to move.
            </p>
          </div>

          <div className="relative z-10 pt-6">
            <button className="bg-white text-slate-900 font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full hover:bg-gray-100 transition-all duration-200 shadow-sm active:scale-95">
              Shop Now
            </button>
          </div>
        </div>

        {/* 2. RIGHT CONTACT FORM */}
        <div className="bg-[#F3F6F9] rounded-2xl p-6 sm:p-10 flex flex-col justify-between shadow-sm">
          <div className="space-y-6">
            {/* Form Header */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Write us...
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed max-w-lg">
                On dekande mydurtad mora även om skurkstat. Semirade timaheten rena.
                Radiogen pasam inte loba även om prerade i garanterad traditionell specialitet till bebel.
              </p>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Your name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white rounded-lg border border-transparent px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC] transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Your email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white rounded-lg border border-transparent px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC] transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Row 2: Subject */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg border border-transparent px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC] transition-all shadow-sm"
                />
              </div>

              {/* Row 3: Message */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Your message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg border border-transparent px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC] transition-all shadow-sm resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-lg transition-colors shadow-sm active:scale-98"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;