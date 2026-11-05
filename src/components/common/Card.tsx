/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export function Card({
  children,
  className = '',
  padding = 'md',
  hoverable = false,
  ...props
}: CardProps) {
  let paddingClass = '';
  switch (padding) {
    case 'none':
      paddingClass = 'p-0';
      break;
    case 'sm':
      paddingClass = 'p-3.5 sm:p-4';
      break;
    case 'md':
      paddingClass = 'p-5 sm:p-6';
      break;
    case 'lg':
      paddingClass = 'p-6 sm:p-8';
      break;
  }

  const hoverClass = hoverable
    ? 'hover:border-[#CBD5E1] transition-all duration-150 cursor-pointer'
    : '';

  return (
    <div
      className={`bg-white border border-[#E2E8F0] rounded-[7px] text-[#0F172A] ${paddingClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
