import React from "react";
import { ArrowUpRight, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";



export default function LatestNews() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const articles = [
  {
    id: 1,
    title: t("latestNews.articles.article1.title"),
    excerpt: t("latestNews.articles.article1.excerpt"),
    author: "Sinan",
    date: "20 May 2025",
    image:
      "https://res.cloudinary.com/p61kdb2x/image/upload/v1785223498/Buying_cheap_used_transmissions_isn_t_as_risky_as_you_think_pom1yu.jpg",
    alt: t("latestNews.articles.article1.alt"),
    url: "#",
  },
  {
    id: 2,
    title: t("latestNews.articles.article2.title"),
    excerpt: t("latestNews.articles.article2.excerpt"),
    author: "Sinan",
    date: "20 May 2025",
    image:
      "https://res.cloudinary.com/p61kdb2x/image/upload/v1785223498/What_to_Do_When_Your_Car_Parts_Start_Wearing_Out_ju8xu5.jpg",
    alt: t("latestNews.articles.article2.alt"),
    url: "#",
  },
  {
    id: 3,
    title: t("latestNews.articles.article3.title"),
    excerpt: t("latestNews.articles.article3.excerpt"),
    author: "Sinan",
    date: "20 May 2025",
    image:
      "https://res.cloudinary.com/p61kdb2x/image/upload/v1785223497/304_aoit7a.jpg",
    alt: t("latestNews.articles.article3.alt"),
    url: "#",
  },
];
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 gap-3">
        <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
           {t("latestNews.title")}
          </h2>
          <span className="text-sm font-normal text-slate-500">
            {t("latestNews.subtitle")}
          </span>
        </div>

        <button
        onClick={() => navigate("/blog")}
          href="#"
          className="group inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          {t("latestNews.viewAll")}
          <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

      {/* Responsive Grid Layout */}
      {/* 1 column on mobile -> 2 columns on tablet -> 3 columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {articles.map((article) => (
          <article
            key={article.id}
            className="group flex flex-col cursor-pointer"
          >
            {/* Image Container with Zoom Effect */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 mb-4">
              <img
                src={article.image}
                alt={article.alt}
                className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Article Details */}
            <div className="flex flex-col flex-1">
              <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors duration-200">
                {article.title}
              </h3>

              <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>

              {/* Author and Date Meta */}
              <div className="mt-4 pt-2 flex items-center gap-3 text-xs text-slate-400 font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {t("latestNews.by")}{" "}
                  <strong className="font-semibold text-slate-700">
                    {article.author}
                  </strong>
                </span>
                <span>&bull;</span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {article.date}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
