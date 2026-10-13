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
          {/* Education */}
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">
              <GraduationCap className="w-4 h-4 text-slate-900" />
              EDUCATION
            </div>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded-xl border border-slate-300/80">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                  <h3 className="font-sans font-black text-lg text-slate-950">
                    Vellore Institute of Technology (VIT-AP)
                  </h3>
                  <span className="font-mono text-xs text-red-600 font-bold">2023 — 2027</span>
                </div>
                <p className="font-sans text-sm text-slate-700 mb-2">
                  B.Tech in Computer Science and Engineering — Amaravati, India (CGPA: 7.95 / 10.0)
                </p>
                <p className="font-sans text-xs text-slate-600">
                  Coursework: Computer Networks, Operating Systems, DBMS, Object-Oriented Programming, NoSQL Databases.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-300/80">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                  <h3 className="font-sans font-black text-lg text-slate-950">
                    Satyanarayan Academy
                  </h3>
                  <span className="font-mono text-xs text-slate-500 font-bold">2021 — 2023</span>
                </div>
                <p className="font-sans text-sm text-slate-700">
                  Higher Secondary (PCM with Computer Science) — Aggregate: 86.2%
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
                  LANGUAGES
                </span>
                <p className="font-sans text-sm font-semibold text-slate-950">
                  Java, Python, JavaScript, TypeScript, Go (Golang), HTML5/CSS3, SQL
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-300/80">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  FRAMEWORKS & LIBRARIES
                </span>
                <p className="font-sans text-sm font-semibold text-slate-950">
                  React.js, Node.js, Express.js, Django, Django REST Framework, Flask, Tailwind CSS
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-300/80">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  DATABASES
                </span>
                <p className="font-sans text-sm font-semibold text-slate-950">
                  MongoDB, PostgreSQL, MySQL, Redis, Firebase
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-300/80">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  TOOLS & ENGINEERING
                </span>
                <p className="font-sans text-sm font-semibold text-slate-950">
                  Git, GitHub, Docker, Linux, REST APIs, WebSockets, Vitest, Postman
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
                  EY Techathon 5.0
                </h4>
                <p className="font-sans text-xs text-slate-600">
                  Cleared Round 1 of the national-level engineering competition.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-300/80">
                <h4 className="font-sans font-bold text-sm text-slate-950 mb-1">
                  Full Stack Development (MERN)
                </h4>
                <p className="font-sans text-xs text-slate-600">
                  Certified by BlackBucks in modern MERN application architecture.
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
