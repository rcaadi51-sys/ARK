/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState } from 'react';
import { useHirePulse } from '../context/HirePulseContext';
import { useRouter, Link } from '../router/Router';
import { AppPage } from '../components/common/AppPage';
import { Stat } from '../components/common/Stat';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import {
  BriefcaseIcon,
  UserIcon,
  CalendarIcon,
  CheckIcon,
  PlusIcon,
  KanbanIcon,
  MapPinIcon,
  ChevronRightIcon
} from '../components/common/Icons';

export function DashboardPage() {
  const { jobs, applications, interviews, session } = useHirePulse();
  const { navigate } = useRouter();

  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'Closed' | 'Draft'>('All');

  // Stats calculation
  const openRolesCount = useMemo(() => jobs.filter((j) => j.status === 'Open').length, [jobs]);
  const totalApplicants = useMemo(() => applications.length, [applications]);
  const interviewsCount = useMemo(() => interviews.length, [interviews]);
  const hiresCount = useMemo(
    () => applications.filter((a) => a.stage === 'Hired').length,
    [applications]
  );

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    if (statusFilter === 'All') return jobs;
    return jobs.filter((j) => j.status === statusFilter);
  }, [jobs, statusFilter]);

  // Upcoming interviews with joined application and candidate data
  const upcomingInterviews = useMemo(() => {
    return interviews.map((item) => {
      const app = applications.find((a) => a.id === item.applicationId);
      const job = app ? jobs.find((j) => j.id === app.jobId) : undefined;
      return {
        ...item,
        application: app,
        job
      };
    });
  }, [interviews, applications, jobs]);

  return (
    <AppPage
      title="Staff Dashboard"
      subtitle={`Welcome back, ${session.userName}. Here is an overview of active talent pipelines, candidate velocity, and interview schedules.`}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/')}
            className="hidden sm:inline-flex"
          >
            Public Careers
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<PlusIcon className="w-3.5 h-3.5" />}
            onClick={() => navigate('/dashboard/jobs/new')}
          >
            Post a job
          </Button>
        </div>
      }
    >
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat
          label="Open Roles"
          value={openRolesCount}
          subtext="Active listings"
          icon={<BriefcaseIcon className="w-4 h-4 text-[#0B6E99]" />}
        />
        <Stat
          label="Total Applicants"
          value={totalApplicants}
          subtext="Across all requisitions"
          icon={<UserIcon className="w-4 h-4 text-[#0B6E99]" />}
          trend={{ text: '+12% this month', positive: true }}
        />
        <Stat
          label="Interviews Scheduled"
          value={interviewsCount}
          subtext="Active interview rounds"
          icon={<CalendarIcon className="w-4 h-4 text-[#92400E]" />}
        />
        <Stat
          label="Hires Closed"
          value={hiresCount}
          subtext="Signed offers"
          icon={<CheckIcon className="w-4 h-4 text-[#065F46]" />}
          trend={{ text: 'Quarterly target: 5', positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Requisitions Table (8 Cols on desktop) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-[#E2E8F0]">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#0F172A] font-normal">
                Job Requisitions
              </h2>
              <p className="text-xs text-[#64748B]">
                Track requisitions, departments, applicant count, and jump into the Kanban pipeline.
              </p>
            </div>

            {/* Status Filter tabs */}
            <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 border border-[#E2E8F0] rounded-[6px] text-xs">
              {(['All', 'Open', 'Closed', 'Draft'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-2.5 py-1 rounded-[4px] font-medium transition-colors duration-150 cursor-pointer ${
                    statusFilter === tab
                      ? 'bg-white text-[#0F172A] shadow-2xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <EmptyState
              title="No Requisitions Found"
              message="No job postings match the selected status filter."
              actionLabel="Create new posting"
              onAction={() => navigate('/dashboard/jobs/new')}
            />
          ) : (
            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#FAF7F2]/60 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                      <th className="py-3 px-4">Role Title</th>
                      <th className="py-3 px-3 hidden sm:table-cell">Department</th>
                      <th className="py-3 px-3 hidden sm:table-cell">Location</th>
                      <th className="py-3 px-3 text-center sm:text-left">Status</th>
                      <th className="py-3 px-3 text-right">Applicants</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-sm text-[#0F172A]">
                    {filteredJobs.map((job) => {
                      const jobApps = applications.filter((a) => a.jobId === job.id);
                      return (
                        <tr
                          key={job.id}
                          className="hover:bg-[#FAF7F2]/70 transition-colors duration-150 group"
                        >
                          {/* Main Cell */}
                          <td className="py-3.5 px-4">
                            <Link
                              href={`/dashboard/jobs/${job.id}`}
                              className="font-medium text-[#0F172A] hover:text-[#0B6E99] transition-colors duration-150 block"
                            >
                              {job.title}
                            </Link>
                            {/* Short summary on mobile */}
                            <span className="sm:hidden text-xs text-[#64748B] block mt-0.5">
                              {job.department} · {job.location.split(',')[0]}
                            </span>
                          </td>

                          {/* Department (hidden on phones) */}
                          <td className="py-3.5 px-3 hidden sm:table-cell text-xs text-[#64748B]">
                            {job.department}
                          </td>

                          {/* Location (hidden on phones) */}
                          <td className="py-3.5 px-3 hidden sm:table-cell text-xs text-[#64748B]">
                            {job.location}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-3 text-center sm:text-left">
                            <Badge variant="status" status={job.status} size="sm">
                              {job.status}
                            </Badge>
                          </td>

                          {/* Applicants & AI Screening */}
                          <td className="py-3.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {jobApps.length > 0 && (
                                <span className="hidden sm:inline-block text-[10px] font-semibold text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] px-1.5 py-0.5 rounded-[4px]">
                                  {Math.max(...jobApps.map((a) => a.matchScore ?? 75))}% Top Match
                                </span>
                              )}
                              <span className="px-2 py-0.5 bg-[#F1F5F9] rounded-[4px] border border-[#E2E8F0] font-mono text-xs font-medium">
                                {jobApps.length}
                              </span>
                            </div>
                          </td>

                          {/* Action */}
                          <td className="py-3.5 px-4 text-right">
                            <Link
                              href={`/dashboard/jobs/${job.id}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B6E99] hover:underline"
                            >
                              <KanbanIcon className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Pipeline</span>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        {/* Upcoming Interviews Sidebar (4 Cols on desktop) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="pb-2 border-b border-[#E2E8F0]">
            <h2 className="font-serif text-xl sm:text-2xl text-[#0F172A] font-normal">
              Upcoming Interviews
            </h2>
            <p className="text-xs text-[#64748B]">
              Scheduled rounds across the hiring team.
            </p>
          </div>

          {upcomingInterviews.length === 0 ? (
            <EmptyState
              title="No Interviews Scheduled"
              message="No upcoming interviews are on the calendar right now."
              icon={<CalendarIcon className="w-5 h-5" />}
            />
          ) : (
            <div className="space-y-3">
              {upcomingInterviews.map((item) => (
                <Card
                  key={item.id}
                  padding="sm"
                  className="hover:border-[#CBD5E1] transition-colors duration-150"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {item.application ? (
                          <Link
                            href={`/dashboard/applications/${item.application.id}`}
                            className="font-medium text-xs sm:text-sm text-[#0F172A] hover:text-[#0B6E99] transition-colors duration-150 block"
                          >
                            {item.application.candidate.name}
                          </Link>
                        ) : (
                          <span className="font-medium text-xs text-[#0F172A]">Candidate</span>
                        )}
                        <span className="text-[11px] text-[#0B6E99] font-medium block">
                          {item.round}
                        </span>
                      </div>

                      <Badge variant="amber" size="sm">
                        {new Date(item.scheduledAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Badge>
                    </div>

                    <div className="text-[11px] text-[#64748B] space-y-1 pt-1.5 border-t border-[#F1F5F9]">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 shrink-0 text-[#94A3B8]" />
                        <span>
                          {new Date(item.scheduledAt).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            timeZoneName: 'short'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <UserIcon className="w-3.5 h-3.5 shrink-0 text-[#94A3B8]" />
                        <span className="truncate">{item.interviewer}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <MapPinIcon className="w-3.5 h-3.5 shrink-0 text-[#94A3B8]" />
                        <span className="truncate text-[#0B6E99]">{item.location}</span>
                      </div>
                    </div>

                    {item.application && (
                      <div className="pt-1 flex justify-end">
                        <Link
                          href={`/dashboard/applications/${item.application.id}`}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0B6E99] hover:underline"
                        >
                          View Candidate
                          <ChevronRightIcon className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppPage>
  );
}
