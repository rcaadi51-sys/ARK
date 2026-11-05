/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  message,
  icon,
  actionLabel,
  onAction,
  className = ''
}: EmptyStateProps) {
  return (
    <div
      className={`border border-dashed border-[#CBD5E1] rounded-[7px] bg-white/70 p-8 sm:p-12 text-center flex flex-col items-center justify-center ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 rounded-[6px] bg-[#FAF7F2] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] mb-3.5">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-lg text-[#0F172A] mb-1 font-normal">{title}</h3>
      <p className="text-sm text-[#64748B] max-w-sm mx-auto mb-4 leading-relaxed">{message}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
