/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Card } from './Card';

interface StatProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: {
    text: string;
    positive?: boolean;
  };
  className?: string;
}

export function Stat({ label, value, subtext, icon, trend, className = '' }: StatProps) {
  return (
    <Card className={`relative overflow-hidden ${className}`} padding="md">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-[#64748B]">{label}</p>
          <p className="font-serif text-3xl sm:text-4xl text-[#0F172A] tracking-tight font-normal leading-none pt-1">
            {value}
          </p>
        </div>
        {icon && (
          <div className="w-9 h-9 rounded-[6px] bg-[#FAF7F2] border border-[#E2E8F0] flex items-center justify-center text-[#64748B]">
            {icon}
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-3.5 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
          {subtext && <span>{subtext}</span>}
          {trend && (
            <span
              className={`font-medium ${
                trend.positive ? 'text-[#065F46]' : 'text-[#64748B]'
              }`}
            >
              {trend.text}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
