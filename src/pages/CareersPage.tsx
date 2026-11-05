/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { useHirePulse } from '../context/HirePulseContext';
import { Link, useRouter } from '../router/Router';
import { ArrowRightIcon } from '../components/common/Icons';

export function CareersPage() {
  const { jobs } = useHirePulse();
  const { navigate } = useRouter();
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [activeFeatureTab, setActiveFeatureTab] = useState<
    'match_report' | 'ai_screening' | 'eligibility' | 'kanban' | 'scorecards' | 'open_roles'
  >('match_report');
  const [selectedDemoJobId, setSelectedDemoJobId] = useState<string>('job-fse');
  const [isScanning, setIsScanning] = useState(false);
  const [customScore, setCustomScore] = useState<number>(78);

  // Open positions
  const openJobs = useMemo(() => {
    return jobs.filter((j) => j.status === 'Open');
  }, [jobs]);

  const activeDemoJob = useMemo(() => {
    return jobs.find((j) => j.id === selectedDemoJobId) || jobs[0];
  }, [jobs, selectedDemoJobId]);

  // Departments and their counts
  const departmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    openJobs.forEach((job) => {
      counts[job.department] = (counts[job.department] || 0) + 1;
    });
    return counts;
  }, [openJobs]);

  const departmentsList = useMemo(() => {
    return Object.keys(departmentCounts).sort();
  }, [departmentCounts]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    if (selectedDept === 'All') return openJobs;
    return openJobs.filter((j) => j.department === selectedDept);
  }, [openJobs, selectedDept]);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setCustomScore(Math.floor(Math.random() * 12) + 82);
    }, 600);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] text-[#0F172A]">
      {/* 1. Hero Section matching image_c08fd1c1.png */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline and Pitch */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-[#0F172A] font-normal tracking-tight leading-[1.08]">
              Find the work<br />
              worth <span className="italic font-normal text-[#0B6E99]">doing</span><br />
              <span className="italic font-normal text-[#0B6E99]">next.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#475569] max-w-lg font-normal leading-relaxed">
              Every open role in one place, one application form per job, and a clear path from your first message to a final answer.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => scrollToSection('open-roles')}
                className="bg-[#0F172A] text-white hover:bg-[#1E293B] active:bg-[#020617] px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-[6px] transition-colors duration-150 cursor-pointer shadow-2xs flex items-center gap-2"
              >
                <span>Explore Platform Features</span>
                <span>↓</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('how-hiring-works')}
                className="text-xs sm:text-sm font-medium text-[#475569] hover:text-[#0F172A] underline underline-offset-4 decoration-[#CBD5E1] hover:decoration-[#0F172A] transition-colors duration-150 cursor-pointer py-2 px-1"
              >
                How hiring works
              </button>
            </div>
          </div>

          {/* Right Column: High Quality Office Team Photo matching screenshot */}
          <div className="lg:col-span-6">
            <div className="space-y-2.5">
              <div className="overflow-hidden rounded-[8px] border border-[#E2E8F0] shadow-sm bg-white">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80"
                  alt="HirePulse team collaborating in sunlit modern office"
                  className="w-full h-[320px] sm:h-[380px] object-cover object-center"
                />
              </div>

              {/* Caption row below photo */}
              <div className="flex items-center justify-between text-xs text-[#64748B] px-1 font-normal">
                <span>Hiring is a team conversation.</span>
                <span>{openJobs.length} open roles · {departmentsList.length} departments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Features & ATS Intelligence Showcase (Replacing bare roles list) */}
      <section id="open-roles" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#E2E8F0]">
        {/* Section Header inspired by image_a3cf87c5.png */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#0B6E99] bg-[#EBF5FA] border border-[#BAE6FD] px-3 py-1 rounded-full inline-block">
            All-in-One ATS & Candidate Intelligence Platform
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl text-[#0F172A] font-normal tracking-tight leading-[1.15]">
            Optimize & screen resumes for the{' '}
            <span className="italic font-normal text-[#0B6E99] bg-amber-50 px-1 border-b-2 border-amber-200">
              exact ATS criteria
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-2xl mx-auto">
            HirePulse AI detects applicant tracking patterns on every requisition, verifies document integrity, validates non-negotiable eligibility criteria, and calculates semantic match scores in real time.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleSimulateScan}
              disabled={isScanning}
              className="bg-[#0B6E99] text-white hover:bg-[#085475] active:bg-[#074763] px-6 py-3 text-xs sm:text-sm font-semibold rounded-[6px] transition-all duration-150 cursor-pointer shadow-sm flex items-center gap-2"
            >
              {isScanning ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span>Analyzing ATS Parser Weights...</span>
                </>
              ) : (
                <>
                  <span>Scan Resume with HirePulse AI</span>
                  <span>→</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveFeatureTab('open_roles')}
              className="bg-white text-[#0F172A] border border-[#E2E8F0] hover:bg-[#FAF7F2] px-4 py-3 text-xs sm:text-sm font-medium rounded-[6px] transition-colors duration-150 cursor-pointer"
            >
              Browse Open Roles ({openJobs.length})
            </button>
          </div>
        </div>

        {/* Feature Navigation Tabs matching image_a3cf87c5.png */}
        <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-3 mb-8 text-xs scrollbar-none">
          {[
            { id: 'match_report', label: 'Match Report', icon: '📄' },
            { id: 'ai_screening', label: 'AI Screening & Anti-Spam', icon: '✨' },
            { id: 'eligibility', label: 'Hard Eligibility Filter', icon: '🛡️' },
            { id: 'kanban', label: 'Kanban Pipeline', icon: '📊' },
            { id: 'scorecards', label: 'Scorecards & Interviews', icon: '⭐' },
            { id: 'open_roles', label: `Open Roles (${openJobs.length})`, icon: '📋' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFeatureTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-[6px] border font-medium transition-all duration-150 shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeFeatureTab === tab.id
                  ? 'bg-white text-[#0B6E99] border-[#0B6E99] shadow-xs ring-1 ring-[#0B6E99]/30'
                  : 'bg-white/70 text-[#475569] border-[#E2E8F0] hover:bg-white hover:text-[#0F172A]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Interactive Feature Showcase Card matching Jobscan Layout */}
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] shadow-sm overflow-hidden mb-12">
          {/* Card Top Utility Bar */}
          <div className="bg-[#FAF7F2]/80 border-b border-[#E2E8F0] px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#64748B] font-medium">Requisition Tested:</span>
              <select
                aria-label="Select target requisition to simulate"
                value={selectedDemoJobId}
                onChange={(e) => setSelectedDemoJobId(e.target.value)}
                className="font-serif text-sm font-normal text-[#0F172A] bg-white border border-[#CBD5E1] rounded-[4px] px-2.5 py-1 focus:outline-none focus:border-[#0B6E99]"
              >
                {openJobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} ({job.location})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSimulateScan}
                className="text-[11px] font-medium px-2.5 py-1 rounded bg-white border border-[#CBD5E1] hover:bg-[#FAF7F2] text-[#0F172A] transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>⚡ Re-score</span>
              </button>
              <button
                type="button"
                onClick={() => alert('Summary exported to PDF mock report.')}
                className="text-[11px] font-medium px-2.5 py-1 rounded bg-white border border-[#CBD5E1] hover:bg-[#FAF7F2] text-[#0F172A] transition-colors cursor-pointer"
              >
                Print Report
              </button>
            </div>
          </div>

          {/* TAB 1: Match Report (Default showcase matching image_a3cf87c5.png) */}
          {activeFeatureTab === 'match_report' && (
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Circular Match Rate Gauge */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-[#FAF7F2]/60 border border-[#E2E8F0] rounded-[6px] text-center space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  ATS Match Rate
                </span>

                {/* SVG Circular Progress Meter */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#E2E8F0"
                      strokeWidth="9"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#0B6E99"
                      strokeWidth="9"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * customScore) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="font-serif text-4xl text-[#0F172A] font-bold leading-none">
                      {customScore}%
                    </span>
                    <span className="text-[11px] text-[#0B6E99] font-medium mt-1">
                      {customScore >= 80 ? 'Strong Match' : 'Good Match'}
                    </span>
                  </div>
                </div>

                <div className="w-full pt-3 border-t border-[#E2E8F0] space-y-2 text-xs text-[#475569]">
                  <div className="flex justify-between">
                    <span>Searchability Index:</span>
                    <strong className="text-[#065F46]">100% Passed</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Skills Overlap:</span>
                    <strong className="text-[#0B6E99]">
                      {activeDemoJob.mandatorySkills?.length || 4}/
                      {activeDemoJob.mandatorySkills?.length || 4} Core Skills
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Spam Gating:</span>
                    <strong className="text-[#065F46]">Verified Clean</strong>
                  </div>
                </div>
              </div>

              {/* Right Column: Searchability, Hard Gating, and Key Skills */}
              <div className="lg:col-span-8 space-y-6">
                {/* Green ATS Detected Alert matching screenshot */}
                <div className="p-3.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-[6px] text-xs text-[#065F46] flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    ✓
                  </span>
                  <div>
                    <span className="font-semibold block text-[13px]">
                      ATS Parsing Engine Verified
                    </span>
                    <p className="mt-0.5 text-xs text-[#047857] leading-relaxed">
                      Your resume format conforms with Workday, Greenhouse, Lever, and HirePulse semantic token extractors.
                    </p>
                  </div>
                </div>

                {/* Searchability Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg text-[#0F172A] font-normal">
                      Searchability & Parsing
                    </h3>
                    <span className="text-[10px] font-bold uppercase bg-[#0F172A] text-white px-2 py-0.5 rounded-[3px]">
                      Important
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    An Applicant Tracking System searches keywords, header anchors, and chronological tenure before surfacing applicants to recruiters.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {[
                      'Clear semantic headings (Experience, Skills, Education)',
                      'Clean typography and standard file extension (.pdf / .docx)',
                      'Zero corrupted binary or unprintable OCR tokens',
                      'Healthy keyword density (No deceptive white-text stuffing)'
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-[4px] bg-[#FAF7F2] border border-[#E2E8F0] text-xs text-[#065F46] flex items-center gap-2"
                      >
                        <span className="font-bold">✓</span>
                        <span className="text-[#334155]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hard Eligibility Checklist */}
                <div className="pt-2 border-t border-[#F1F5F9] space-y-2">
                  <h3 className="font-serif text-lg text-[#0F172A] font-normal">
                    Hard Qualification Criteria ({activeDemoJob.title})
                  </h3>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between p-2 rounded bg-white border border-[#E2E8F0]">
                      <span className="text-[#334155]">Minimum Experience:</span>
                      <span className="font-medium text-[#065F46]">
                        {activeDemoJob.minExperience} yrs required (Candidate: 6.5 yrs) ✓
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-white border border-[#E2E8F0]">
                      <span className="text-[#334155]">Education Level:</span>
                      <span className="font-medium text-[#065F46]">
                        {activeDemoJob.minEducation || 'Bachelor'} verified ✓
                      </span>
                    </div>
                  </div>
                </div>

                {/* Matching Skills vs Recommendations */}
                <div className="pt-2 border-t border-[#F1F5F9] space-y-2">
                  <h3 className="font-serif text-base text-[#0F172A] font-normal">
                    Verified Competencies & Recommended Keywords
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(activeDemoJob.mandatorySkills || ['TypeScript', 'React', 'PostgreSQL']).map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] rounded-[4px] font-medium"
                      >
                        ✓ {s}
                      </span>
                    ))}
                    <span className="px-2.5 py-1 text-xs bg-[#EBF5FA] text-[#0B6E99] border border-[#BAE6FD] rounded-[4px] font-medium">
                      + System Architecture
                    </span>
                    <span className="px-2.5 py-1 text-xs bg-[#EBF5FA] text-[#0B6E99] border border-[#BAE6FD] rounded-[4px] font-medium">
                      + Docker / CI/CD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI Screening & Anti-Spam */}
          {activeFeatureTab === 'ai_screening' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-[#E2E8F0] pb-4">
                <h3 className="font-serif text-2xl text-[#0F172A] font-normal">
                  Module A: Spam & Invalid File Detection
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                  Protects talent teams by catching empty resumes, corrupted uploads, and fraudulent keyword-stuffing hacks before parsing begins.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#FAF7F2] border border-[#E2E8F0] rounded-[6px] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#0F172A]">Word Count Gating</span>
                    <span className="text-[10px] font-bold text-[#065F46] bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0]">
                      Passed (448 words)
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Disqualifies empty or truncated files (&lt;40 words) that fail basic human resume completeness standards.
                  </p>
                </div>

                <div className="p-4 bg-[#FAF7F2] border border-[#E2E8F0] rounded-[6px] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#0F172A]">Anti-Keyword Stuffing</span>
                    <span className="text-[10px] font-bold text-[#065F46] bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0]">
                      Passed (2.3% density)
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Identifies repeated hidden tokens (e.g., repeating "python" 50 times in white text) and flags candidates automatically.
                  </p>
                </div>

                <div className="p-4 bg-[#FAF7F2] border border-[#E2E8F0] rounded-[6px] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#0F172A]">Gibberish / OCR Check</span>
                    <span className="text-[10px] font-bold text-[#065F46] bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0]">
                      Clean (0.0% binary)
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Validates printable ASCII characters and eliminates OCR scan noise before semantic embeddings compute.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Hard Eligibility Filter */}
          {activeFeatureTab === 'eligibility' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-[#E2E8F0] pb-4">
                <h3 className="font-serif text-2xl text-[#0F172A] font-normal">
                  Module B: Hard Eligibility Filtration
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                  Enforces non-negotiable minimum qualifications automatically so hiring managers never waste hours reviewing unqualified applications.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-[#E2E8F0] rounded-[6px] space-y-2">
                  <span className="text-xs font-mono text-[#0B6E99] uppercase">Criterion 01</span>
                  <h4 className="font-serif text-base text-[#0F172A]">Tenure & Seniority Gate</h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Calculates parsed employment spans against <code className="text-[#0B6E99]">job.min_experience</code>.
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#E2E8F0] rounded-[6px] space-y-2">
                  <span className="text-xs font-mono text-[#0B6E99] uppercase">Criterion 02</span>
                  <h4 className="font-serif text-base text-[#0F172A]">Mandatory Skills Match</h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Requires 100% presence of non-negotiable core tools with case-insensitive boundary checks.
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#E2E8F0] rounded-[6px] space-y-2">
                  <span className="text-xs font-mono text-[#0B6E99] uppercase">Criterion 03</span>
                  <h4 className="font-serif text-base text-[#0F172A]">Degree Level Validation</h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Maps accredited degrees (B.Tech, Bachelor, Master, PhD) to qualification requirements.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Kanban Pipeline Preview */}
          {activeFeatureTab === 'kanban' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-[#E2E8F0] pb-4">
                <h3 className="font-serif text-2xl text-[#0F172A] font-normal">
                  Module C: 6-Stage Visual Kanban Board
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                  Drag and drop applicants seamlessly across stages, with touch and keyboard fallbacks.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs text-center">
                {[
                  { name: 'Applied', color: 'bg-sky-500', count: '1 Candidate' },
                  { name: 'Screening', color: 'bg-amber-500', count: '2 Candidates' },
                  { name: 'Interview', color: 'bg-orange-500', count: '3 Candidates' },
                  { name: 'Offer', color: 'bg-indigo-500', count: '1 Candidate' },
                  { name: 'Hired', color: 'bg-emerald-500', count: '1 Hired' },
                  { name: 'Rejected', color: 'bg-rose-500', count: '1 Ineligible' }
                ].map((st) => (
                  <div key={st.name} className="p-3 bg-[#FAF7F2] border border-[#E2E8F0] rounded-[6px] space-y-1.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${st.color}`} />
                      <span className="font-semibold text-[#0F172A]">{st.name}</span>
                    </div>
                    <span className="text-[11px] text-[#64748B] block">{st.count}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B6E99] hover:underline"
                >
                  <span>Open live staff Kanban board</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          )}

          {/* TAB 5: Scorecards & Evaluation */}
          {activeFeatureTab === 'scorecards' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-[#E2E8F0] pb-4">
                <h3 className="font-serif text-2xl text-[#0F172A] font-normal">
                  Collaborative Staff Scorecards & Multi-Rater Rubrics
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                  1–5 star ratings across Technical Competency, Culture Fit, and Communication with verifiable feedback notes.
                </p>
              </div>

              <div className="p-4 bg-[#FAF7F2] border border-[#E2E8F0] rounded-[6px] max-w-xl mx-auto space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-medium text-[#0F172A]">Sample Review: Sneha Patel</span>
                  <span className="text-xs text-[#065F46] font-semibold bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                    ★ 5.0 Overall
                  </span>
                </div>
                <p className="text-xs text-[#475569] italic leading-relaxed">
                  "Candidate solved live distributed locking challenge cleanly with advisory locks and zero race conditions. Exemplary communicator."
                </p>
                <div className="flex gap-4 text-[11px] text-[#64748B] pt-2 border-t border-[#E2E8F0]">
                  <span>Technical: <strong>5/5</strong></span>
                  <span>Culture: <strong>5/5</strong></span>
                  <span>Communication: <strong>5/5</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Open Roles Directory Table */}
          {activeFeatureTab === 'open_roles' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2E8F0] pb-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#0F172A] font-normal">
                    Available Positions ({openJobs.length})
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1">
                    Select a requisition below to view full requirements and apply.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedDept('All')}
                    className={`px-2.5 py-1 text-xs rounded border cursor-pointer ${
                      selectedDept === 'All'
                        ? 'bg-[#0F172A] text-white border-[#0F172A]'
                        : 'bg-white text-[#475569] border-[#E2E8F0]'
                    }`}
                  >
                    All {openJobs.length}
                  </button>
                  {departmentsList.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => setSelectedDept(dept)}
                      className={`px-2.5 py-1 text-xs rounded border cursor-pointer ${
                        selectedDept === dept
                          ? 'bg-[#0F172A] text-white border-[#0F172A]'
                          : 'bg-white text-[#475569] border-[#E2E8F0]'
                      }`}
                    >
                      {dept} ({departmentCounts[dept]})
                    </button>
                  ))}
                </div>
              </div>

              {/* Roles Table */}
              <div className="divide-y divide-[#E2E8F0] border-t border-b border-[#0F172A]">
                {filteredJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="group block py-3.5 hover:bg-[#FAF7F2] transition-colors -mx-2 px-2 rounded"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center text-xs">
                      <div className="md:col-span-4">
                        <span className="font-serif text-base text-[#0F172A] group-hover:text-[#0B6E99] font-medium block">
                          {job.title}
                        </span>
                        <span className="text-[11px] text-[#94A3B8]">
                          {job.postedDateDisplay || 'Posted Recently'}
                        </span>
                      </div>
                      <div className="md:col-span-2 text-[#475569]">{job.department}</div>
                      <div className="md:col-span-2 text-[#475569]">{job.location}</div>
                      <div className="md:col-span-2 text-[#475569]">{job.employmentType}</div>
                      <div className="md:col-span-2 text-right flex items-center justify-end gap-2 text-[#0F172A] font-medium">
                        <span>{job.salaryRange}</span>
                        <ArrowRightIcon className="w-3.5 h-3.5 text-[#0B6E99]" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4 Feature Pillars Grid below the interactive showcase */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
          <div className="p-5 bg-white border border-[#E2E8F0] rounded-[7px] space-y-2 shadow-2xs">
            <span className="font-serif italic text-xl text-[#0B6E99] font-normal block leading-none">
              01
            </span>
            <h3 className="font-serif text-base text-[#0F172A] font-normal">
              Spam & File Integrity
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Automated rejection of corrupt documents, empty submissions (&lt;40 words), and deceptive hidden keyword stuffing.
            </p>
          </div>

          <div className="p-5 bg-white border border-[#E2E8F0] rounded-[7px] space-y-2 shadow-2xs">
            <span className="font-serif italic text-xl text-[#0B6E99] font-normal block leading-none">
              02
            </span>
            <h3 className="font-serif text-base text-[#0F172A] font-normal">
              Hard Eligibility Gating
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Disqualifies candidates who do not meet non-negotiable experience, required degrees, or mandatory core skills.
            </p>
          </div>

          <div className="p-5 bg-white border border-[#E2E8F0] rounded-[7px] space-y-2 shadow-2xs">
            <span className="font-serif italic text-xl text-[#0B6E99] font-normal block leading-none">
              03
            </span>
            <h3 className="font-serif text-base text-[#0F172A] font-normal">
              Hybrid Semantic Match
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Blends skill overlap coefficient (60%) with TF-IDF cosine similarity (40%) to rank candidates with precision.
            </p>
          </div>

          <div className="p-5 bg-white border border-[#E2E8F0] rounded-[7px] space-y-2 shadow-2xs">
            <span className="font-serif italic text-xl text-[#0B6E99] font-normal block leading-none">
              04
            </span>
            <h3 className="font-serif text-base text-[#0F172A] font-normal">
              Staff Kanban & Rubrics
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Structured 6-stage applicant board, interview schedule integrations, and 1–5 multi-rater evaluation scorecards.
            </p>
          </div>
        </div>
      </section>

      {/* 3. "How hiring works here" Section matching image_5b249ff8.png */}
      <section id="how-hiring-works" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#E2E8F0]">
        <div className="mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0F172A] font-normal tracking-tight">
            How hiring works here
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[#64748B]">
            Five stages, the same for every role. You are never left wondering where you stand.
          </p>
        </div>

        {/* 5 Stages Grid with hairline rules */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Stage 01 */}
          <div className="border-t border-[#0F172A] pt-4 space-y-2">
            <span className="font-serif italic text-2xl text-[#0B6E99] font-normal block leading-none">
              01
            </span>
            <h3 className="font-serif text-lg text-[#0F172A] font-normal">
              Applied
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Your answers and resume reach the hiring team the moment you submit the form.
            </p>
          </div>

          {/* Stage 02 */}
          <div className="border-t border-[#0F172A] pt-4 space-y-2">
            <span className="font-serif italic text-2xl text-[#0B6E99] font-normal block leading-none">
              02
            </span>
            <h3 className="font-serif text-lg text-[#0F172A] font-normal">
              Screening
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Someone reads your application against the role and replies with next steps.
            </p>
          </div>

          {/* Stage 03 */}
          <div className="border-t border-[#0F172A] pt-4 space-y-2">
            <span className="font-serif italic text-2xl text-[#0B6E99] font-normal block leading-none">
              03
            </span>
            <h3 className="font-serif text-lg text-[#0F172A] font-normal">
              Interview
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              A time is booked with the people you would work with, and you get the details.
            </p>
          </div>

          {/* Stage 04 */}
          <div className="border-t border-[#0F172A] pt-4 space-y-2">
            <span className="font-serif italic text-2xl text-[#0B6E99] font-normal block leading-none">
              04
            </span>
            <h3 className="font-serif text-lg text-[#0F172A] font-normal">
              Offer
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              If it is a match, the offer arrives in writing, with room to talk it through.
            </p>
          </div>

          {/* Stage 05 */}
          <div className="border-t border-[#0F172A] pt-4 space-y-2">
            <span className="font-serif italic text-2xl text-[#0B6E99] font-normal block leading-none">
              05
            </span>
            <h3 className="font-serif text-lg text-[#0F172A] font-normal">
              Decision
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Hired or not this time, your application always ends with a clear answer.
            </p>
          </div>
        </div>
      </section>

      {/* 4. "Hiring team? Open the dashboard." Dark Navy Banner matching screenshot */}
      <section className="bg-[#0A1120] text-white py-14 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-between">
            {/* Left pitch and button */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal tracking-tight">
                Hiring team? <span className="italic text-[#38BDF8]">Open the dashboard.</span>
              </h2>

              <p className="text-xs sm:text-sm text-[#94A3B8] max-w-lg leading-relaxed">
                Post roles, review applications on the candidate board, schedule interviews and record scorecards, all in one workspace.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="bg-white text-[#0A1120] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] px-4 py-2 text-xs font-semibold rounded-[6px] transition-colors duration-150 cursor-pointer shadow-sm inline-flex items-center gap-1.5"
                >
                  <span>Go to the dashboard</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Right matrix box with 6 stages matching screenshot */}
            <div className="lg:col-span-5">
              <div className="border border-[#1E293B] rounded-[8px] bg-[#0F172A]/80 p-3 sm:p-4">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {/* Row 1 */}
                  <div className="p-2.5 rounded-[4px] border border-[#1E293B] bg-[#0A1120]/60 flex items-center gap-2 text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                    <span className="font-medium text-[11px]">Applied</span>
                  </div>
                  <div className="p-2.5 rounded-[4px] border border-[#1E293B] bg-[#0A1120]/60 flex items-center gap-2 text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                    <span className="font-medium text-[11px]">Screening</span>
                  </div>
                  <div className="p-2.5 rounded-[4px] border border-[#1E293B] bg-[#0A1120]/60 flex items-center gap-2 text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-[#FB923C]" />
                    <span className="font-medium text-[11px]">Interview</span>
                  </div>

                  {/* Row 2 */}
                  <div className="p-2.5 rounded-[4px] border border-[#1E293B] bg-[#0A1120]/60 flex items-center gap-2 text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-[#818CF8]" />
                    <span className="font-medium text-[11px]">Offer</span>
                  </div>
                  <div className="p-2.5 rounded-[4px] border border-[#1E293B] bg-[#0A1120]/60 flex items-center gap-2 text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                    <span className="font-medium text-[11px]">Hired</span>
                  </div>
                  <div className="p-2.5 rounded-[4px] border border-[#1E293B] bg-[#0A1120]/60 flex items-center gap-2 text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-[#F43F5E]" />
                    <span className="font-medium text-[11px]">Rejected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
