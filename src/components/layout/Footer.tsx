/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from '../../router/Router';
import { useHirePulse } from '../../context/HirePulseContext';

export function Footer() {
  const { resetToDemoData } = useHirePulse();

  return (
    <footer className="mt-auto bg-[#0A1120] text-[#94A3B8] border-t border-slate-800/80 py-12 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          {/* Brand & Description matching screenshot */}
          <div className="space-y-3 max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-6 h-6 rounded-[5px] bg-white flex items-center justify-center text-[#0A1120] shrink-0">
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <span className="font-serif text-xl font-normal text-white tracking-tight">
                HirePulse
              </span>
            </Link>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              One place to read the open roles, apply, and follow an application through to a decision.
            </p>
          </div>

          {/* Navigation link columns matching screenshot */}
          <div className="flex gap-12 sm:gap-16">
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider">
                Candidates
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/" className="text-[#94A3B8] hover:text-white transition-colors duration-150">
                    Open roles
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider">
                Hiring team
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/dashboard" className="text-[#94A3B8] hover:text-white transition-colors duration-150">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-[#94A3B8] hover:text-white transition-colors duration-150">
                    Sign in
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright line matching screenshot */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#64748B]">
          <span>© 2026 HirePulse. All rights reserved.</span>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all demo data back to default initial seed?')) {
                resetToDemoData();
              }
            }}
            className="hover:text-slate-300 transition-colors duration-150 cursor-pointer underline underline-offset-2 decoration-slate-700"
            title="Reset jobs, applicants, and pipeline back to initial seeds"
          >
            Reset Seed Data
          </button>
        </div>
      </div>
    </footer>
  );
}
