/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  let baseVariant = '';
  switch (variant) {
    case 'primary':
      baseVariant =
        'bg-[#0B6E99] text-white hover:bg-[#085475] active:bg-[#074763] border border-transparent shadow-xs';
      break;
    case 'secondary':
      baseVariant =
        'bg-white text-[#0F172A] border border-[#E2E8F0] hover:bg-[#FAF7F2] active:bg-[#F1ECE1] shadow-xs';
      break;
    case 'danger':
      baseVariant =
        'bg-[#FFF1F2] text-[#9F1239] border border-[#FECDD3] hover:bg-[#FFE4E6] active:bg-[#FDD0D8]';
      break;
    case 'ghost':
      baseVariant =
        'bg-transparent text-[#0F172A] hover:bg-[#FAF7F2] active:bg-[#F1ECE1] border border-transparent';
      break;
  }

  let sizeClasses = '';
  switch (size) {
    case 'sm':
      sizeClasses = 'text-xs px-2.5 py-1.5 gap-1.5 rounded-[6px]';
      break;
    case 'md':
      sizeClasses = 'text-sm px-3.5 py-2 gap-2 rounded-[6px]';
      break;
    case 'lg':
      sizeClasses = 'text-base px-5 py-2.5 gap-2.5 rounded-[7px]';
      break;
  }

  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${baseVariant} ${sizeClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : (
        icon && <span className="inline-flex shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
}
