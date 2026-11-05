/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useRouter } from '../router/Router';
import { useHirePulse } from '../context/HirePulseContext';
import { AppPage } from '../components/common/AppPage';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input, Textarea, Select } from '../components/common/Input';
import {
  PlusIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowLeftIcon,
  AlertCircleIcon
} from '../components/common/Icons';
import { EmploymentType, JobStatus, Question, QuestionKind } from '../types';

export function NewJobPage() {
  const { createJob, loading } = useHirePulse();
  const { navigate } = useRouter();

  // Core fields
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('Remote - US');
  const [salaryRange, setSalaryRange] = useState('$150,000 - $180,000');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full-time');
  const [status, setStatus] = useState<JobStatus>('Open');
  const [description, setDescription] = useState('');
  const [resumeFormats, setResumeFormats] = useState<string[]>(['.pdf', '.docx']);

  // Custom questions
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q-demo-1',
      label: 'Link to your work portfolio or GitHub profile',
      kind: 'text',
      required: true
    },
    {
      id: 'q-demo-2',
      label: 'What makes you particularly excited about this role at HirePulse?',
      kind: 'long_text',
      required: true
    }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Question manipulation
  const addQuestion = () => {
    const newQ: Question = {
      id: `q-${Date.now()}`,
      label: '',
      kind: 'text',
      required: false
    };
    setQuestions((prev) => [...prev, newQ]);
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === questions.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    setQuestions((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[newIndex];
      copy[newIndex] = temp;
      return copy;
    });
  };

  const toggleResumeFormat = (format: string) => {
    setResumeFormats((prev) => {
      if (prev.includes(format)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((f) => f !== format);
      } else {
        return [...prev, format];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Job title is required';
    if (!department.trim()) newErrors.department = 'Department is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!salaryRange.trim()) newErrors.salaryRange = 'Salary range is required';
    if (!description.trim()) newErrors.description = 'Job description is required';

    // Validate that questions have non-empty labels
    questions.forEach((q, idx) => {
      if (!q.label.trim()) {
        newErrors[`q-${q.id}`] = `Question #${idx + 1} needs a question label`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const newJob = await createJob({
        title: title.trim(),
        department: department.trim(),
        location: location.trim(),
        salaryRange: salaryRange.trim(),
        employmentType,
        status,
        description: description.trim(),
        resumeFormats,
        questions,
        responsibilities: [
          'Design and deliver core technical workflows with high autonomy.',
          'Uphold calm engineering practices and clean documentation.',
          'Review team proposals and contribute to architectural RFCs.'
        ],
        requirements: [
          'Proven experience in a relevant technical or product leadership role.',
          'Strong analytical thinking and thoughtful communication style.',
          'Commitment to craftsmanship and enduring system design.'
        ],
        benefits: [
          'Comprehensive health, vision, and wellness coverage.',
          'Generous annual learning stipend.',
          'Flexible asynchronous schedule.'
        ]
      });

      // Navigate to the newly created pipeline
      navigate(`/dashboard/jobs/${newJob.id}`);
    } catch (err) {
      console.error(err);
      setErrors({ form: 'An unexpected error occurred while saving the job posting.' });
    }
  };

  return (
    <AppPage
      title="Create Job Requisition"
      subtitle="Publish a new open role, define compensation bands, and build custom screening questions."
      breadcrumbs={[
        { label: 'Staff Dashboard', onClick: () => navigate('/dashboard') },
        { label: 'New Job Posting' }
      ]}
      actions={
        <Button
          variant="secondary"
          size="sm"
          icon={<ArrowLeftIcon className="w-3.5 h-3.5" />}
          onClick={() => navigate('/dashboard')}
        >
          Cancel
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
        {errors.form && (
          <div className="p-3 rounded-[6px] bg-[#FFF1F2] border border-[#FECDD3] text-xs text-[#9F1239] flex items-start gap-2">
            <AlertCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* Section 1: Core Details */}
        <Card padding="md" className="space-y-4">
          <h2 className="font-serif text-lg text-[#0F172A] font-normal border-b border-[#E2E8F0] pb-2">
            1. Role Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Job Title"
                required
                placeholder="e.g. Senior Distributed Systems Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={errors.title}
              />
            </div>

            <Select
              label="Department"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={[
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Design', label: 'Design' },
                { value: 'Product', label: 'Product' },
                { value: 'Operations', label: 'Operations' },
                { value: 'People', label: 'People & Culture' },
                { value: 'Finance', label: 'Finance' },
                { value: 'Marketing', label: 'Marketing' }
              ]}
              error={errors.department}
            />

            <Input
              label="Location"
              required
              placeholder="e.g. Remote - US or London (Hybrid)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              error={errors.location}
            />

            <Input
              label="Salary Range"
              required
              placeholder="e.g. $170,000 - $210,000"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              error={errors.salaryRange}
            />

            <Select
              label="Employment Type"
              required
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
              options={[
                { value: 'Full-time', label: 'Full-time' },
                { value: 'Part-time', label: 'Part-time' },
                { value: 'Contract', label: 'Contract' },
                { value: 'Internship', label: 'Internship' }
              ]}
            />

            <Select
              label="Initial Posting Status"
              required
              value={status}
              onChange={(e) => setStatus(e.target.value as JobStatus)}
              options={[
                { value: 'Open', label: 'Open (Visible to public candidates)' },
                { value: 'Draft', label: 'Draft (Internal only)' },
                { value: 'Closed', label: 'Closed' }
              ]}
            />
          </div>

          <div className="pt-2">
            <Textarea
              label="Job Description"
              required
              rows={4}
              placeholder="Describe the mission, key responsibilities, and team context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={errors.description}
            />
          </div>

          {/* Allowed Resume Formats */}
          <div className="pt-2 border-t border-[#F1F5F9] space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569]">
              Accepted Resume Formats
            </label>
            <div className="flex items-center gap-4">
              {['.pdf', '.docx', '.txt'].map((fmt) => {
                const isSelected = resumeFormats.includes(fmt);
                return (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => toggleResumeFormat(fmt)}
                    className={`px-3 py-1.5 text-xs font-mono font-medium rounded-[6px] border transition-colors duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-[#EBF5FA] text-[#0B6E99] border-[#BAE6FD]'
                        : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {fmt} {isSelected ? '✓' : ''}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-[#64748B]">
              At least one file extension must remain selected.
            </p>
          </div>
        </Card>

        {/* Section 2: Dynamic Custom Questions Builder */}
        <Card padding="md" className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <div>
              <h2 className="font-serif text-lg text-[#0F172A] font-normal">
                2. Custom Screening Questions ({questions.length})
              </h2>
              <p className="text-xs text-[#64748B]">
                Configure questions asked directly on the candidate application form.
              </p>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={<PlusIcon className="w-3 h-3" />}
              onClick={addQuestion}
            >
              Add Question
            </Button>
          </div>

          {questions.length === 0 ? (
            <p className="text-xs text-[#64748B] py-4 text-center">
              No custom questions configured. Candidates will only submit contact info and their resume.
            </p>
          ) : (
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 bg-[#FAF7F2]/80 border border-[#E2E8F0] rounded-[6px] space-y-3 transition-colors duration-150"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-semibold text-[#64748B] uppercase">
                      Question #{idx + 1}
                    </span>

                    {/* Reorder & Delete controls */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="Move question up"
                        disabled={idx === 0}
                        onClick={() => moveQuestion(idx, 'up')}
                        className="p-1 rounded text-[#64748B] hover:text-[#0F172A] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUpIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Move question down"
                        disabled={idx === questions.length - 1}
                        onClick={() => moveQuestion(idx, 'down')}
                        className="p-1 rounded text-[#64748B] hover:text-[#0F172A] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDownIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete question"
                        onClick={() => removeQuestion(q.id)}
                        className="p-1 rounded text-[#9F1239] hover:bg-[#FFF1F2] cursor-pointer ml-1"
                        title="Delete question"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                    <div className="sm:col-span-7">
                      <Input
                        label="Question Prompt"
                        required
                        placeholder="e.g. Please share a link to your portfolio..."
                        value={q.label}
                        onChange={(e) => updateQuestion(q.id, { label: e.target.value })}
                        error={errors[`q-${q.id}`]}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <Select
                        label="Response Kind"
                        value={q.kind}
                        onChange={(e) =>
                          updateQuestion(q.id, {
                            kind: e.target.value as QuestionKind,
                            options:
                              e.target.value === 'select'
                                ? q.options || ['Option A', 'Option B']
                                : undefined
                          })
                        }
                        options={[
                          { value: 'text', label: 'Short Text' },
                          { value: 'long_text', label: 'Long Text' },
                          { value: 'yes_no', label: 'Yes / No' },
                          { value: 'select', label: 'Single Select' }
                        ]}
                      />
                    </div>

                    <div className="sm:col-span-2 pt-6 flex items-center">
                      <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-[#475569]">
                        <input
                          type="checkbox"
                          checked={q.required}
                          onChange={(e) =>
                            updateQuestion(q.id, { required: e.target.checked })
                          }
                          className="rounded border-[#CBD5E1] text-[#0B6E99] focus:ring-[#0B6E99]"
                        />
                        <span>Required</span>
                      </label>
                    </div>
                  </div>

                  {/* If Kind is Select, allow specifying options */}
                  {q.kind === 'select' && (
                    <div className="pt-2">
                      <Input
                        label="Dropdown Options (comma-separated)"
                        placeholder="e.g. In-office, Hybrid, Remote"
                        value={(q.options || []).join(', ')}
                        onChange={(e) => {
                          const opts = e.target.value
                            .split(',')
                            .map((o) => o.trim())
                            .filter(Boolean);
                          updateQuestion(q.id, { options: opts });
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            Save & Publish Posting
          </Button>
        </div>
      </form>
    </AppPage>
  );
}
