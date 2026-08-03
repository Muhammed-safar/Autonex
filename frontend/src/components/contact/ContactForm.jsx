import React, { useState } from "react";
import { toast } from "react-toastify";
import { sendContactMessage } from "../../../src/services/contactService.js";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await sendContactMessage(formData);

      toast.success(res.message);

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to send message"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F3F6F9] rounded-2xl p-6 sm:p-10 flex flex-col justify-between shadow-sm">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Write us...
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed max-w-lg">
            Have a question about a product, order or vehicle compatibility?
            We'd love to help.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full bg-white rounded-lg border border-transparent px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]"
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
                className="w-full bg-white rounded-lg border border-transparent px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]"
              />
            </div>
          </div>

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
              className="w-full bg-white rounded-lg border border-transparent px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Your message *
            </label>

            <textarea
              rows={5}
              required
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-white rounded-lg border border-transparent px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#0066CC] hover:bg-[#0052A3] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;