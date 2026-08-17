import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { useBlogBySlug } from "../../hooks/blogs/useBlogQueries";

const BlogDetails = () => {
  const { slug } = useParams();
  const { data, isLoading, isError } = useBlogBySlug(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !data?.blog) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-300">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="mb-6">This article might have been moved or doesn't exist.</p>
        <Link to="/blog" className="text-blue-400 hover:text-blue-300 underline font-semibold flex items-center gap-2">
            <ArrowLeft className="w-4 h-4"/> Back to Blog
        </Link>
      </div>
    );
  }

  const blog = data.blog;
  const safeHtml = DOMPurify.sanitize(blog.content);

  return (
    <>
      <Helmet>
        <title>{blog.title} | Autonex</title>
        <meta name="description" content={blog.excerpt} />
      </Helmet>
      
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-24 pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition mb-8">
             <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>

          <header className="mb-10 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-medium text-slate-400 mb-6">
              <span className="flex items-center gap-1 text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5" /> {blog.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {new Date(blog.publishedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> {blog.author?.name || "Autonex Author"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-6">
              {blog.title}
            </h1>
            
            <p className="text-lg text-slate-400 mb-8 max-w-3xl">
                {blog.excerpt}
            </p>
          </header>
          
          {blog.featuredImage?.url && (
             <div className="w-full aspect-video sm:aspect-[21/9] rounded-2xl overflow-hidden mb-12 shadow-2xl shadow-blue-900/20 border border-slate-800">
                <img 
                    src={blog.featuredImage.url} 
                    alt={blog.title} 
                    className="w-full h-full object-cover"
                />
             </div>
          )}

          <article 
             className="prose prose-invert prose-lg prose-blue max-w-none 
                        prose-headings:font-bold prose-a:text-blue-400 
                        prose-img:rounded-xl prose-img:shadow-lg
                        prose-blockquote:bg-slate-800/50 prose-blockquote:px-6 prose-blockquote:py-2
                        prose-blockquote:border-l-blue-500 prose-blockquote:rounded-r-lg"
             dangerouslySetInnerHTML={{ __html: safeHtml }} 
          />

          <hr className="my-16 border-slate-800" />
          
          <div className="text-center">
             <Link to="/blog" className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-8 rounded-xl transition">
                Read More Articles
             </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default BlogDetails;