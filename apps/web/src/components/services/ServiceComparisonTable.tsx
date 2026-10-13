import React from 'react';
import {
  ArrowRight,
  Check,
  X,
  User,
  Clock,
  ShieldCheck,
  Monitor,
  Server,
  Database,
  Lock,
  Link2,
  Code2,
  Palette,
  Wrench,
  FileText,
  MessageSquare,
  Send,
  Layers,
  Layout,
  Sliders,
} from 'lucide-react';
import {
  getPrimaryServices,
  getComparisonCriteria,
  type ServiceItem,
  type ComparisonCriteriaItem,
} from '../../lib/config/site-config.js';

interface ServiceComparisonTableProps {
  onSelectService?: (serviceTitle: string) => void;
}

export const ServiceComparisonTable: React.FC<ServiceComparisonTableProps> = ({
  onSelectService,
}) => {
  const primaryServices = getPrimaryServices();
  const criteriaList = getComparisonCriteria();

  const handleCta = (service: ServiceItem) => {
    onSelectService?.(service.title);
    const destination = service.ctaDestination || '#contact';
    const targetId = destination.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPricing = () => {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper to map criteria icon string to Lucide icon component
  const renderCriteriaIcon = (iconName: string) => {
    switch (iconName) {
      case 'User':
        return <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      case 'Clock':
        return <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      case 'Monitor':
        return <Monitor className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      case 'Server':
        return <Server className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      case 'Database':
        return <Database className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      case 'Lock':
        return <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      case 'Link2':
        return <Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      case 'Code2':
        return <Code2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      case 'Palette':
        return <Palette className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      case 'Wrench':
        return <Wrench className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      case 'FileText':
        return <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      case 'MessageSquare':
        return <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      case 'Send':
      default:
        return <Send className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
  };

  // Helper to render service header icon
  const renderServiceHeaderIcon = (serviceId: string) => {
    switch (serviceId) {
      case 'web-applications':
        return <Layout className="w-4 h-4 text-red-500" />;
      case 'full-stack-mvp':
        return <Layers className="w-4 h-4 text-red-500" />;
      case 'backend-api':
        return <Database className="w-4 h-4 text-red-500" />;
      case 'custom-solutions':
      default:
        return <Sliders className="w-4 h-4 text-red-500" />;
    }
  };

  // Render cell indicator based on value
  const renderCellIndicator = (value?: string) => {
    if (!value) {
      return (
        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs mx-auto">
          —
        </span>
      );
    }

    if (value === 'included') {
      return (
        <div className="w-4.5 h-4.5 rounded-full bg-emerald-500 flex items-center justify-center text-white mx-auto shadow-xs">
          <Check className="w-2.5 h-2.5 stroke-[3]" />
        </div>
      );
    }

    if (value === 'excluded') {
      return (
        <div className="w-4.5 h-4.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
          <X className="w-2.5 h-2.5 stroke-[2.5]" />
        </div>
      );
    }

    if (value === 'neutral') {
      return (
        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs mx-auto">
          —
        </span>
      );
    }

    // Default text representation (e.g. "Businesses, portfolios", "1–2 weeks", "14 days")
    return (
      <span className="font-sans text-xs sm:text-[13px] text-slate-300 font-medium leading-snug text-left block">
        {value}
      </span>
    );
  };

  return (
    <section
      id="service-comparison"
      className="relative w-full bg-[#f8f6f0] text-[#0f1117] selection:bg-black selection:text-white overflow-hidden bg-grain px-6 sm:px-10 lg:px-12 pt-2 lg:pt-4 pb-16 lg:pb-24"
    >
      <div className="w-full max-w-[1536px] mx-auto">
        {/* ======================================================== */}
        {/* SECTION HEADER                                           */}
        {/* ======================================================== */}
        <div className="flex items-center gap-4 mb-4">
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] font-bold text-slate-800 uppercase">
            COMPARISON
          </span>
          <div className="w-16 sm:w-24 h-[1px] bg-slate-400/80" />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6 lg:mb-8">
          <div>
            <h2 className="font-hero font-black [font-weight:1000] text-3xl sm:text-5xl lg:text-6xl text-slate-950 uppercase tracking-tight leading-[0.95]">
              SERVICE COMPARISON<span className="text-red-600">.</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 self-start lg:self-end">
            <p className="font-sans text-sm sm:text-base text-slate-600 max-w-md leading-relaxed">
              Compare key details at a glance to find the right service for your needs.
            </p>
            <button
              type="button"
              onClick={scrollToPricing}
              className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-950 hover:text-red-600 px-4 py-2.5 rounded-full border border-slate-300 bg-white hover:border-slate-950 transition-colors shadow-xs cursor-pointer shrink-0"
            >
              <span>VIEW DETAILED PRICING</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* DARK COMPARISON TABLE PANEL                              */}
        {/* ======================================================== */}
        <div className="bg-[#0d1117] text-white rounded-3xl p-4 sm:p-5 lg:p-6 border border-slate-800/90 shadow-2xl overflow-hidden select-none">
          {/* Mobile/Tablet scroll wrapper with smooth indicator */}
          <div className="overflow-x-auto pb-3 no-scrollbar">
            <table className="w-full min-w-[880px] lg:min-w-full border-collapse">
              <thead>
                <tr>
                  {/* Criterion Header Column */}
                  <th className="w-[24%] p-3 sm:p-4 text-left align-bottom border-b border-slate-800">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
                      FEATURE
                    </span>
                  </th>

                  {/* 4 Service Header Columns */}
                  {primaryServices.map((service) => {
                    const isFeatured = Boolean(service.featured);
                    return (
                      <th
                        key={service.id}
                        className={`w-[19%] p-3 sm:p-4 text-left align-top transition-colors relative border-b border-slate-800 ${
                          isFeatured
                            ? 'bg-white/[0.03] border-l-2 border-r-2 border-t-2 border-red-600/90 rounded-t-2xl'
                            : ''
                        }`}
                      >
                        {/* Featured Header Pill */}
                        {isFeatured && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white font-mono text-[9px] tracking-widest font-bold uppercase px-3 py-0.5 rounded-full shadow-md whitespace-nowrap">
                            RECOMMENDED
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
                            {renderServiceHeaderIcon(service.id)}
                          </div>

                          <div>
                            <h3 className="font-sans font-bold text-xs sm:text-sm text-white tracking-tight leading-snug">
                              {service.title}
                            </h3>
                          </div>

                          <div className="pt-0.5">
                            <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block">
                              {service.startingPrice ? 'Starting at' : 'Custom scope'}
                            </span>
                            <span className="font-sans font-black text-base sm:text-lg text-white tracking-tight">
                              {service.startingPrice
                                ? `$${service.startingPrice.toLocaleString()}`
                                : "Let's discuss"}
                            </span>
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {criteriaList.map((crit: ComparisonCriteriaItem) => {
                  const isTextRow = crit.type === 'text';

                  return (
                    <tr
                      key={crit.id}
                      className="border-b border-slate-800/60 hover:bg-white/[0.015] transition-colors"
                    >
                      {/* Criterion Label with Icon */}
                      <td className="py-2.5 px-3 sm:py-3 sm:px-4 text-left align-middle">
                        <div className="flex items-center gap-2">
                          {renderCriteriaIcon(crit.icon)}
                          <span className="font-sans text-xs sm:text-sm font-medium text-slate-300">
                            {crit.label}
                          </span>
                        </div>
                      </td>

                      {/* Service Values */}
                      {primaryServices.map((service) => {
                        const isFeatured = Boolean(service.featured);
                        const cellVal = service.comparison?.[crit.id];

                        return (
                          <td
                            key={service.id}
                            className={`py-2.5 px-3 sm:py-3 sm:px-4 align-middle ${
                              isTextRow ? 'text-left' : 'text-center'
                            } ${
                              isFeatured
                                ? 'bg-white/[0.03] border-l-2 border-r-2 border-red-600/90'
                                : ''
                            }`}
                          >
                            {renderCellIndicator(cellVal)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                {/* Bottom Row: Get Started CTAs */}
                <tr className="border-t border-slate-800">
                  <td className="py-3 px-3 sm:py-3.5 sm:px-4 text-left align-middle">
                    <div className="flex items-center gap-2">
                      <Send className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Get started
                      </span>
                    </div>
                  </td>

                  {primaryServices.map((service) => {
                    const isFeatured = Boolean(service.featured);
                    return (
                      <td
                        key={service.id}
                        className={`py-3 px-3 sm:py-3.5 sm:px-4 align-middle ${
                          isFeatured
                            ? 'bg-white/[0.03] border-l-2 border-r-2 border-b-2 border-red-600/90 rounded-b-2xl'
                            : ''
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleCta(service)}
                          className={`w-full py-2 px-2.5 rounded-lg font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                            isFeatured
                              ? 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/30'
                              : 'border border-white/20 hover:border-white text-white hover:bg-white/5'
                          }`}
                        >
                          <span>{service.ctaLabel}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile swipe helper hint */}
          <div className="block lg:hidden text-center pt-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            Scroll horizontally to compare all options →
          </div>
        </div>
      </div>
    </section>
  );
};
