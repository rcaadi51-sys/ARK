/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useRouter, Link } from '../router/Router';
import { useHirePulse } from '../context/HirePulseContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input, Select } from '../components/common/Input';

export function RegisterPage() {
  const { navigate } = useRouter();
  const { setSession } = useHirePulse();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Recruiter' | 'Hiring Manager' | 'Candidate'>('Recruiter');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSession({
      isStaff: role !== 'Candidate',
      userEmail: email || 'user@hirepulse.internal',
      userName: name || 'New User',
      role: role === 'Candidate' ? 'Candidate' : (role as any)
    });
    if (role === 'Candidate') {
      navigate('/');
    } else {
      navigate('/dashboard');
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
            Create an account
          </h1>
          <p className="text-xs text-[#64748B]">
            Get started with HirePulse recruitment workflows.
          </p>
        </div>

        <Card padding="lg" className="shadow-2xs space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Jordan Kelly"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Work Email address"
              type="email"
              required
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Select
              label="Primary Role"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              options={[
                { value: 'Recruiter', label: 'Recruiter / Talent Partner' },
                { value: 'Hiring Manager', label: 'Hiring Manager' },
                { value: 'Candidate', label: 'Candidate / Job Seeker' }
              ]}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="Create a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full">
                Register Account
              </Button>
            </div>
          </form>

          <div className="pt-2 border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#0B6E99] font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
