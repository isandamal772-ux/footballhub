import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Award, ShieldAlert, Sparkles, Activity } from 'lucide-react';

export const metadata = {
  title: 'About Us | Football Hub',
  description: 'Learn about the mission, values, and digital technology behind Football Hub - the premier football directory.',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        
        {/* Hero Section */}
        <section className="space-y-4 text-center max-w-2xl mx-auto">
          <span className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            Who We Are
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Connecting Fans to the Heart of Football
          </h1>
          <p className="text-slate-400 text-sm">
            Football Hub is a premium digital space providing real-time live scores, comprehensive FIFA World Cup coverage, player statistics, and squad breakdowns.
          </p>
        </section>

        {/* Core Values grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-900 bg-slate-950/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Real-Time Data</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              We leverage simulated background loops and database generators to keep our 24/7 scores active, providing event feeds, cards, and commentary.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-900 bg-slate-950/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Deep Statistics</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              From market valuation to historical performance, we aggregate career metrics for the 100 best players and 50 national teams globally.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-900 bg-slate-950/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Premium Design</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Our interface is crafted with high-fidelity glassmorphism, responsive native layouts, and dynamic visualizations suited for web and mobile.
            </p>
          </div>
        </section>

        {/* Team / Mission block */}
        <section className="glass-panel p-8 rounded-3xl border border-card-border/30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex flex-col md:flex-row items-center gap-8">
          <div className="space-y-4 flex-1">
            <h2 className="text-xl font-bold text-white">Our Editorial Mission</h2>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Founded in 2026, Football Hub is run by sports tech developers and professional football editors. Our mission is to democratize access to football statistics and schedules. We build tools that make exploring group brackets, comparing athlete ratings, and viewing match formations simple and responsive.
            </p>
            <p className="text-xs text-slate-500 font-normal">
              For partnership, editorial inquiries, or support, please email us directly at <span className="text-brand-green font-mono">editorial@footballhub.asia</span>.
            </p>
          </div>
          <div className="w-full md:w-64 h-40 overflow-hidden rounded-2xl border border-slate-800 shrink-0 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=400&auto=format&fit=crop" 
              alt="Soccer Pitch Stadium" 
              className="w-full h-full object-cover"
            />
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
