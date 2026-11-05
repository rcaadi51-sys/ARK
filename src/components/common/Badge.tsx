/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Stage, JobStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'stage' | 'status' | 'neutral' | 'accent' | 'emerald' | 'amber' | 'crimson';
  stage?: Stage;
  status?: JobStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  stage,
  status,
  size = 'sm',
  className = ''
}: BadgeProps) {
  let resolvedClass = 'bg-[#FAF7F2] text-[#0F172A] border-[#E2E8F0]';

  if (stage) {
    switch (stage) {
      case 'Hired':
        resolvedClass = 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'; // emerald
        break;
      case 'Rejected':
        resolvedClass = 'bg-[#FFF1F2] text-[#9F1239] border-[#FECDD3]'; // crimson
        break;
      case 'Applied':
        resolvedClass = 'bg-[#F1F5F9] text-[#334155] border-[#CBD5E1]'; // neutral slate
        break;
      case 'Screening':
      case 'Interview':
      case 'Offer':
        resolvedClass = 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]'; // amber
        break;
    }
  } else if (status) {
    switch (status) {
      case 'Open':
        resolvedClass = 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]';
        break;
      case 'Closed':
        resolvedClass = 'bg-[#FFF1F2] text-[#9F1239] border-[#FECDD3]';
        break;
      case 'Draft':
        resolvedClass = 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]';
        break;
    }
  } else {
    switch (variant) {
      case 'emerald':
        resolvedClass = 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]';
        break;
      case 'crimson':
        resolvedClass = 'bg-[#FFF1F2] text-[#9F1239] border-[#FECDD3]';
        break;
      case 'amber':
        resolvedClass = 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]';
        break;
      case 'accent':
        resolvedClass = 'bg-[#EBF5FA] text-[#0B6E99] border-[#BAE6FD]';
        break;
      default:
        resolvedClass = 'bg-[#FAF7F2] text-[#334155] border-[#E2E8F0]';
        break;
    }
  }

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-[6px] tracking-tight transition-colors duration-150 ${sizeClass} ${resolvedClass} ${className}`}
    >
      {children}
    </span>
  );
}
