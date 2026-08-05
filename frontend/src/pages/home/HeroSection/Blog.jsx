import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  User,
  Clock,
  ArrowRight,
  Tag,
  ShieldCheck,
  Wrench,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";



const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  const CATEGORIES = [
  t("blog.categories.all"),
  t("blog.categories.maintenance"),
  t("blog.categories.upgrades"),
  t("blog.categories.guides"),
  t("blog.categories.engineCare"),
];

const BLOG_POSTS = [
  {
    id: 1,
    title:
      "5 Crucial Maintenance Upgrades to Keep Your Engine Running Like New",
    excerpt:
      "Maintaining your vehicle shouldn’t feel like a guessing game. Discover how clean fluids, new filters, and timely upgrades extend your engine’s life.",
    category: "Maintenance",
    author: "AUTONEX Tech Team",
    date: "Aug 12, 2026",
    readTime: "5 min read",
    image:
      "https://images-porsche.imgix.net/-/media/14191DA9A4C14F3884D054B551C795A3_9003A26B9D654C228F3D8E110B685281_017-text-media-content_4-3_1440x1080_defaultmobile_VM24_0985?w=1759&q=85&auto=format",
    featured: true,
    link: "https://www.mobil.co.in/en-in/motorist/consumer-blog/5-tricks-to-prolong-the-life-of-your-engine",
  },
  {
    id: 2,
    title: "How to Choose the Right Synthetic Oil for Your Performance Vehicle",
    excerpt:
      "Not all engine oils are created equal. We break down viscosity ratings, thermal protection, and synthetic blends.",
    category: "Engine Care",
    author: "Alex Rivera",
    date: "Aug 08, 2026",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
    featured: false,
    link:"https://precisionlubrication.com/articles/engine-oil-types/"
  },
  {
    id: 3,
    title: "Upgrading to LED Headlight Assemblies: A Step-by-Step Guide",
    excerpt:
      "Drastically improve your night visibility and modernise your car’s front-end aesthetics in under an hour.",
    category: "Upgrades",
    author: "AUTONEX Tech Team",
    date: "Aug 03, 2026",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
    featured: false,
    link:"https://www.jwspeaker.com/blog/education-center/how-to-properly-install-led-headlights-a-step-by-step-guide/?srsltid=AfmBOoosgWeShk6yXghepCKU8j1Fa6OVz79TH0_smKks76qyx_vKtmOp"
  },
  {
    id: 4,
    title: "Brake Rotor Types Explained: Drilled vs. Slotted vs. Blank",
    excerpt:
      "Which rotor design is best for your daily commute versus track weekend? Here is what you need to know.",
    category: "Guides",
    author: "Marcus Vance",
    date: "Jul 28, 2026",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80",
    featured: false,
    link:"https://www.powertechbrakes.com/types-of-brake-rotors-how-to-choose/"
  },
];

  // Filter posts based on category and search query
  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = BLOG_POSTS.find((post) => post.featured);

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-20">
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 pt-16 pb-12 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase tracking-widest mb-4">
              <Wrench className="w-3.5 h-3.5" /> {t("blog.hero.badge")}
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              {t("blog.hero.title")}
            </h1>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg">
              {t("blog.hero.description")}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 max-w-xl mx-auto relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={t("blog.hero.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
            />
          </motion.div>
        </div>
      </section>

      {/* --- FEATURED POST --- */}
      {featuredPost && !searchQuery && activeCategory === "All" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 ">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="group relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl lg:grid lg:grid-cols-12 lg:gap-8 items-center hover:border-slate-700 transition-all duration-300"
          >
            <div className="lg:col-span-7 aspect-[16/9] lg:aspect-auto h-full overflow-hidden relative">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> {t("blog.featured")}
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:col-span-5 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                <span className="flex items-center gap-1 text-blue-400 font-medium">
                  <Tag className="w-3.5 h-3.5" /> {featuredPost.category}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                {featuredPost.title}
              </h2>

              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {featuredPost.excerpt}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>{featuredPost.author}</span>
                </div>

                <a
                  href={
                    "https://www.mobil.co.in/en-in/motorist/consumer-blog/5-tricks-to-prolong-the-life-of-your-engine"
                  }
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {t("blog.readArticle")}{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* --- CATEGORY FILTERS --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-slate-800">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeCategory === category
                  ? "text-white"
                  : "text-black hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              {activeCategory === category && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-blue-600 rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </button>
          ))}
        </div>
      </section>

      {/* --- BLOG GRID --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-lg">
             {t("blog.noArticles")}
            </p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-white rounded-lg transition-colors"
            >
              {t("blog.reset")}
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredPosts.map((post) => (
                <motion.article
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-xs font-medium text-slate-300 px-2.5 py-1 rounded-md border border-slate-800">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {post.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {post.readTime}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-slate-400 text-sm line-clamp-3 mb-6">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">
                        {post.author}
                      </span>
                      <a
                        href={post.link}
                        className="text-blue-400 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
                      >
                        {t("blog.readMore")} <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* --- PROMO BANNER (AUTONEX Discount Callout) --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="relative rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 p-8 sm:p-10 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10 text-center md:text-left">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-red-200 bg-red-950/40 px-3 py-1 rounded-full mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> {t("blog.offer.badge")}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t("blog.offer.title")}
            </h3>
            <p className="text-red-100 text-sm mt-1 max-w-xl">
              {t("blog.offer.description")}{" "}
              <span className="font-mono bg-black/30 px-2 py-0.5 rounded text-white font-bold">
                HELLO45872
              </span>{" "}
              {t("blog.offer.description2")}
            </p>
          </div>
          <a
            href="/shop"
            className="relative z-10 whitespace-nowrap bg-white hover:bg-slate-100 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg transition-colors duration-200 text-sm"
          >
            {t("blog.offer.button")}
          </a>
        </div>
      </section>
    </div>
  );
};

export default Blog;