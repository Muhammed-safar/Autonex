import React from 'react';
import { ArrowUpRight, Calendar, User } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: "Buying cheap used transmissions isn’t as risky as you think",
    excerpt: "Integer mattis ultricies augue, ac bibendum arcu viverra vel. Etiam eu facilisis velit. Mauris",
    author: "Sinan",
    date: "20 May 2025",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800",
    alt: "Changing wheel on a modern car",
    url: "#",
  },
  {
    id: 2,
    title: "What to Do When Your Car Parts Start Wearing Out",
    excerpt: "Integer mattis ultricies augue, ac bibendum arcu viverra vel. Etiam eu facilisis velit. Mauris",
    author: "Sinan",
    date: "20 May 2025",
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800",
    alt: "Mechanic inspecting under car hood",
    url: "#",
  },
  {
    id: 3,
    title: "Top 10 Car Parts Every Driver Should Know About",
    excerpt: "Integer mattis ultricies augue, ac bibendum arcu viverra vel. Etiam eu facilisis velit. Mauris",
    author: "Sinan",
    date: "20 May 2025",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800",
    alt: "Auto mechanic standing in garage",
    url: "#",
  },
];

export default function LatestNews() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 gap-3">
        <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Our Latest News
          </h2>
          <span className="text-sm font-normal text-slate-500">
            Our most ordered products.
          </span>
        </div>

        <a
          href="#"
          className="group inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          View All
          <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>

      {/* Responsive Grid Layout */}
      {/* 1 column on mobile -> 2 columns on tablet -> 3 columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {articles.map((article) => (
          <article key={article.id} className="group flex flex-col cursor-pointer">
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
                  by <strong className="font-semibold text-slate-700">{article.author}</strong>
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