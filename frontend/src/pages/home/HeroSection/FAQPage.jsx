import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePublicFaqs } from "../../../hooks/faqs/useFaqQueries.js"; 
import useDebounce from "../../../hooks/useDebounce.js";

const FAQPage = () => {
    const { t } = useTranslation();

    const [open, setOpen] = useState(-1);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    
    const debouncedSearch = useDebounce(searchQuery, 500);

    const { data: faqsData, isLoading } = usePublicFaqs({
        search: debouncedSearch,
        category: activeCategory
    });

    const faqs = faqsData?.faqs || [];

    const categories = ["All", "General", "Orders", "Shipping", "Returns", "Payment"];

    return (
        <section className="bg-gray-50 py-20 min-h-screen">
            <div className="max-w-5xl mx-auto px-4">

                {/* Heading */}
                <div className="text-center mb-10">
                    <span className="inline-flex items-center gap-2 text-[#0066CC] text-sm font-bold uppercase tracking-[0.25em]">
                        <span className="w-10 h-[2px] bg-[#0066CC]"></span>
                        {t("faq.badge", { defaultValue: "Support" })}
                    </span>

                    <h2 className="mt-4 text-4xl lg:text-5xl font-black text-slate-900">
                        {t("faq.title", { defaultValue: "Frequently Asked Questions" })}
                    </h2>

                    <p className="mt-4 max-w-2xl mx-auto text-slate-500 leading-7">
                        {t("faq.description", { defaultValue: "Find answers to the most common questions about our products and services." })}
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="mb-10 max-w-3xl mx-auto flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                           type="text" 
                           placeholder="Search answers..." 
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="w-full bg-white border border-slate-200 py-3.5 pl-12 pr-4 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent transition-all"
                        />
                    </div>
                    <select 
                       value={activeCategory}
                       onChange={(e) => setActiveCategory(e.target.value)}
                       className="bg-white border border-slate-200 py-3 px-4 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent transition-all outline-none"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* FAQ List */}
                <div className="space-y-4 max-w-3xl mx-auto">
                    {isLoading ? (
                         <div className="text-center py-10">
                              <div className="w-8 h-8 mx-auto border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                         </div>
                    ) : faqs.length === 0 ? (
                         <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
                             <p className="text-slate-500 text-lg">
                               No FAQs match your search criteria.
                             </p>
                         </div>
                    ) : (
                        faqs.map((faq, index) => (
                            <div
                                key={faq._id}
                                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all"
                            >
                                <button
                                    onClick={() => setOpen(open === index ? -1 : index)}
                                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                                >
                                    <h3 className="font-semibold text-slate-900 text-lg pr-4">
                                        {faq.question}
                                    </h3>

                                    <ChevronDown
                                        size={22}
                                        className={`transition-transform duration-300 shrink-0 ${open === index
                                                ? "rotate-180 text-[#0066CC]"
                                                : "text-slate-400"
                                            }`}
                                    />
                                </button>

                                <div
                                    className={`transition-all duration-300 ${open === index
                                            ? "max-h-60 opacity-100"
                                            : "max-h-0 opacity-0"
                                        } overflow-hidden`}
                                >
                                    <p className="px-6 pb-6 text-slate-600 leading-8">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </section>
    );
};

export default FAQPage;