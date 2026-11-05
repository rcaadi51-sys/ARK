/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useRouter } from '../router/Router';
import { useHirePulse } from '../context/HirePulseContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Input, Textarea, Select } from '../components/common/Input';
import { EmptyState } from '../components/common/EmptyState';
import {
  MapPinIcon,
  DollarIcon,
  BriefcaseIcon,
  CalendarIcon,
  UploadIcon,
  CheckIcon,
  ArrowLeftIcon,
  AlertCircleIcon
} from '../components/common/Icons';
import { Candidate, QuestionAnswer } from '../types';

export function JobDetailPage() {
  const { params, navigate } = useRouter();
  const { getJobById, submitApplication, loading } = useHirePulse();

  const jobId = params.id;
  const job = getJobById(jobId);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [headline, setHeadline] = useState('');
  const [location, setLocation] = useState('');
  const [skillsStr, setSkillsStr] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <EmptyState
          title="Position Not Found"
          message="The job requisition you are looking for does not exist or may have been unlisted."
          actionLabel="Back to Open Roles"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  // Answer change handler
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
    if (errors[questionId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  };

  // Resume file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check extension
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!job.resumeFormats.includes(ext)) {
      setErrors((prev) => ({
        ...prev,
        resume: `Allowed formats: ${job.resumeFormats.join(', ')}`
      }));
      return;
    }

    setResumeFile(file);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.resume;
      return next;
    });
  };

  // Form validation & submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!resumeFile) newErrors.resume = 'Please attach your resume';

    // Validate job custom questions
    job.questions.forEach((q) => {
      if (q.required && (!answers[q.id] || answers[q.id].trim() === '')) {
        newErrors[q.id] = 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorKey = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Format candidate object
    const skills = skillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const candidateData: Candidate = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      headline: headline.trim() || `${job.title} Applicant`,
      location: location.trim() || 'Remote / Local',
      skills: skills.length > 0 ? skills : ['Communication', 'Problem Solving'],
      workHistory: [
        {
          company: 'Recent Experience',
          role: headline.trim() || 'Professional Experience',
          from: '2023',
          to: 'Present',
          summary: 'Applicant provided recent employment background on application form.'
        }
      ]
    };

    // Format answers
    const formattedAnswers: QuestionAnswer[] = job.questions.map((q) => ({
      questionId: q.id,
      label: q.label,
      answer: answers[q.id] || '(No response provided)'
    }));

    try {
      const app = await submitApplication(
        job.id,
        candidateData,
        resumeFile ? resumeFile.name : 'candidate_resume.pdf',
        formattedAnswers
      );
      setSubmittedAppId(app.id);
    } catch (err) {
      console.error(err);
      setErrors({ form: 'An unexpected error occurred while submitting your application.' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#0F172A] transition-colors duration-150 cursor-pointer"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          Back to all open positions
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Job Description & Details */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <Badge variant="neutral">{job.department}</Badge>
              <Badge variant="accent">{job.employmentType}</Badge>
              <Badge variant="status" status={job.status}>
                {job.status}
              </Badge>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#0F172A] font-normal tracking-tight">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B] mt-4 pt-3 border-t border-[#E2E8F0]">
              <span className="inline-flex items-center gap-1.5">
                <MapPinIcon className="w-3.5 h-3.5 text-[#94A3B8]" />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <DollarIcon className="w-3.5 h-3.5 text-[#94A3B8]" />
                {job.salaryRange}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-[#94A3B8]" />
                Posted {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-6 text-sm text-[#334155] leading-relaxed">
            <div>
              <h2 className="font-serif text-xl text-[#0F172A] mb-2 font-normal">
                About the Role
              </h2>
              <p className="leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            {job.responsibilities && job.responsibilities.length > 0 && (
              <div>
                <h2 className="font-serif text-xl text-[#0F172A] mb-3 font-normal">
                  Responsibilities
                </h2>
                <ul className="space-y-2.5">
                  {job.responsibilities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0B6E99] mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h2 className="font-serif text-xl text-[#0F172A] mb-3 font-normal">
                  Qualifications & Experience
                </h2>
                <ul className="space-y-2.5">
                  {job.requirements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0B6E99] mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <div>
                <h2 className="font-serif text-xl text-[#0F172A] mb-3 font-normal">
                  Benefits & Perks
                </h2>
                <ul className="space-y-2.5">
                  {job.benefits.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#065F46] mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Apply Form or Success State */}
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <Card padding="lg" className="shadow-2xs">
            {submittedAppId ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#065F46] mx-auto">
                  <CheckIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-[#0F172A] font-normal">
                    Application Received
                  </h3>
                  <p className="text-xs font-mono text-[#64748B] mt-1">
                    Reference #{submittedAppId}
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  Thank you for applying for the <strong>{job.title}</strong> role. Our talent team reviews every submission thoughtfully. You will hear back within three business days.
                </p>

                <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => navigate('/')}
                  >
                    Explore other open roles
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      setSubmittedAppId(null);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setResumeFile(null);
                      setAnswers({});
                    }}
                  >
                    Submit another application
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-[#E2E8F0] pb-3.5">
                  <h3 className="font-serif text-xl text-[#0F172A] font-normal">
                    Apply for this position
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1">
                    Please provide your contact details, resume, and answers below.
                  </p>
                </div>

                {errors.form && (
                  <div className="p-3 rounded-[6px] bg-[#FFF1F2] border border-[#FECDD3] text-xs text-[#9F1239] flex items-start gap-2">
                    <AlertCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errors.form}</span>
                  </div>
                )}

                {/* Candidate basic information */}
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    required
                    placeholder="e.g. Elena Vance"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    error={errors.name}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <Input
                      label="Email Address"
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      error={errors.email}
                    />

                    <Input
                      label="Phone Number"
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      error={errors.phone}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <Input
                      label="Headline / Current Title"
                      placeholder="e.g. Senior Designer"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                    />

                    <Input
                      label="Current Location"
                      placeholder="e.g. San Francisco, CA"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  <Input
                    label="Top Skills (comma-separated)"
                    placeholder="e.g. Figma, Design Systems, TypeScript"
                    value={skillsStr}
                    onChange={(e) => setSkillsStr(e.target.value)}
                    hint="Optional keywords to highlight in your candidate profile"
                  />
                </div>

                {/* Resume Upload */}
                <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0]">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569]">
                    Resume / CV <span className="text-[#9F1239]">*</span>
                  </label>

                  <div
                    className={`border border-dashed rounded-[6px] p-4 text-center transition-colors duration-150 ${
                      errors.resume
                        ? 'border-[#FECDD3] bg-[#FFF1F2]/40'
                        : resumeFile
                        ? 'border-[#A7F3D0] bg-[#ECFDF5]/30'
                        : 'border-[#CBD5E1] bg-[#FAF7F2] hover:border-[#0B6E99]'
                    }`}
                  >
                    <input
                      type="file"
                      id="resume"
                      accept={job.resumeFormats.join(',')}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="resume"
                      className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                    >
                      {resumeFile ? (
                        <>
                          <div className="w-8 h-8 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#065F46]">
                            <CheckIcon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-medium text-[#0F172A] truncate max-w-xs">
                            {resumeFile.name}
                          </span>
                          <span className="text-[11px] text-[#0B6E99] underline">
                            Change file
                          </span>
                        </>
                      ) : (
                        <>
                          <UploadIcon className="w-6 h-6 text-[#64748B]" />
                          <span className="text-xs font-medium text-[#0F172A]">
                            Click to upload resume
                          </span>
                          <span className="text-[11px] text-[#64748B]">
                            Formats: {job.resumeFormats.join(', ')} (Max 15MB)
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                  {errors.resume && (
                    <p className="text-xs text-[#9F1239]">{errors.resume}</p>
                  )}
                </div>

                {/* Custom Job Questions */}
                {job.questions.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                      Specific Questions from the Team
                    </h4>

                    {job.questions.map((q) => {
                      const hasErr = !!errors[q.id];

                      if (q.kind === 'text') {
                        return (
                          <Input
                            key={q.id}
                            id={q.id}
                            label={q.label}
                            required={q.required}
                            value={answers[q.id] || ''}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            error={errors[q.id]}
                          />
                        );
                      }

                      if (q.kind === 'long_text') {
                        return (
                          <Textarea
                            key={q.id}
                            id={q.id}
                            label={q.label}
                            required={q.required}
                            rows={3}
                            value={answers[q.id] || ''}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            error={errors[q.id]}
                          />
                        );
                      }

                      if (q.kind === 'yes_no') {
                        return (
                          <div key={q.id} id={q.id} className="space-y-1.5">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569]">
                              {q.label}
                              {q.required && <span className="text-[#9F1239] ml-1">*</span>}
                            </label>
                            <div className="flex items-center gap-3">
                              {['Yes', 'No'].map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => handleAnswerChange(q.id, option)}
                                  className={`px-4 py-1.5 text-xs font-medium rounded-[6px] border transition-colors duration-150 cursor-pointer ${
                                    answers[q.id] === option
                                      ? 'bg-[#0B6E99] text-white border-[#0B6E99]'
                                      : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:bg-[#FAF7F2]'
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                            {hasErr && <p className="text-xs text-[#9F1239]">{errors[q.id]}</p>}
                          </div>
                        );
                      }

                      if (q.kind === 'select' && q.options) {
                        return (
                          <Select
                            key={q.id}
                            id={q.id}
                            label={q.label}
                            required={q.required}
                            value={answers[q.id] || ''}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            options={[
                              { value: '', label: '-- Select an option --' },
                              ...q.options.map((opt) => ({ value: opt, label: opt }))
                            ]}
                            error={errors[q.id]}
                          />
                        );
                      }

                      return null;
                    })}
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    loading={loading}
                  >
                    Submit Application
                  </Button>
                  <p className="text-[11px] text-[#64748B] text-center mt-2.5">
                    By submitting, you agree to HirePulse’s privacy notice for applicants.
                  </p>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
