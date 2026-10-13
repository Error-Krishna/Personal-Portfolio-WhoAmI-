import React from 'react';
import { Zap, Clock, Users, ArrowRight, Bot, Video } from 'lucide-react';
import {
  getPrimaryServices,
  getSpecializedServices,
  type ServiceItem,
} from '../../lib/config/site-config.js';
import { ServicePricingCard } from './ServicePricingCard.js';

interface ServicePricingCardsProps {
  onSelectService?: (serviceTitle: string) => void;
}

export const ServicePricingCards: React.FC<ServicePricingCardsProps> = ({ onSelectService }) => {
  const primaryServices = getPrimaryServices();
  const specializedServices = getSpecializedServices();

  const handleSpecializedCta = (serviceTitle: string, destination: string) => {
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
      className="relative w-full bg-[#f8f6f0] text-[#0f1117] selection:bg-black selection:text-white overflow-hidden bg-grain px-6 sm:px-10 lg:px-12 pt-16 lg:pt-20 pb-10 border-t border-slate-300/80"
    >
      <div className="w-full max-w-[1536px] mx-auto">
        {/* ======================================================== */}
        {/* SECTION HEADER                                           */}
        {/* ======================================================== */}
        <div className="flex items-center gap-4 mb-4">
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] font-bold text-slate-800 uppercase">
            SERVICES & PRICING
          </span>
          <div className="w-16 sm:w-24 h-[1px] bg-slate-400/80" />
        </div>

        {/* Headline & Value Propositions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-8 lg:mb-10 items-start">
          {/* Left: Headline */}
          <div className="lg:col-span-7">
            <h2 className="font-hero font-black [font-weight:1000] text-[9vw] sm:text-[7vw] lg:text-[5vw] xl:text-[68px] text-slate-950 uppercase tracking-[-0.035em] leading-[0.92]">
              LET'S BUILD SOMETHING USEFUL<span className="text-red-600">.</span>
            </h2>
          </div>

          {/* Right: Explanatory text & 3 Value Prop Badges */}
          <div className="lg:col-span-5 space-y-4 pt-1">
            <p className="font-sans text-base sm:text-lg text-slate-700 leading-relaxed">
              Clear scope. Thoughtful engineering. Transparent pricing designed for founders, small
              businesses, and product teams.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-100/70 border border-red-200 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <span className="font-sans text-xs font-bold text-slate-950 block">
                    Focused Scope
                  </span>
                  <span className="font-sans text-[11px] text-slate-600">No ambiguity</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-100/70 border border-red-200 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <span className="font-sans text-xs font-bold text-slate-950 block">
                    Transparent Pricing
                  </span>
                  <span className="font-sans text-[11px] text-slate-600">Know what to expect</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-100/70 border border-red-200 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <span className="font-sans text-xs font-bold text-slate-950 block">
                    Post-Launch Support
                  </span>
                  <span className="font-sans text-[11px] text-slate-600">Ongoing assistance</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4 PRIMARY SERVICE CARDS ROW                              */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 xl:gap-6 items-stretch mb-8">
          {primaryServices.map((service: ServiceItem, index: number) => (
            <ServicePricingCard
              key={service.id}
              service={service}
              index={index}
              onSelectService={onSelectService}
            />
          ))}
        </div>

        {/* ======================================================== */}
        {/* ADDITIONAL SPECIALIZED SERVICES COMPACT PRESENTATION     */}
        {/* ======================================================== */}
        {specializedServices.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-300/70">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest font-bold text-slate-600">
                ADDITIONAL SPECIALIZED CAPABILITIES
              </span>
              <div className="h-[1px] bg-slate-300 flex-1 max-w-[200px]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {specializedServices.map((specService) => (
                <div
                  key={specService.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:border-slate-950/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shrink-0 mt-0.5">
                      {specService.id === 'automation-tools' ? (
                        <Bot className="w-5 h-5 text-red-600" />
                      ) : (
                        <Video className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-sans font-bold text-base text-slate-950">
                          {specService.title}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {specService.category}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-slate-600 max-w-md leading-relaxed mb-2">
                        {specService.shortDescription}
                      </p>
                      <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
                        {specService.startingPrice && (
                          <span className="font-bold text-slate-900">
                            Starting at ${specService.startingPrice.toLocaleString()}
                          </span>
                        )}
                        {specService.estimatedDelivery && (
                          <span>· {specService.estimatedDelivery}</span>
                        )}
                        {specService.supportPeriod && <span>· {specService.supportPeriod}</span>}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleSpecializedCta(specService.title, specService.ctaDestination)
                    }
                    className="shrink-0 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer self-stretch sm:self-auto justify-center"
                  >
                    <span>{specService.ctaLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
