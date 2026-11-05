/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export function Input({
  label,
  error,
  hint,
  required,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-[#475569]"
        >
          {label}
          {required && <span className="text-[#9F1239] ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full bg-white border border-[#E2E8F0] rounded-[6px] px-3 py-2 text-sm text-[#0F172A] placeholder:text-[#94A3B8] transition-colors duration-150 focus:border-[#0B6E99] focus:outline-none focus:ring-1 focus:ring-[#0B6E99] disabled:bg-[#FAF7F2] disabled:cursor-not-allowed ${
          error ? 'border-[#FECDD3] focus:border-[#9F1239] focus:ring-[#9F1239]' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[#9F1239]">{error}</p>}
      {hint && !error && <p className="text-xs text-[#64748B]">{hint}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export function Textarea({
  label,
  error,
  hint,
  required,
  className = '',
  id,
  rows = 3,
  ...props
}: TextareaProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-[#475569]"
        >
          {label}
          {required && <span className="text-[#9F1239] ml-1">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`w-full bg-white border border-[#E2E8F0] rounded-[6px] px-3 py-2 text-sm text-[#0F172A] placeholder:text-[#94A3B8] transition-colors duration-150 focus:border-[#0B6E99] focus:outline-none focus:ring-1 focus:ring-[#0B6E99] disabled:bg-[#FAF7F2] disabled:cursor-not-allowed ${
          error ? 'border-[#FECDD3] focus:border-[#9F1239] focus:ring-[#9F1239]' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[#9F1239]">{error}</p>}
      {hint && !error && <p className="text-xs text-[#64748B]">{hint}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
}

export function Select({
  label,
  error,
  hint,
  required,
  options,
  className = '',
  id,
  ...props
}: SelectProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-[#475569]"
        >
          {label}
          {required && <span className="text-[#9F1239] ml-1">*</span>}
        </label>
      )}
      <select
        id={inputId}
        className={`w-full bg-white border border-[#E2E8F0] rounded-[6px] px-3 py-2 text-sm text-[#0F172A] transition-colors duration-150 focus:border-[#0B6E99] focus:outline-none focus:ring-1 focus:ring-[#0B6E99] disabled:bg-[#FAF7F2] disabled:cursor-not-allowed ${
          error ? 'border-[#FECDD3] focus:border-[#9F1239] focus:ring-[#9F1239]' : ''
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-[#9F1239]">{error}</p>}
      {hint && !error && <p className="text-xs text-[#64748B]">{hint}</p>}
    </div>
  );
}
