import React from 'react';
import { Check, ArrowRight, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import {
  siteConfig,
  getVisibleServices,
  formatPrice,
  type ServiceItem,
} from '../../lib/config/site-config.js';

interface ServicesSectionProps {
  onSelectService?: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const services = getVisibleServices();

  const handleCtaClick = (serviceTitle: string, destination: string) => {
    onSelectService?.(serviceTitle);
    const targetId = destination.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="services"
      className="relative w-full bg-[#f8f6f0] text-[#0f1117] selection:bg-black selection:text-white overflow-hidden bg-grain px-6 sm:px-12 lg:px-16 py-20 lg:py-28 border-t border-slate-300/80"
    >
      <div className="w-full max-w-[1536px] mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] font-bold text-slate-800 uppercase">
            SERVICES & PRICING
          </span>
          <div className="w-16 sm:w-24 h-[1px] bg-slate-400/80" />
        </div>

        {/* Headline & Supporting Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-12 lg:mb-16 items-end">
          <div className="lg:col-span-7">
            <h2 className="font-hero font-black [font-weight:1000] text-[9vw] sm:text-[7vw] lg:text-[5vw] xl:text-[68px] text-slate-950 uppercase tracking-[-0.035em] leading-[0.92]">
              LET'S BUILD SOMETHING USEFUL.
            </h2>
          </div>
          <div className="lg:col-span-5 pb-1">
            <p className="font-sans text-base sm:text-lg text-slate-700 leading-relaxed max-w-xl">
              Clear scope. Thoughtful engineering. Reliable delivery.
              Transparent indicative pricing designed for founders, small businesses, and product teams.
            </p>
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {services.map((service: ServiceItem) => {
            const isFeatured = service.featured;
            const priceLabel = formatPrice(
              service.startingPrice,
              service.currency,
              siteConfig.pricing.customQuoteLabel
            );

            return (
              <div
                key={service.id}
                className={`relative rounded-2xl transition-all duration-300 flex flex-col justify-between p-6 sm:p-8 ${
                  isFeatured
                    ? 'bg-slate-950 text-white shadow-2xl border-2 border-red-600/80 lg:-translate-y-2'
                    : 'bg-white text-slate-950 border border-slate-300/90 hover:border-slate-950 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]'
                }`}
              >
                {/* Featured Badge */}
                {isFeatured && (
                  <div className="absolute -top-3.5 left-8 bg-red-600 text-white font-mono text-[10px] tracking-widest font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                    <Sparkles className="w-3 h-3" />
                    RECOMMENDED MVP SCOPE
                  </div>
                )}

                <div>
                  {/* Category & Title */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`font-mono text-[11px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded ${
                        isFeatured
                          ? 'bg-white/10 text-slate-300 border border-white/15'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {service.category}
                    </span>
                  </div>

                  <h3 className="font-sans font-black text-2xl sm:text-[26px] tracking-tight mb-2">
                    {service.title}
                  </h3>

                  <p
                    className={`font-sans text-xs sm:text-sm leading-relaxed mb-6 ${
                      isFeatured ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {service.shortDescription}
                  </p>

                  {/* Indicative Price */}
                  <div
                    className={`p-4 rounded-xl mb-6 border ${
                      isFeatured
                        ? 'bg-white/5 border-white/10'
                        : 'bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    <div
                      className={`font-mono text-[10px] uppercase tracking-wider mb-1 ${
                        isFeatured ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      INDICATIVE INVESTMENT
                    </div>
                    <div
                      className={`font-hero font-black text-2xl sm:text-3xl tracking-tight ${
                        isFeatured ? 'text-white' : 'text-slate-950'
                      }`}
                    >
                      {priceLabel}
                    </div>
                  </div>

                  {/* Metadata Indicators: Delivery & Support */}
                  <div
                    className={`flex flex-wrap items-center gap-4 text-xs font-mono mb-6 pb-6 border-b ${
                      isFeatured
                        ? 'border-white/10 text-slate-400'
                        : 'border-slate-100 text-slate-600'
                    }`}
                  >
                    {service.estimatedDelivery && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {service.estimatedDelivery}
                      </span>
                    )}
                    {service.supportPeriod && (
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        {service.supportPeriod}
                      </span>
                    )}
                  </div>

                  {/* Deliverables List */}
                  <div className="space-y-3 mb-8">
                    <div
                      className={`font-mono text-[11px] uppercase tracking-wider font-semibold ${
                        isFeatured ? 'text-slate-300' : 'text-slate-900'
                      }`}
                    >
                      WHAT'S INCLUDED:
                    </div>
                    {service.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isFeatured
                              ? 'bg-red-600/30 text-red-400'
                              : 'bg-slate-100 text-slate-900'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                        </div>
                        <span
                          className={`leading-snug ${
                            isFeatured ? 'text-slate-200' : 'text-slate-700'
                          }`}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={() => handleCtaClick(service.title, service.ctaDestination)}
                  className={`w-full py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isFeatured
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-600/30'
                      : 'bg-slate-950 hover:bg-slate-800 text-white'
                  }`}
                >
                  {service.ctaLabel}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Custom Project Callout */}
        <div className="bg-white rounded-2xl border border-slate-300/90 p-8 sm:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-red-600 font-bold block mb-1">
              CUSTOM CONSULTING & ARCHITECTURE
            </span>
            <h3 className="font-hero font-black text-2xl sm:text-3xl text-slate-950 uppercase tracking-tight mb-2">
              HAVE SOMETHING DIFFERENT IN MIND?
            </h3>
            <p className="font-sans text-sm sm:text-base text-slate-700 max-w-2xl">
              Tell me what you're building, and we'll work out the right approach, technical stack,
              and milestone plan for your unique project.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleCtaClick('Custom Project', '#contact')}
            className="shrink-0 px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
          >
            LET'S DISCUSS YOUR PROJECT
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
