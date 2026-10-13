import React, { useState } from 'react';
import { Mail, Send, Github, Linkedin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { siteConfig, isValidUrl } from '../../lib/config/site-config.js';
import { apiClient } from '../../lib/api/client.js';

interface ContactSectionProps {
  initialService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialService = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: initialService || siteConfig.contact.projectTypes[0] || 'Full-Stack MVP & Product Engineering',
    budget: siteConfig.contact.budgetOptions[1] || '$500 – $1,200',
    timeline: siteConfig.contact.timelineOptions[1] || 'Standard (2–4 weeks)',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, service: initialService }));
    }
  }, [initialService]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please enter your name (minimum 2 characters)';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please provide at least 10 characters describing your project';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      await apiClient.post('/contact', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        service: formData.service,
        budget: formData.budget,
        message: `${formData.message.trim()} (Desired Timeline: ${formData.timeline})`,
      });
      setStatus('success');
    } catch {
      // In case the local API server is not running or network fails, provide a smooth fallback
      setStatus('error');
      setErrorMessage(
        'Unable to reach backend server. You can email me directly using the button below with your details prefilled!'
      );
    }
  };

  const mailtoUrl = `mailto:${siteConfig.personal.email}?subject=${encodeURIComponent(
    `Project Inquiry: ${formData.service || 'Freelance Project'}`
  )}&body=${encodeURIComponent(
    `Hi Krishna,\n\nMy name is ${formData.name || '[Your Name]'}.\n\nService: ${
      formData.service
    }\nApproximate Budget: ${formData.budget}\nTimeline: ${formData.timeline}\n\nProject Overview:\n${
      formData.message || ''
    }\n\nBest regards,\n${formData.name || ''}`
  )}`;

  return (
    <section
      id="contact"
      className="relative w-full bg-[#f8f6f0] text-[#0f1117] selection:bg-black selection:text-white overflow-hidden bg-grain px-6 sm:px-12 lg:px-16 py-20 lg:py-28 border-t border-slate-300/80"
    >
      <div className="w-full max-w-[1536px] mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] font-bold text-slate-800 uppercase">
            CONTACT
          </span>
          <div className="w-16 sm:w-24 h-[1px] bg-slate-400/80" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct info & social destinations */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="font-hero font-black [font-weight:1000] text-[9vw] sm:text-[7vw] lg:text-[4.5vw] xl:text-[62px] text-slate-950 uppercase tracking-[-0.035em] leading-[0.92] mb-6">
                HAVE AN IDEA?
                <br />
                <span className="text-red-600">LET'S BUILD IT.</span>
              </h2>

              <p className="font-sans text-base sm:text-lg text-slate-700 leading-relaxed mb-8">
                {siteConfig.contact.subheading}
              </p>

              <div className="space-y-4 mb-8">
                <div className="p-4 rounded-xl bg-white border border-slate-300/80">
                  <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                    DIRECT EMAIL
                  </div>
                  <a
                    href={`mailto:${siteConfig.personal.email}`}
                    className="font-sans font-bold text-base sm:text-lg text-slate-950 hover:text-red-600 transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-slate-900" />
                    {siteConfig.personal.email}
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-300/80">
                  <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                    TYPICAL RESPONSE TIME
                  </div>
                  <div className="font-mono text-sm font-semibold text-slate-800">
                    {siteConfig.personal.responseTime} · {siteConfig.personal.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Social channels */}
            <div className="pt-6 border-t border-slate-300/80">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-semibold block mb-3">
                CONNECT ACROSS PLATFORMS
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {isValidUrl(siteConfig.links.github) && (
                  <a
                    href={siteConfig.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono text-xs font-semibold hover:border-slate-950 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    GITHUB
                  </a>
                )}

                {isValidUrl(siteConfig.links.linkedin) && (
                  <a
                    href={siteConfig.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono text-xs font-semibold hover:border-slate-950 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    LINKEDIN
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-300/90 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
              {status === 'success' ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-sans font-black text-2xl sm:text-3xl text-slate-950 mb-3 tracking-tight">
                    Inquiry Received!
                  </h3>
                  <p className="font-sans text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
                    {siteConfig.contact.successMessage}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setFormData({
                        name: '',
                        email: '',
                        service: siteConfig.contact.projectTypes[0],
                        budget: siteConfig.contact.budgetOptions[1],
                        timeline: siteConfig.contact.timelineOptions[1],
                        message: '',
                      });
                    }}
                    className="px-6 py-2.5 rounded-lg bg-slate-950 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {status === 'error' && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex flex-col gap-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                      </div>
                      <a
                        href={mailtoUrl}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-950 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        SEND VIA EMAIL APP
                      </a>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-1.5"
                      >
                        YOUR NAME *
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Morgan"
                        className={`w-full px-4 py-3 rounded-lg border font-sans text-sm text-slate-950 bg-slate-50/50 focus:bg-white focus:outline-none transition-colors ${
                          errors.name
                            ? 'border-red-500 focus:border-red-600'
                            : 'border-slate-300 focus:border-slate-950'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 font-mono text-[10px] text-red-600 font-semibold">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-1.5"
                      >
                        YOUR EMAIL *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. alex@company.com"
                        className={`w-full px-4 py-3 rounded-lg border font-sans text-sm text-slate-950 bg-slate-50/50 focus:bg-white focus:outline-none transition-colors ${
                          errors.email
                            ? 'border-red-500 focus:border-red-600'
                            : 'border-slate-300 focus:border-slate-950'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 font-mono text-[10px] text-red-600 font-semibold">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Project Type */}
                    <div>
                      <label
                        htmlFor="service"
                        className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-1.5"
                      >
                        SERVICE / SCOPE *
                      </label>
                      <select
                        id="service"
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 font-sans text-sm text-slate-950 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-slate-950 transition-colors"
                      >
                        {siteConfig.contact.projectTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Budget */}
                    <div>
                      <label
                        htmlFor="budget"
                        className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-1.5"
                      >
                        APPROXIMATE BUDGET
                      </label>
                      <select
                        id="budget"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 font-sans text-sm text-slate-950 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-slate-950 transition-colors"
                      >
                        {siteConfig.contact.budgetOptions.map((budget) => (
                          <option key={budget} value={budget}>
                            {budget}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-1.5"
                    >
                      PROJECT DESCRIPTION *
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share a brief overview of your product, goals, or the specific problem you want to solve..."
                      className={`w-full px-4 py-3 rounded-lg border font-sans text-sm text-slate-950 bg-slate-50/50 focus:bg-white focus:outline-none transition-colors resize-y ${
                        errors.message
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-slate-300 focus:border-slate-950'
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-1 font-mono text-[10px] text-red-600 font-semibold">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-3.5 px-6 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-md"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          TRANSMITTING INQUIRY...
                        </>
                      ) : (
                        <>
                          SEND PROJECT INQUIRY
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
