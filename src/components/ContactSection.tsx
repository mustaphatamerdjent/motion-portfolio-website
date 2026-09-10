import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Mail, Instagram, Copy, Check, ArrowUpRight, Send } from 'lucide-react';
import { ContactInfo } from '../types';

interface ContactSectionProps {
  contact: ContactInfo;
}

export function ContactSection({ contact }: ContactSectionProps) {
  const [copied, setCopied] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    projectType: '3D Motion Design',
    timeline: 'Within 1-2 Months',
    message: ''
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSubmitInquiry = (e: FormEvent) => {
    e.preventDefault();
    // Simulate inquiry send
    setInquirySent(true);
    setTimeout(() => {
      // open mail client as well
      window.location.href = `mailto:${contact.email}?subject=Project Inquiry from ${encodeURIComponent(formState.name)} (${encodeURIComponent(formState.projectType)})&body=${encodeURIComponent(formState.message + '\n\nTimeline: ' + formState.timeline + '\nContact: ' + formState.email)}`;
    }, 600);
  };

  return (
    <section id="contact" className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
      {/* Eyebrow */}
      <div className="flex items-center justify-between gap-4 text-xs font-mono tracking-widest text-zinc-500 uppercase mb-8">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{contact.availability}</span>
        </div>
        <span>{contact.location}</span>
      </div>

      {/* Large Statement as explicitly requested */}
      <div className="mb-14 md:mb-20">
        <h2 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-white leading-[0.9]">
          {contact.statement}
        </h2>
      </div>

      {/* Main Grid: Direct Contact Channels & Quick Inquiry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column: Direct Links & Email */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-8">
          <div className="flex flex-col gap-6">
            <p className="text-lg sm:text-xl text-zinc-300 font-light max-w-md">
              Available for bespoke motion directions, 3D simulations, title sequences, and agency collaborations worldwide.
            </p>

            {/* Email Pill Box */}
            <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-500 block mb-1">
                  DIRECT TRANSMISSION
                </span>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-lg sm:text-xl font-mono text-white hover:text-zinc-300 transition-colors"
                >
                  {contact.email}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="copy-email-btn"
                  onClick={handleCopyEmail}
                  className="px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/30 bg-white/[0.03] hover:bg-white/[0.08] text-xs font-mono text-zinc-300 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? 'COPIED' : 'COPY'}</span>
                </button>

                <a
                  href={`mailto:${contact.email}`}
                  className="p-2 rounded-xl border border-white/10 hover:border-white/30 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors"
                  aria-label="Send email"
                >
                  <Mail size={16} />
                </a>
              </div>
            </div>

            {/* Social Links (Instagram, Behance explicitly requested) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Instagram size={16} className="text-zinc-400 group-hover:text-white" />
                  <span className="text-xs font-mono tracking-wider uppercase text-zinc-300 group-hover:text-white">Instagram</span>
                </div>
                <ArrowUpRight size={14} className="text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href={contact.behance}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-xs font-mono text-zinc-400 group-hover:text-white">Bē</span>
                  <span className="text-xs font-mono tracking-wider uppercase text-zinc-300 group-hover:text-white">Behance</span>
                </div>
                <ArrowUpRight size={14} className="text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {contact.vimeo && (
                <a
                  href={contact.vimeo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 transition-all flex items-center justify-between group col-span-2 sm:col-span-1"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-xs font-mono text-zinc-400 group-hover:text-white">V</span>
                    <span className="text-xs font-mono tracking-wider uppercase text-zinc-300 group-hover:text-white">Vimeo</span>
                  </div>
                  <ArrowUpRight size={14} className="text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}
            </div>
          </div>

          <div className="text-xs font-mono text-zinc-600">
            TIMEZONE: UTC+1 / CENTRAL EUROPEAN TIME
          </div>
        </div>

        {/* Right Column: Clean Project Inquiry Form */}
        <div className="lg:col-span-6 p-8 rounded-2xl border border-white/10 bg-zinc-950/40">
          <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] mb-6">
            <h3 className="font-display text-xl font-bold uppercase tracking-tight text-white">
              Initiate Commission
            </h3>
            <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
              FAST DISPATCH
            </span>
          </div>

          {inquirySent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center justify-center text-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
                <Check size={20} />
              </div>
              <h4 className="text-lg font-display uppercase font-bold text-white">Inquiry Prepared</h4>
              <p className="text-sm text-zinc-400 max-w-sm">
                Your email client is opening with project parameters. Or write directly to <span className="text-zinc-200">{contact.email}</span>.
              </p>
              <button
                onClick={() => setInquirySent(false)}
                className="mt-4 px-4 py-2 rounded-full border border-white/20 text-xs font-mono text-zinc-300 hover:text-white"
              >
                Send Another Note
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmitInquiry} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inquiry-name" className="block text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-1.5">
                    Your Name / Studio
                  </label>
                  <input
                    id="inquiry-name"
                    required
                    type="text"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Studio Mono"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-zinc-200 focus:outline-hidden focus:border-white/40 font-mono transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-email" className="block text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="inquiry-email"
                    required
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="contact@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-zinc-200 focus:outline-hidden focus:border-white/40 font-mono transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inquiry-scope" className="block text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-1.5">
                    Project Scope
                  </label>
                  <select
                    id="inquiry-scope"
                    value={formState.projectType}
                    onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-zinc-200 focus:outline-hidden focus:border-white/40 font-mono transition-colors"
                  >
                    <option value="3D Motion Design">3D Motion Design</option>
                    <option value="Visual Identity & Kinetic Systems">Brand / Kinetic Identity</option>
                    <option value="Film Title Sequence">Film Title Sequence</option>
                    <option value="Immersive / Exhibition Installation">Installation / Exhibition</option>
                    <option value="Art Direction / Consultancy">Art Direction & R&D</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="inquiry-timeline" className="block text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-1.5">
                    Expected Timeline
                  </label>
                  <select
                    id="inquiry-timeline"
                    value={formState.timeline}
                    onChange={(e) => setFormState({ ...formState, timeline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-zinc-200 focus:outline-hidden focus:border-white/40 font-mono transition-colors"
                  >
                    <option value="Immediate (< 1 month)">Immediate (&lt; 1 month)</option>
                    <option value="Within 1-2 Months">Within 1-2 Months</option>
                    <option value="Q3 / Q4 2026">Q3 / Q4 2026</option>
                    <option value="Concept Stage / Exploring">Exploring / Conceptual</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="inquiry-message" className="block text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-1.5">
                  Brief Narrative / Deliverables
                </label>
                <textarea
                  id="inquiry-message"
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Outline your timeline, visual ambition, or reference points..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-zinc-200 focus:outline-hidden focus:border-white/40 font-mono transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                id="submit-inquiry-btn"
                className="mt-2 w-full py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-mono text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Transmit Inquiry</span>
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
