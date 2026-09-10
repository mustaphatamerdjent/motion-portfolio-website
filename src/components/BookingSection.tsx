import { useState, useRef, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { ContactInfo } from '../types';

interface BookingSectionProps {
  contact?: ContactInfo;
}

const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/mustaphatamerdjent96@gmail.com';

export function BookingSection({ contact }: BookingSectionProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    budget: 'Motion Design — $800',
    projectDescription: '',
    name: '',
    email: '',
    company: '',
    contactInfo: ''
  });

  const budgetOptions = [
    'Motion Design — $300',
    'Motion Design — $500',
    'Motion Design — $800',
    'Motion Design — $1,200',
    'Custom Project'
  ];

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: 'New Motion Design Project Inquiry',
          _replyto: formData.email,
          _template: 'table',
          _captcha: 'false',
          'Name': formData.name,
          'Email': formData.email,
          'Company / Brand': formData.company || 'N/A',
          'Project type / selected price': formData.budget,
          'Project description': formData.projectDescription,
          'Contact information': formData.contactInfo || 'N/A'
        })
      });

      const data = await response.json().catch(() => null);

      if (response.ok && (data?.success === 'true' || data?.success === true || response.status === 200)) {
        setSubmitted(true);
      } else {
        const errorMsg = data?.message || 'Failed to send your inquiry. Please check your internet connection or email directly.';
        setSubmitError(errorMsg);
      }
    } catch {
      setSubmitError('Unable to transmit project brief. Please check your network connection or email directly to mustaphatamerdjent96@gmail.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="booking"
      className="relative w-full min-h-screen py-32 md:py-44 px-6 md:px-16 max-w-5xl mx-auto flex flex-col justify-center bg-[#070709]"
    >
      {/* Section Header: Minimal & Large Editorial Typography */}
      <div className="mb-16 md:mb-24">
        <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-zinc-500 uppercase mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
          <span>PROJECT BRIEF & COMMISSION</span>
        </div>

        <h2 className="font-display text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-white leading-none">
          Let's make something move.
        </h2>
      </div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-12 md:p-16 rounded-2xl border border-white/10 bg-white/[0.02] text-center flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white mb-2">
            <Check size={20} />
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-bold uppercase text-white">
            Message Sent Successfully
          </h3>
          <p className="text-zinc-400 font-mono text-xs max-w-md">
            Your project creative brief has been submitted directly to mustaphatamerdjent96@gmail.com. I will review your details and get back to you shortly.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setSubmitError(null);
              setFormData({
                budget: 'Motion Design — $800',
                projectDescription: '',
                name: '',
                email: '',
                company: '',
                contactInfo: ''
              });
            }}
            className="mt-6 px-5 py-2 rounded-full border border-white/20 text-xs font-mono tracking-widest uppercase text-zinc-300 hover:text-white cursor-pointer hover:border-white/40 transition-colors"
          >
            Submit Another Project Brief
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-10 md:gap-14">
          <input type="hidden" name="_subject" value="New Motion Design Project Inquiry" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="Project type / selected price" value={formData.budget} />

          {/* 1. Project type / budget integrated dropdown */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="budget-dropdown-trigger"
              className="text-xs font-mono tracking-widest uppercase text-zinc-400"
            >
              Project Type / Budget
            </label>

            <div ref={dropdownRef} className="relative flex flex-col">
              {/* Trigger Button with Active Text and Rotating Chevron */}
              <button
                type="button"
                id="budget-dropdown-trigger"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="listbox"
                className="w-full flex items-center justify-between py-4 text-left group cursor-pointer focus:outline-hidden"
              >
                <span className="text-xl sm:text-2xl md:text-3xl font-display uppercase tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                  {formData.budget}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 group-hover:text-zinc-400 transition-colors hidden sm:inline">
                    {isDropdownOpen ? 'CLOSE' : 'SELECT TIER'}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-zinc-400 group-hover:text-white transition-transform duration-300 ease-out ${
                      isDropdownOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Architectural Horizon Line: The line that the menu physically emerges out of */}
              <div className="relative w-full h-[1px] bg-white/20">
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={false}
                  animate={{ scaleX: isDropdownOpen ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{ originX: 0 }}
                />
              </div>

              {/* The Dropdown Menu unfurling directly downwards from the line */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    role="listbox"
                    initial={{ opacity: 0, height: 0, y: -2 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -2 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden bg-[#09090d]/98 backdrop-blur-xl border-x border-b border-white/15 rounded-b-xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] z-40"
                  >
                    <div className="py-2 flex flex-col">
                      {budgetOptions.map((opt, idx) => {
                        const isSelected = formData.budget === opt;
                        return (
                          <motion.button
                            key={opt}
                            role="option"
                            aria-selected={isSelected}
                            type="button"
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.25,
                              delay: idx * 0.035,
                              ease: [0.16, 1, 0.3, 1]
                            }}
                            onClick={() => {
                              setFormData({ ...formData, budget: opt });
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-6 py-4 text-left font-display uppercase tracking-tight transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'bg-white/[0.08] text-white'
                                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <span
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                  isSelected ? 'bg-white scale-125' : 'bg-white/20'
                                }`}
                              />
                              <span className="text-lg sm:text-xl md:text-2xl">{opt}</span>
                            </div>
                            {isSelected && (
                              <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
                                SELECTED
                              </span>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 2. Tell me about your project (Large text area) */}
          <div className="flex flex-col gap-3">
            <label
              htmlFor="project-desc"
              className="text-xs font-mono tracking-widest uppercase text-zinc-400"
            >
              Tell me about your project
            </label>
            <textarea
              id="project-desc"
              name="projectDescription"
              required
              rows={4}
              value={formData.projectDescription}
              onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
              placeholder="Outline the motion scope, references, deliverables, and timeline..."
              className="w-full bg-transparent border-b border-white/20 py-4 text-lg sm:text-xl font-light text-zinc-200 placeholder-zinc-600 focus:outline-hidden focus:border-white transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* 3. Basic Contact Fields (Name, Email, Company/Brand, Contact Information) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 pt-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="client-name"
                className="text-xs font-mono tracking-widest uppercase text-zinc-400"
              >
                Name
              </label>
              <input
                id="client-name"
                name="name"
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className="w-full bg-transparent border-b border-white/20 py-3 text-base sm:text-lg text-white placeholder-zinc-600 focus:outline-hidden focus:border-white transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="client-email"
                className="text-xs font-mono tracking-widest uppercase text-zinc-400"
              >
                Email
              </label>
              <input
                id="client-email"
                name="email"
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@domain.com"
                className="w-full bg-transparent border-b border-white/20 py-3 text-base sm:text-lg text-white placeholder-zinc-600 focus:outline-hidden focus:border-white transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="client-company"
                className="text-xs font-mono tracking-widest uppercase text-zinc-400"
              >
                Company / Brand
              </label>
              <input
                id="client-company"
                name="company"
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Brand or Studio"
                className="w-full bg-transparent border-b border-white/20 py-3 text-base sm:text-lg text-white placeholder-zinc-600 focus:outline-hidden focus:border-white transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="client-contact"
                className="text-xs font-mono tracking-widest uppercase text-zinc-400"
              >
                Contact Information
              </label>
              <input
                id="client-contact"
                name="contactInfo"
                type="text"
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                placeholder="Phone, Telegram, Instagram handle..."
                className="w-full bg-transparent border-b border-white/20 py-3 text-base sm:text-lg text-white placeholder-zinc-600 focus:outline-hidden focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* Submission Error Banner if network or service error occurs */}
          {submitError && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/25 bg-red-500/10 text-red-300 text-xs font-mono">
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <span>{submitError}</span>
            </div>
          )}

          {/* 4. Simple submit button */}
          <div className="pt-6 flex items-center">
            <button
              type="submit"
              id="submit-brief-btn"
              disabled={isSubmitting}
              className="px-8 py-4 rounded-full bg-white text-black font-mono text-xs tracking-widest uppercase font-semibold flex items-center gap-3 hover:bg-zinc-200 transition-all cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Project Brief</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
