import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const languages = [
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
  },
  {
    code: "hi",
    name: "हिन्दी",
    flag: "🇮🇳",
  },
 
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const [open, setOpen] = useState(false);

  const current =
    languages.find((l) => l.code === i18n.language) || languages[0];

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang.code);

    localStorage.setItem("language", lang.code);

    setOpen(false);

    document.documentElement.dir =
      lang.code === "ar" ? "rtl" : "ltr";
  };

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 hover:text-gray-900 transition"
      >
        <span>{current.flag}</span>

        <span>{current.name}</span>

        <ChevronDown size={12} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">

          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 transition ${
                current.code === lang.code
                  ? "bg-blue-50 text-[#0066CC]"
                  : "text-gray-700"
              }`}
            >
              <span>{lang.flag}</span>

              {lang.name}
            </button>
          ))}

        </div>
      )}

    </div>
  );
};

export default LanguageSelector;