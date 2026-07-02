'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Calendar, User, Tag, ArrowRight, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NewsArticleDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await fetch(`/api/news/${slug}`);
        if (!res.ok) throw new Error("Article not found");
        const data = await res.json();
        setArticle(data);
      } catch (e) {
        console.error(e);
        router.push('/');
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  if (loading || !article) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-green"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "image": [article.imageUrl],
    "datePublished": article.createdAt,
    "dateModified": article.updatedAt || article.createdAt,
    "author": [{
      "@type": "Organization",
      "name": "World Football Hub Staff",
      "url": "https://footballhub.asia"
    }],
    "publisher": {
      "@type": "Organization",
      "name": "World Football Hub",
      "logo": {
        "@type": "ImageObject",
        "url": "https://footballhub.asia/icons/icon-192x192.png"
      }
    },
    "description": article.summary
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition text-sm">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Article Container */}
        <article className="glass-panel rounded-3xl overflow-hidden p-6 md:p-8 space-y-6">
          <div className="h-64 md:h-80 w-full overflow-hidden rounded-2xl relative border border-slate-900">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            {article.trending && (
              <span className="absolute top-4 right-4 bg-brand-green text-slate-950 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                Trending Column
              </span>
            )}
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
              {article.title}
            </h1>

            {/* Meta logs */}
            <div className="flex flex-wrap gap-4 items-center text-xs text-slate-500 border-b border-slate-900 pb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(article.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                By World Football Staff
              </span>
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-brand-green hover:underline cursor-pointer font-bold ml-auto"
              >
                <Share2 className="w-4 h-4" />
                {shareSuccess ? "Link Copied!" : "Share Article"}
              </button>
            </div>
          </div>

          {/* Article summary quote block */}
          <p className="border-l-4 border-brand-green pl-4 py-1.5 text-sm italic text-slate-300 leading-relaxed bg-brand-green/5 rounded-r-lg">
            {article.summary}
          </p>

          {/* Article Content body */}
          <div className="text-slate-300 text-sm leading-relaxed space-y-4 font-normal">
            {article.content.split('\n').map((para: string, idx: number) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Tags */}
          {article.tags && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-900/60">
              {article.tags.split(',').map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-slate-900 text-slate-400 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border border-slate-800"
                >
                  <Tag className="w-3 h-3 text-brand-green" /> {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
