/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface AppPageProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'default' | 'narrow' | 'wide' | 'full';
  className?: string;
}

export function AppPage({
  title,
  subtitle,
  breadcrumbs,
  actions,
  children,
  maxWidth = 'default',
  className = ''
}: AppPageProps) {
  let maxWidthClass = 'max-w-6xl';
  if (maxWidth === 'narrow') maxWidthClass = 'max-w-3xl';
  if (maxWidth === 'wide') maxWidthClass = 'max-w-7xl';
  if (maxWidth === 'full') maxWidthClass = 'max-w-full';

  return (
    <div className={`w-full min-h-[calc(100vh-130px)] py-6 sm:py-8 px-4 sm:px-6 lg:px-8 mx-auto ${maxWidthClass} ${className}`}>
      {/* Breadcrumbs if provided */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-1.5 text-xs text-[#64748B] mb-3">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-[#CBD5E1]">/</span>}
              {crumb.onClick || crumb.href ? (
                <button
                  type="button"
                  onClick={crumb.onClick}
                  className="hover:text-[#0B6E99] transition-colors duration-150 cursor-pointer"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-[#0F172A] font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E2E8F0] mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#0F172A] font-normal tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-[#64748B] font-normal leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Main Page Content */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
