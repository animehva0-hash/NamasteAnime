"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", message: "" });
        setConsent(false);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass = "w-full px-4 py-3 bg-surface-light border border-border/30 rounded-xl text-sm text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-highlight/50 focus:border-highlight/50 transition-all";

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Contact Us</h1>
      <p className="text-text-secondary text-sm mb-8">Send us a message and we will get back to you.</p>

      {status === "sent" ? (
        <div className="p-8 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
          <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Message Sent!</h2>
          <p className="text-text-secondary text-sm">Thank you for reaching out. We will respond as soon as possible.</p>
          <button onClick={() => setStatus("idle")} className="mt-4 px-5 py-2 rounded-xl bg-highlight text-white text-sm font-medium hover:bg-highlight/90 transition-all">
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Your Name *</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="John Doe" className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Your Email *</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="john@example.com" className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Subject *</label>
            <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="DMCA Request / General Inquiry" className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Your Message *</label>
            <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Describe your request in detail..." className={`${inputClass} resize-none`} />
          </div>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-border/50 bg-surface-light accent-highlight flex-shrink-0" />
            <span className="text-xs sm:text-sm text-text-muted group-hover:text-text-secondary transition-colors">
              I consent to having this website store my submitted information so they can respond to my inquiry.
            </span>
          </label>

          {status === "error" && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              <AlertCircle size={16} /> Failed to send. Please try again or email directly.
            </div>
          )}

          <button type="submit" disabled={!consent || status === "sending"}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-highlight hover:bg-highlight/90 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-highlight/20">
            {status === "sending" ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
