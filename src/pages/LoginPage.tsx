/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useRouter, Link } from '../router/Router';
import { useHirePulse } from '../context/HirePulseContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export function LoginPage() {
  const { navigate } = useRouter();
  const { setSession } = useHirePulse();

  const [email, setEmail] = useState('jordan.kelly@hirepulse.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<'Recruiter' | 'Hiring Manager' | 'Candidate'>('Recruiter');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSession({
      isStaff: role !== 'Candidate',
      userEmail: email,
      userName: role === 'Candidate' ? 'Guest Candidate' : 'Jordan Kelly',
      role: role === 'Candidate' ? 'Candidate' : (role as any)
    });
    if (role === 'Candidate') {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  };

  const handleQuickDemo = (demoRole: 'Recruiter' | 'Hiring Manager' | 'Candidate') => {
    setRole(demoRole);
    if (demoRole === 'Recruiter') {
      setEmail('jordan.kelly@hirepulse.internal');
    } else if (demoRole === 'Hiring Manager') {
      setEmail('claire.beaumont@hirepulse.internal');
    } else {
      setEmail('applicant@talent.io');
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-1.5">
          <Link href="/" className="inline-block font-serif text-3xl text-[#0F172A] tracking-tight">
            HirePulse
          </Link>
          <h1 className="font-serif text-xl text-[#0F172A] font-normal">
            Sign in to your account
          </h1>
          <p className="text-xs text-[#64748B]">
            Access your talent requisitions, pipelines, and evaluation scorecards.
          </p>
        </div>

        <Card padding="lg" className="shadow-2xs space-y-5">
          {/* Quick Demo Selector */}
          <div className="p-3 bg-[#FAF7F2] border border-[#E2E8F0] rounded-[6px] space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block">
              Quick Demo Persona
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Recruiter', 'Hiring Manager', 'Candidate'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleQuickDemo(r)}
                  className={`text-xs py-1 px-1.5 rounded-[4px] border font-medium transition-colors duration-150 cursor-pointer ${
                    role === r
                      ? 'bg-[#0B6E99] text-white border-[#0B6E99]'
                      : 'bg-white text-[#475569] border-[#E2E8F0] hover:bg-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between text-xs text-[#64748B]">
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-[#CBD5E1] text-[#0B6E99] focus:ring-[#0B6E99]"
                />
                <span>Remember me</span>
              </label>
              <a href="#reset" onClick={(e) => { e.preventDefault(); alert('Demo password reset link sent.'); }} className="text-[#0B6E99] hover:underline">
                Forgot password?
              </a>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Sign In as {role}
            </Button>
          </form>

          <div className="pt-2 border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
            Don't have an account yet?{' '}
            <Link href="/register" className="text-[#0B6E99] font-medium hover:underline">
              Register here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
