import React from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Clock,
  ShieldCheck,
  User,
  Layers,
  Layout,
  Database,
  Sliders,
} from 'lucide-react';
import { type ServiceItem } from '../../lib/config/site-config.js';

interface ServicePricingCardProps {
  service: ServiceItem;
  index: number;
  onSelectService?: (serviceTitle: string) => void;
}

export const ServicePricingCard: React.FC<ServicePricingCardProps> = ({
  service,
  index,
  onSelectService,
}) => {
  const isFeatured = Boolean(service.featured);
  const formattedIndex = String(index + 1).padStart(2, '0');

  const handleCta = () => {
    onSelectService?.(service.title);
    const destination = service.ctaDestination || '#contact';
    const targetId = destination.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Resolve service icon based on id or category
  const renderServiceIcon = () => {
    switch (service.id) {
      case 'web-applications':
        return <Layout className="w-5 h-5" />;
      case 'full-stack-mvp':
        return <Layers className="w-5 h-5" />;
      case 'backend-api':
        return <Database className="w-5 h-5" />;
      case 'custom-solutions':
      default:
        return <Sliders className="w-5 h-5" />;
    }
  };

  const keyPointers = service.keyDeliverables || service.deliverables.slice(0, 4);

  return (
    <div
      className={`relative rounded-3xl transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 select-none ${
        isFeatured
          ? 'bg-[#0d1117] text-white shadow-2xl border-2 border-red-600/90 xl:-translate-y-2'
          : 'bg-white text-slate-950 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-slate-950/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
      }`}
    >
      {/* Featured Floating Badge */}
      {isFeatured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white font-mono text-[9px] tracking-widest font-bold uppercase px-3 py-0.5 rounded-full shadow-lg whitespace-nowrap">
          RECOMMENDED
        </div>
      )}

      {/* TOP SECTION: Header, Title, Description, Deliverables */}
      <div>
        {/* Top Row: Index, Category Badge, Arrow */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2">
            <span
              className={`font-mono text-xs font-bold ${
                isFeatured ? 'text-white' : 'text-slate-900'
              }`}
            >
              {formattedIndex}
            </span>
            <span
              className={`font-mono text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-full ${
                isFeatured
                  ? 'bg-white/10 text-slate-300 border border-white/15'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {service.category}
            </span>
          </div>
          <ArrowUpRight
            className={`w-3.5 h-3.5 shrink-0 ${isFeatured ? 'text-slate-400' : 'text-slate-500'}`}
          />
        </div>

        {/* Icon in Rounded Box */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
            isFeatured
              ? 'bg-white/10 text-red-500 border border-white/10'
              : 'bg-red-50 text-red-600 border border-red-100'
          }`}
        >
          {renderServiceIcon()}
        </div>

        {/* Title */}
        <h3
          className={`font-sans font-bold text-lg sm:text-xl tracking-tight leading-snug mb-1.5 ${
            isFeatured ? 'text-white' : 'text-slate-950'
          }`}
        >
          {service.title}
        </h3>

        {/* Short Description */}
        <p
          className={`font-sans text-xs sm:text-[13px] leading-relaxed mb-4 ${
            isFeatured ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {service.shortDescription}
        </p>

        {/* KEY DELIVERABLES */}
        <div className="mb-4">
          <span
            className={`font-mono text-[10px] tracking-wider uppercase font-bold block mb-2 ${
              isFeatured ? 'text-slate-400' : 'text-slate-900'
            }`}
          >
            KEY DELIVERABLES
          </span>

          <div className="space-y-1.5">
            {keyPointers.map((pointer, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs sm:text-[13px]">
                {isFeatured ? (
                  <div className="w-3.5 h-3.5 rounded-full bg-red-600 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Check className="w-2 h-2 text-white stroke-[3]" />
                  </div>
                ) : (
                  <Check className="w-3 h-3 text-slate-900 shrink-0 mt-0.5" />
                )}
                <span
                  className={`leading-snug ${isFeatured ? 'text-slate-200' : 'text-slate-700'}`}
                >
                  {pointer}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Pricing, Metadata, CTA */}
      <div>
        {/* Pricing Block */}
        <div
          className={`rounded-2xl p-3.5 sm:p-4 mb-3 border ${
            isFeatured ? 'bg-white/[0.05] border-white/10' : 'bg-slate-50 border-slate-200/80'
          }`}
        >
          <div
            className={`font-mono text-[10px] uppercase tracking-wider mb-0.5 font-semibold ${
              isFeatured ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {service.startingPrice ? 'Starting at' : 'Custom scope'}
          </div>

          <div
            className={`font-sans font-black text-2xl sm:text-[26px] tracking-tight mb-2 ${
              isFeatured ? 'text-white' : 'text-slate-950'
            }`}
          >
            {service.startingPrice ? `$${service.startingPrice.toLocaleString()}` : "Let's discuss"}
          </div>

          {/* Timeline and Support Row */}
          <div
            className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono pt-2 border-t ${
              isFeatured ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-600'
            }`}
          >
            {service.estimatedDelivery && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{service.estimatedDelivery}</span>
              </span>
            )}
            {service.supportPeriod && (
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>{service.supportPeriod}</span>
              </span>
            )}
          </div>
        </div>

        {/* Best For Metadata */}
        {service.bestFor && (
          <div
            className={`flex items-start gap-2 mb-3.5 text-xs font-mono ${
              isFeatured ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            <User
              className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                isFeatured ? 'text-slate-400' : 'text-slate-500'
              }`}
            />
            <div className="leading-tight">
              <span className="text-[9px] uppercase tracking-wider block font-bold text-slate-400 mb-0.5">
                BEST FOR
              </span>
              <span className="leading-snug line-clamp-1">{service.bestFor}</span>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <button
          type="button"
          onClick={handleCta}
          className={`w-full py-2.5 px-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isFeatured
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30'
              : 'bg-slate-950 hover:bg-slate-800 text-white'
          }`}
        >
          <span>{service.ctaLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
