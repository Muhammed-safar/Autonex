import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown
} from "lucide-react";

import { useAdminFaqs, } from "../../../hooks/faqs/useFaqQueries.js";
import { useDeleteFaq as useApiDeleteFaq, useUpdateFaqStatus as useApiUpdateFaqStatus, useReorderFaqs as useApiReorderFaqs } from "../../../hooks/faqs/useFaqMutations.js";
import useDebounce from "../../../hooks/useDebounce";

const FAQs = () => {
  const navigate = useNavigate();
  const deleteFaq = useApiDeleteFaq();
  const updateStatus = useApiUpdateFaqStatus();
  const reorderFaqs = useApiReorderFaqs();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const debouncedSearch = useDebounce(search, 500);

  const { data: faqsData, isLoading } = useAdminFaqs({
    search: debouncedSearch,
    category: categoryFilter,
  });

  const faqs = faqsData?.faqs || [];

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleCategoryChange = (e) => setCategoryFilter(e.target.value);

  const toggleStatus = (e, faq) => {
    e.stopPropagation();
    updateStatus.mutate({ id: faq._id, isActive: !faq.isActive });
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      deleteFaq.mutate(id);
    }
  };

  const handleMove = (e, index, direction) => {
    e.stopPropagation();
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === faqs.length - 1)
    ) {
      return;
    }

    const newFaqs = [...faqs];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    
    // Swap inside array
    const temp = newFaqs[index];
    newFaqs[index] = newFaqs[swapIndex];
    newFaqs[swapIndex] = temp;

    const orderedIds = newFaqs.map(f => f._id);
    reorderFaqs.mutate({ orderedIds });
  };

  return (
    <div className="h-full space-y-4 sm:space-y-5">
      {/* Search & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search FAQs..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#0066B2]"
            />
          </div>
        </div>

        <button
          onClick={() => navigate("/admin/faqs/create")}
          className="bg-[#0066B2] hover:bg-[#005290] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add FAQ
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col font-sans">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-slate-600 w-16">
                  Order
                </th>
                <th className="p-4 text-left text-xs font-semibold text-slate-600">
                  Question
                </th>
                <th className="p-4 text-left text-xs font-semibold text-slate-600">
                  Category
                </th>
                <th className="p-4 text-left text-xs font-semibold text-slate-600">
                  Status
                </th>
                <th className="p-4 text-right text-xs font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : faqs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs text-slate-500">
                    No FAQs found.
                  </td>
                </tr>
              ) : (
                faqs.map((faq, index) => (
                  <tr
                    key={faq._id}
                    className="border-b hover:bg-slate-50 text-xs transition cursor-pointer"
                    onClick={() => navigate(`/admin/faqs/${faq._id}/edit`)}
                  >
                    <td className="p-4">
                        <div className="flex flex-col items-center gap-1 w-6">
                            <button 
                                onClick={(e) => handleMove(e, index, "up")} 
                                disabled={index === 0 || !!search} 
                                className="text-slate-400 hover:text-[#0066B2] disabled:opacity-30 disabled:hover:text-slate-400"
                            >
                                <ArrowUp size={14}/>
                            </button>
                            <span className="font-mono text-slate-500 select-none">{index + 1}</span>
                            <button 
                                onClick={(e) => handleMove(e, index, "down")} 
                                disabled={index === faqs.length - 1 || !!search}
                                className="text-slate-400 hover:text-[#0066B2] disabled:opacity-30 disabled:hover:text-slate-400"
                            >
                                <ArrowDown size={14}/>
                            </button>
                        </div>
                    </td>
                    <td className="p-4 font-medium text-slate-800">
                        {faq.question}
                    </td>
                    <td className="p-4 text-slate-600">
                      {faq.category}
                    </td>
                    <td className="p-4 text-slate-800">
                      <span
                        className={`px-2 py-1 rounded inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${
                          faq.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {faq.isActive ? <CheckCircle size={10} /> : <XCircle size={10} />}
                        {faq.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={(e) => toggleStatus(e, faq)}
                          title={faq.isActive ? "Deactivate" : "Activate"}
                          className="p-2 hover:bg-slate-100 rounded text-slate-500 hover:text-[#0066B2] transition"
                        >
                          {faq.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/faqs/${faq._id}/edit`);
                          }}
                          title="Edit FAQ"
                          className="p-2 hover:bg-slate-100 rounded text-slate-600 transition"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, faq._id)}
                          title="Delete FAQ"
                          className="p-2 hover:bg-red-50 text-red-500 rounded transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FAQs;