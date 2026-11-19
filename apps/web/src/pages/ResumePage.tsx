import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, GraduationCap, Briefcase, Award } from 'lucide-react';
import { DynamicIsland } from '../components/layout/DynamicIsland.js';
import { CornerNavigationDial } from '../components/navigation/CornerNavigationDial.js';
import { Footer } from '../components/layout/Footer.js';
import { siteConfig } from '../lib/config/site-config.js';

export const ResumePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f6f0] text-[#0f1117] selection:bg-black selection:text-white bg-grain flex flex-col justify-between">
      <DynamicIsland />
      <CornerNavigationDial />

      <main className="w-full max-w-[1024px] mx-auto px-6 sm:px-12 pt-28 sm:pt-36 pb-20 flex-1">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO HOME
          </Link>
        </div>

        {/* Header & Download CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-slate-300/80 mb-10">
          <div>
            <h1 className="font-hero font-black text-4xl sm:text-5xl text-slate-950 uppercase tracking-tight mb-2">
              KRISHNA GOYAL
            </h1>
            <p className="font-mono text-sm text-red-600 font-bold uppercase tracking-wider">
              {siteConfig.personal.title} · VIT-AP (2027)
            </p>
          </div>

          <a
            href={siteConfig.assets.resume}
            download="krishna-goyal-resume.pdf"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-950 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors shadow-md shrink-0"
          >
            <Download className="w-4 h-4" />
            DOWNLOAD PDF RESUME
          </a>
        </div>

        {/* Resume Content Sections */}
        <div className="space-y-10">
          {/* Executive Summary */}
          <div className="bg-white p-6 rounded-xl border border-slate-300/80">
            <span className="font-mono text-xs uppercase tracking-widest text-slate-400 font-bold block mb-2">
              EXECUTIVE SUMMARY
            </span>
            <p className="font-sans text-sm text-slate-800 leading-relaxed">
              Frontend-focused Computer Science undergraduate graduating in 2027, with hands-on
              experience building web applications using React, TypeScript, and JavaScript.
              Experienced in developing interactive interfaces, integrating REST APIs, and
              optimizing browser-side performance using Web Workers and efficient rendering
              techniques. Strong foundation in frontend engineering, full-stack development, and
              computer science fundamentals, with experience building and validating SaaS products.
            </p>
          </div>

          {/* Education */}
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">
              <GraduationCap className="w-4 h-4 text-slate-900" />
              EDUCATION
            </div>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded-xl border border-slate-300/80">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                  <h3 className="font-sans font-black text-lg text-slate-950">VIT-AP University</h3>
                  <span className="font-mono text-xs text-red-600 font-bold">2023 — 2027</span>
                </div>
                <p className="font-sans text-sm text-slate-700 mb-2">
                  B.Tech in Computer Science and Engineering — Amaravati, Andhra Pradesh (CGPA: 8.15
                  / 10.0)
                </p>
                <p className="font-sans text-xs text-slate-600">
                  Core Subjects: Data Structures & Algorithms, Object-Oriented Programming,
                  Operating Systems, Computer Networks, Database Management Systems.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-300/80">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                  <h3 className="font-sans font-black text-lg text-slate-950">
                    Satyanarayan Academy
                  </h3>
                  <span className="font-mono text-xs text-slate-500 font-bold">2023</span>
                </div>
                <p className="font-sans text-sm text-slate-700">
                  Senior Secondary (CBSE) — Asansol, West Bengal (Aggregate: 86.20%)
                </p>
              </div>
            </div>
          </div>

          {/* Technical Skills Overview */}
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">
              <Briefcase className="w-4 h-4 text-slate-900" />
              TECHNICAL STACK
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-300/80">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  PROGRAMMING LANGUAGES
                </span>
                <p className="font-sans text-sm font-semibold text-slate-950">
                  JavaScript, TypeScript, Java, SQL
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-300/80">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  FRONTEND ENGINEERING
                </span>
                <p className="font-sans text-sm font-semibold text-slate-950">
                  React.js, Next.js, HTML5, CSS3, Tailwind CSS, TanStack Query, Vite, Web Workers
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-300/80">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  BACKEND & APIS
                </span>
                <p className="font-sans text-sm font-semibold text-slate-950">
                  Node.js, Express.js, NestJS, REST APIs, WebSockets, JWT Authentication
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-300/80">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  DATABASES
                </span>
                <p className="font-sans text-sm font-semibold text-slate-950">
                  MongoDB, PostgreSQL, MySQL, Redis
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-300/80">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  TOOLS & PLATFORMS
                </span>
                <p className="font-sans text-sm font-semibold text-slate-950">
                  Git, GitHub, npm, pnpm, Docker, AWS, Postman, Figma
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-300/80">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  CORE COMPUTER SCIENCE
                </span>
                <p className="font-sans text-sm font-semibold text-slate-950">
                  Data Structures and Algorithms, OOP, Operating Systems, Computer Networks, DBMS
                </p>
              </div>
            </div>
          </div>

          {/* Featured Projects */}
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">
              <Briefcase className="w-4 h-4 text-slate-900" />
              FEATURED PROJECTS
            </div>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded-xl border border-slate-300/80">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                  <h3 className="font-sans font-black text-lg text-slate-950">InsightLoop</h3>
                  <span className="font-mono text-xs text-red-600 font-bold">
                    React.js · TypeScript · Node.js · Express.js · MongoDB · Redis
                  </span>
                </div>
                <p className="font-sans text-sm text-slate-700 mb-2">
                  Developed a centralized business management platform addressing fragmented,
                  paper-based workflows for MSMEs and factory owners through beginner-friendly
                  digital workflows.
                </p>
                <p className="font-sans text-xs text-slate-600">
                  Conducted early validation with ~5 target businesses managing 200+ manual bills;
                  engineered real-time WebSockets and Redis communication for live status
                  synchronization.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-300/80">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                  <h3 className="font-sans font-black text-lg text-slate-950">Market Aura 4U</h3>
                  <span className="font-mono text-xs text-red-600 font-bold">
                    React.js · TypeScript · Node.js · Express.js · MongoDB
                  </span>
                </div>
                <p className="font-sans text-sm text-slate-700 mb-2">
                  Developed an AI-powered SaaS platform with interactive interfaces for
                  multi-channel marketing content generation and social media publishing.
                </p>
                <p className="font-sans text-xs text-slate-600">
                  Implemented React and TypeScript frontend workflows for authentication, brand
                  onboarding, and AI generation; integrated Cloudflare R2 zero-egress media storage
                  and Razorpay billing.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-300/80">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                  <h3 className="font-sans font-black text-lg text-slate-950">Loadout</h3>
                  <span className="font-mono text-xs text-red-600 font-bold">
                    React.js · TypeScript · Node.js · Express.js · Web Workers
                  </span>
                </div>
                <p className="font-sans text-sm text-slate-700 mb-2">
                  Built a developer-focused web performance engineering workbench with interactive
                  data processing, benchmarking, and result validation workflows.
                </p>
                <p className="font-sans text-xs text-slate-600">
                  Engineered off-thread Web Worker processing, virtualized rendering, Mann-Whitney U
                  statistical comparison tests, and zero-data-egress BM25 RAG AI Copilot.
                </p>
              </div>
            </div>
          </div>

          {/* Certifications & Recognition */}
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">
              <Award className="w-4 h-4 text-slate-900" />
              RECOGNITION & CERTIFICATIONS
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-300/80">
                <h4 className="font-sans font-bold text-sm text-slate-950 mb-1">
                  MERN Full Stack Development — BlackBucks
                </h4>
                <p className="font-sans text-xs text-slate-600">
                  Certified in modern full-stack MERN application architecture and production
                  deployment.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-300/80">
                <h4 className="font-sans font-bold text-sm text-slate-950 mb-1">
                  Cloud Computing — Corizo (AWS)
                </h4>
                <p className="font-sans text-xs text-slate-600">
                  Certified in cloud computing fundamentals, AWS infrastructure, and scalable
                  hosting services.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-300/80">
                <h4 className="font-sans font-bold text-sm text-slate-950 mb-1">
                  Co-founder, Udhyog Saathi
                </h4>
                <p className="font-sans text-xs text-slate-600">
                  Initiated a manufacturing SaaS product and led a 5-member technical team
                  overseeing research and development.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-300/80">
                <h4 className="font-sans font-bold text-sm text-slate-950 mb-1">
                  EY Techathon 5.0
                </h4>
                <p className="font-sans text-xs text-slate-600">
                  Advanced to Round 2 of the national-level engineering competition.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-300/80">
                <h4 className="font-sans font-bold text-sm text-slate-950 mb-1">
                  Smart India Hackathon 2023
                </h4>
                <p className="font-sans text-xs text-slate-600">
                  Participated in the prestigious national-level hackathon solving real-world
                  challenges.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-300/80">
                <h4 className="font-sans font-bold text-sm text-slate-950 mb-1">
                  President, Hindi Association – VIT-AP
                </h4>
                <p className="font-sans text-xs text-slate-600">
                  Led 20+ member team, organized 25+ university events with 200+ attendees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
