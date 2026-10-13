import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'DISCOVER',
    description: 'We discuss your idea, goals, requirements, and budget.',
  },
  {
    number: '02',
    title: 'PLAN',
    description:
      'We define the scope, choose the right approach, and agree on deliverables and timelines.',
  },
  {
    number: '03',
    title: 'BUILD',
    description: 'I develop your solution, share progress, and incorporate your feedback.',
  },
  {
    number: '04',
    title: 'DELIVER',
    description: 'We test the final product, deploy it if required, and complete the handover.',
  },
  {
    number: '05',
    title: 'SUPPORT',
    description: 'We discuss improvements, fixes, and next steps after delivery.',
  },
];

export const HowIWorkSection: React.FC = () => {
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="how-it-works"
      className="relative w-full bg-[#f8f6f0] text-[#0f1117] selection:bg-black selection:text-white overflow-hidden bg-grain px-6 sm:px-10 lg:px-12 py-20 lg:py-28 border-t border-slate-300/80"
    >
      <div className="w-full max-w-[1536px] mx-auto">
        {/* Section Header / Kicker */}
        <div className="flex items-center gap-4 mb-4">
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] font-bold text-slate-800 uppercase">
            HOW IT WORKS
          </span>
          <div className="w-16 sm:w-24 h-[1px] bg-slate-400/80" />
        </div>

        {/* Headline & Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-14 lg:mb-20 items-end">
          <div className="lg:col-span-7">
            <h2 className="font-hero font-black [font-weight:1000] text-[9vw] sm:text-[7vw] lg:text-[5vw] xl:text-[68px] text-slate-950 uppercase tracking-[-0.035em] leading-[0.92]">
              HOW WE&apos;LL WORK TOGETHER<span className="text-red-600">.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 pb-1">
            <p className="font-sans text-base sm:text-lg text-slate-700 leading-relaxed max-w-xl">
              A straightforward process to take your idea from the first conversation to a finished product.
            </p>
          </div>
        </div>

        {/* 5-Step Connected Timeline Flow (Horizontal on desktop / Vertical on mobile) */}
        <div className="relative">
          {/* Mobile Continuous Vertical Track Line */}
          <div
            className="lg:hidden absolute left-[13px] top-4 bottom-4 w-[1px] bg-slate-300"
            aria-hidden="true"
          />

          <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 lg:gap-5">
            {PROCESS_STEPS.map((step, index) => (
              <div
                key={step.number}
                className="relative group pl-10 sm:pl-12 lg:pl-0 flex flex-col justify-start"
              >
                {/* Desktop Horizontal Connector Line (steps 01-04) */}
                {index < PROCESS_STEPS.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-[14px] left-[28px] right-[-20px] h-[1px] bg-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />
                )}

                {/* Timeline Marker Node */}
                <div
                  className="absolute left-0 top-3 lg:static lg:mb-4 w-7 h-7 rounded-full bg-[#f8f6f0] border-2 border-slate-300 group-hover:border-red-600 transition-colors flex items-center justify-center z-10 shrink-0"
                  aria-hidden="true"
                >
                  <span className="w-2 h-2 rounded-full bg-slate-400 group-hover:bg-red-600 transition-colors" />
                </div>

                {/* Compact Step Card */}
                <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-slate-900/40 hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all flex flex-col justify-between h-full">
                  <div>
                    {/* Step Number & Title */}
                    <div className="flex items-baseline gap-2.5 mb-2.5">
                      <span className="font-mono font-black text-xl sm:text-2xl text-red-600 tracking-tight">
                        {step.number}
                      </span>
                      <span className="font-mono text-sm text-slate-400 font-normal" aria-hidden="true">
                        —
                      </span>
                      <h3 className="font-sans font-bold text-base sm:text-lg text-slate-950 tracking-tight uppercase">
                        {step.title}
                      </h3>
                    </div>

                    {/* 1–2 Line Description */}
                    <p className="font-sans text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Post-Flow CTA */}
        <div className="mt-12 sm:mt-16 flex justify-center">
          <a
            href="#contact"
            onClick={scrollToContact}
            className="inline-flex items-center gap-3 px-6 py-3.5 bg-slate-950 text-white font-mono text-xs sm:text-sm font-bold tracking-wider uppercase rounded-full hover:bg-red-600 transition-all shadow-sm active:scale-[0.98] group cursor-pointer"
          >
            <span>HAVE A PROJECT IN MIND? LET&apos;S TALK</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};
