'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin, Users, Calendar, Search, Award } from 'lucide-react';

export default function StadiumsDirectory() {
  const [searchQuery, setSearchQuery] = useState('');

  const stadiums = [
    {
      name: "Lusail Iconic Stadium",
      city: "Lusail",
      country: "Qatar",
      capacity: "88,966",
      built: "2021",
      history: "Hosted the historic 2022 FIFA World Cup Final between Argentina and France. Known for its golden exterior design inspired by traditional bowls and lanterns.",
      imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop"
    },
    {
      name: "Al Bayt Stadium",
      city: "Al Khor",
      country: "Qatar",
      capacity: "68,895",
      built: "2021",
      history: "Features a unique giant tent structure modeled after traditional nomadic tents (Bayt al sha'ar). Hosted the opening match of the 2022 World Cup.",
      imageUrl: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=600&auto=format&fit=crop"
    },
    {
      name: "Camp Nou",
      city: "Barcelona",
      country: "Spain",
      capacity: "99,354",
      built: "1957",
      history: "The largest stadium in Europe. Home to FC Barcelona, Camp Nou is a legendary cathedral of football, having hosted Champions League finals and World Cup fixtures.",
      imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600&auto=format&fit=crop"
    },
    {
      name: "Santiago Bernabéu",
      city: "Madrid",
      country: "Spain",
      capacity: "85,000",
      built: "1947",
      history: "Home of Real Madrid CF. Renowned for its state-of-the-art retractable pitch and steel facade. Has hosted multiple European Cup and World Cup finals.",
      imageUrl: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=600&auto=format&fit=crop"
    },
    {
      name: "Wembley Stadium",
      city: "London",
      country: "United Kingdom",
      capacity: "90,000",
      built: "2007",
      history: "Features the iconic 134-meter-tall arch. The home of English football, hosting FA Cup finals, UEFA Champions League finals, and major concerts.",
      imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop"
    },
    {
      name: "San Siro",
      city: "Milan",
      country: "Italy",
      capacity: "75,817",
      built: "1926",
      history: "Also known as Stadio Giuseppe Meazza. Home to both AC Milan and Inter Milan, famous for its spiral towers and concrete exterior design.",
      imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop"
    }
  ];

  const filteredStadiums = stadiums.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <title>Elite Football Stadiums Directory | World Football Hub</title>
      <meta name="description" content="Explore famous football stadiums globally, including Lusail Stadium, Camp Nou, Wembley, and Santiago Bernabéu capacity, built dates and history profiles." />
      
      {/* Schema.org Breadcrumb and WebSite JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://footballhub.asia"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Stadium Directory",
                "item": "https://footballhub.asia/stadiums"
              }
            ]
          })
        }}
      />

      <Header />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner Section */}
        <section className="glass-panel rounded-3xl p-6 md:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950/60 border-b border-brand-green/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              Sports Facilities Directory
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
              <Award className="w-7 h-7 text-emerald-400" />
              World Football Stadiums
            </h1>
            <p className="text-slate-400 text-xs max-w-xl">
              Discover capacities, architectural histories, built periods and locations of the world's most iconic sports cathedrals.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full max-w-xs shrink-0">
            <input
              type="text"
              placeholder="Search stadiums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-white text-xs pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-brand-green"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </section>

        {/* Stadiums Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStadiums.map((s, idx) => (
            <div key={idx} className="glass-panel rounded-2xl overflow-hidden border border-slate-900 bg-slate-950/20 group hover:border-brand-green/20 transition duration-300">
              <div className="h-44 overflow-hidden border-b border-slate-900 relative">
                <img
                  src={s.imageUrl}
                  alt={s.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-sm border border-slate-800 text-brand-green font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                  Built {s.built}
                </span>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-black text-white text-sm group-hover:text-brand-green transition-colors">{s.name}</h3>
                  <p className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {s.city}, {s.country}
                  </p>
                </div>
                
                <p className="text-[11px] text-slate-400 leading-relaxed min-h-[54px]">{s.history}</p>

                <div className="pt-3 border-t border-slate-900/60 flex justify-between items-center text-[10px] font-mono text-slate-300 font-bold">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    Cap: {s.capacity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
