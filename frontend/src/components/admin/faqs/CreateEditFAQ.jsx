import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, X } from "lucide-react";
import { useAdminFaqById } from "../../../hooks/faqs/useFaqQueries.js";
import { useCreateFaq, useUpdateFaq } from "../../../hooks/faqs/useFaqMutations.js";

const CATEGORIES = ["General", "Orders", "Shipping", "Returns", "Payment"];

const CreateEditFAQ = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { data: faqData, isLoading } = useAdminFaqById(id);
  const createFaq = useCreateFaq();
  const updateFaq = useUpdateFaq();

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: CATEGORIES[0],
    isActive: true,
  });

  useEffect(() => {
    if (isEditing && faqData?.faq) {
      const faq = faqData.faq;
      setFormData({
        question: faq.question || "",
        answer: faq.answer || "",
        category: faq.category || CATEGORIES[0],
        isActive: faq.isActive !== undefined ? faq.isActive : true,
      });
    }
  }, [isEditing, faqData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
        ...prev, 
        [name]: type === "checkbox" ? checked : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      updateFaq.mutate(
        { id, faqData: formData },
        { onSuccess: () => navigate("/admin/faqs") }
      );
    } else {
      createFaq.mutate(formData, { onSuccess: () => navigate("/admin/faqs") });
    }
  };

  if (isEditing && isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          {isEditing ? "Edit FAQ" : "Create New FAQ"}
        </h1>
        <button
          onClick={() => navigate("/admin/faqs")}
          className="text-slate-500 hover:text-slate-700 transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200">
        
        {/* Question */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Question</label>
          <input
            type="text"
            name="question"
            required
            value={formData.question}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0066B2]"
            placeholder="Enter the FAQ question"
          />
        </div>

        {/* Answer */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Answer</label>
          <textarea
            name="answer"
            required
            value={formData.answer}
            onChange={handleChange}
            rows="5"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0066B2]"
            placeholder="Enter the detailed answer..."
          />
        </div>

        {/* Categoriess & Active */}
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0066B2]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center mt-7">
             <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
               <input 
                  type="checkbox" 
                  name="isActive" 
                  checked={formData.isActive} 
                  onChange={handleChange} 
                  className="w-5 h-5 accent-[#0066B2] rounded border-slate-300"
                />
               Active (Visible to users)
             </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate("/admin/faqs")}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createFaq.isPending || updateFaq.isPending}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0066B2] hover:bg-[#005290] flex items-center gap-2 transition disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            {isEditing ? "Save Changes" : "Create FAQ"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateEditFAQ;