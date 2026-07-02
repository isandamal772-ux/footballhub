'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-2 text-center max-w-xl mx-auto">
          <h1 className="text-3xl font-black text-white tracking-tight">Contact Our Support Team</h1>
          <p className="text-slate-400 text-sm">Have feedback, partnership proposals, or questions about the match schedules? Contact us directly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Info Side Block */}
          <div className="md:col-span-1 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-900 bg-slate-950/20 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Contact Details</h3>
              
              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-brand-green shrink-0" />
                  <span>support@footballhub.asia</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand-green shrink-0" />
                  <span>+65 6789 0123</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-brand-green shrink-0" />
                  <span>Singapore, Central District</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-900 bg-slate-950/20">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-2">Office Hours</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Monday - Friday: 09:00 - 18:00 (GMT+8)<br />
                We respond to all verified inquiries within 24 hours.
              </p>
            </div>
          </div>

          {/* Form Side Block */}
          <div className="md:col-span-2">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-card-border/30 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
              {submitted ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <CheckCircle className="w-12 h-12 text-brand-green animate-bounce" />
                  <h3 className="text-lg font-bold text-white">Message Sent Successfully!</h3>
                  <p className="text-xs text-slate-400 max-w-sm">Thank you for contacting Football Hub. Our editorial team will review your message and reply shortly.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="bg-brand-green hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. John Doe"
                        required
                        className="bg-slate-900 border border-slate-800 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-brand-green w-full"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. john@example.com"
                        required
                        className="bg-slate-900 border border-slate-800 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-brand-green w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Message</label>
                    <textarea 
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your question or feedback here..."
                      required
                      className="bg-slate-900 border border-slate-800 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-brand-green w-full resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-brand-green hover:bg-emerald-400 text-slate-950 font-bold py-3 px-6 rounded-xl text-xs transition uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
