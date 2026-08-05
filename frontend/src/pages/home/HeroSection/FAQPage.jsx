import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";


const FAQPage = () => {
  const [open, setOpen] = useState(0);
  const { t } = useTranslation();
  const faqs = [
  {
    question: t("faq.questions.compatibility.question"),
    answer: t("faq.questions.compatibility.answer"),
  },
  {
    question: t("faq.questions.genuine.question"),
    answer: t("faq.questions.genuine.answer"),
  },
  {
    question: t("faq.questions.shipping.question"),
    answer: t("faq.questions.shipping.answer"),
  },
  {
    question: t("faq.questions.tracking.question"),
    answer: t("faq.questions.tracking.answer"),
  },
  {
    question: t("faq.questions.payment.question"),
    answer: t("faq.questions.payment.answer"),
  },
  {
    question: t("faq.questions.return.question"),
    answer: t("faq.questions.return.answer"),
  },
  {
    question: t("faq.questions.damaged.question"),
    answer: t("faq.questions.damaged.answer"),
  },
  {
    question: t("faq.questions.cancel.question"),
    answer: t("faq.questions.cancel.answer"),
  },
];

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-5xl mx-auto px-4">

        {/* Heading */}

        <div className="text-center mb-14">

          <span className="inline-flex items-center gap-2 text-[#0066CC] text-sm font-bold uppercase tracking-[0.25em]">
            <span className="w-10 h-[2px] bg-[#0066CC]"></span>
            {t("faq.badge")}
          </span>

          <h2 className="mt-5 text-4xl lg:text-5xl font-black text-slate-900">
           {t("faq.title")}
          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-slate-500 leading-7">
           {t("faq.description")}
          </p>

        </div>

        {/* FAQ */}

        <div className="space-y-4">

          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() =>
                  setOpen(open === index ? -1 : index)
                }
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <h3 className="font-semibold text-slate-900 text-lg">
                  {faq.question}
                </h3>

                <ChevronDown
                  size={22}
                  className={`transition-transform duration-300 ${
                    open === index
                      ? "rotate-180 text-[#0066CC]"
                      : "text-slate-400"
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 ${
                  open === index
                    ? "max-h-60 opacity-100"
                    : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <p className="px-6 pb-6 text-slate-600 leading-8">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default FAQPage;