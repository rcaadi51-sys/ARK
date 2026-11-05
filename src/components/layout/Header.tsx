/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRouter, Link } from '../../router/Router';
import { useHirePulse } from '../../context/HirePulseContext';
import { Badge } from '../common/Badge';

export function Header() {
  const { path, navigate } = useRouter();
  const { session, toggleStaffMode } = useHirePulse();

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-xs border-b border-[#E2E8F0] transition-colors duration-150">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo with Pulse Squircle */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-7 h-7 rounded-[6px] bg-[#0F172A] flex items-center justify-center text-white shrink-0 shadow-2xs group-hover:bg-[#0B6E99] transition-colors duration-150">
              <svg
                className="w-4 h-4"
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
            <span className="font-serif text-2xl font-normal text-[#0F172A] tracking-tight group-hover:text-[#0B6E99] transition-colors duration-150">
              HirePulse
            </span>
          </Link>
        </div>

        {/* Right side navigation matching image */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="text-xs sm:text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors duration-150"
          >
            Open roles
          </Link>

          {session.isStaff ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className={`text-xs sm:text-sm font-medium transition-colors duration-150 ${
                  path.startsWith('/dashboard')
                    ? 'text-[#0B6E99] underline underline-offset-4'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                Dashboard
              </Link>
              <Badge variant="emerald" size="sm">
                Staff: {session.userName.split(' ')[0]}
              </Badge>
              <button
                type="button"
                onClick={() => {
                  toggleStaffMode();
                  navigate('/');
                }}
                className="text-xs text-[#64748B] hover:text-[#0F172A] px-2.5 py-1 rounded-[6px] border border-[#E2E8F0] bg-white hover:bg-[#FAF7F2] transition-colors duration-150 cursor-pointer"
                title="Switch to public view"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs sm:text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors duration-150"
              >
                Sign in
              </Link>
              <button
                type="button"
                onClick={() => {
                  toggleStaffMode();
                  navigate('/dashboard');
                }}
                className="bg-[#0F172A] text-white hover:bg-[#1E293B] active:bg-[#020617] px-3.5 py-2 text-xs font-semibold rounded-[6px] transition-colors duration-150 cursor-pointer shadow-2xs"
              >
                Get started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
