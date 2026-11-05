/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useRouter, Link } from '../router/Router';
import { useHirePulse } from '../context/HirePulseContext';
import { AppPage } from '../components/common/AppPage';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import {
  StarIcon,
  ChevronRightIcon,
  SearchIcon,
  ExternalLinkIcon
} from '../components/common/Icons';
import { Stage } from '../types';

const PIPELINE_COLUMNS: Array<{ stage: Stage; label: string; dotColor: string }> = [
  { stage: 'Applied', label: 'Applied', dotColor: 'bg-[#38BDF8]' },
  { stage: 'Screening', label: 'Screening', dotColor: 'bg-[#F59E0B]' },
  { stage: 'Interview', label: 'Interview', dotColor: 'bg-[#FB923C]' },
  { stage: 'Offer', label: 'Offer', dotColor: 'bg-[#818CF8]' },
  { stage: 'Hired', label: 'Hired', dotColor: 'bg-[#10B981]' },
  { stage: 'Rejected', label: 'Rejected', dotColor: 'bg-[#F43F5E]' }
];

export function KanbanPipelinePage() {
  const { params, navigate } = useRouter();
  const {
    getJobById,
    getApplicationsForJob,
    updateApplicationStage,
    scorecards
  } = useHirePulse();

  const jobId = params.id;
  const job = getJobById(jobId);
  const applications = getApplicationsForJob(jobId);

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'match' | 'date'>('match');
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);
  const [activeDropdownAppId, setActiveDropdownAppId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<Stage | null>(null);

  // Filtered & ranked applications
  const filteredApps = useMemo(() => {
    let list = applications;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.candidate.name.toLowerCase().includes(q) ||
          a.candidate.headline.toLowerCase().includes(q) ||
          a.candidate.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Sort by AI Match Score or Applied Date
    return [...list].sort((a, b) => {
      if (sortBy === 'match') {
        const scoreA = a.matchScore ?? 50;
        const scoreB = b.matchScore ?? 50;
        return scoreB - scoreA;
      } else {
        return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
      }
    });
  }, [applications, search, sortBy]);

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <EmptyState
          title="Job Requisition Not Found"
          message="The job requisition you requested could not be located in HirePulse."
          actionLabel="Back to Dashboard"
          onAction={() => navigate('/dashboard')}
        />
      </div>
    );
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, appId: string) => {
    e.dataTransfer.setData('text/plain', appId);
    setDraggedAppId(appId);
  };

  const handleDragEnd = () => {
    setDraggedAppId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnStage: Stage) => {
    e.preventDefault();
    if (dragOverColumn !== columnStage) {
      setDragOverColumn(columnStage);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetStage: Stage) => {
    e.preventDefault();
    setDragOverColumn(null);
    const appId = e.dataTransfer.getData('text/plain') || draggedAppId;
    if (!appId) return;

    await updateApplicationStage(appId, targetStage);
    setDraggedAppId(null);
  };

  const handleMoveCandidate = async (appId: string, targetStage: Stage) => {
    await updateApplicationStage(appId, targetStage);
    setActiveDropdownAppId(null);
  };

  return (
    <AppPage
      title={job.title}
      subtitle={`Pipeline candidates for ${job.department} · ${job.location} · ${job.salaryRange}`}
      maxWidth="wide"
      breadcrumbs={[
        { label: 'Staff Dashboard', onClick: () => navigate('/dashboard') },
        { label: 'Job Requisitions', onClick: () => navigate('/dashboard') },
        { label: job.title }
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<ExternalLinkIcon className="w-3.5 h-3.5" />}
            onClick={() => navigate(`/jobs/${job.id}`)}
          >
            Public Listing
          </Button>
          <Badge variant="status" status={job.status} size="md">
            {job.status}
          </Badge>
        </div>
      }
    >
      {/* Search & AI Ranking Bar above Kanban */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-white border border-[#E2E8F0] rounded-[7px] p-3 shadow-2xs">
        <div className="w-full sm:w-80 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
            <SearchIcon className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="Search candidates or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E2E8F0] rounded-[6px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0B6E99] focus:ring-1 focus:ring-[#0B6E99]"
          />
        </div>

        {/* AI Ranking Toggle */}
        <div className="flex items-center gap-3 text-xs text-[#64748B]">
          <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 border border-[#E2E8F0] rounded-[6px]">
            <span className="text-[11px] font-semibold text-[#475569] px-1">Rank by:</span>
            <button
              type="button"
              onClick={() => setSortBy('match')}
              className={`px-2 py-0.5 rounded-[4px] font-medium transition-colors cursor-pointer ${
                sortBy === 'match'
                  ? 'bg-[#0F172A] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              AI Match Score
            </button>
            <button
              type="button"
              onClick={() => setSortBy('date')}
              className={`px-2 py-0.5 rounded-[4px] font-medium transition-colors cursor-pointer ${
                sortBy === 'date'
                  ? 'bg-[#0F172A] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Applied Date
            </button>
          </div>

          <span className="font-mono text-[#0F172A] font-medium hidden sm:inline">
            {filteredApps.length} candidates
          </span>
        </div>
      </div>

      {/* Kanban Board Container - Horizontal scroll on phones */}
      <div className="overflow-x-auto pb-6">
        <div className="flex gap-4 min-w-[1200px]">
          {PIPELINE_COLUMNS.map((col) => {
            const colApps = filteredApps.filter((a) => a.stage === col.stage);
            const isHovered = dragOverColumn === col.stage;

            return (
              <div
                key={col.stage}
                onDragOver={(e) => handleDragOver(e, col.stage)}
                onDragLeave={() => setDragOverColumn(null)}
                onDrop={(e) => handleDrop(e, col.stage)}
                className={`flex-1 min-w-[240px] max-w-[280px] bg-[#FAF7F2] rounded-[8px] border transition-colors duration-150 flex flex-col ${
                  isHovered
                    ? 'border-[#0B6E99] bg-[#EBF5FA]/40 ring-1 ring-[#0B6E99]'
                    : 'border-[#E2E8F0]'
                }`}
              >
                {/* Column Header */}
                <div className="p-3 border-b border-[#E2E8F0] bg-white rounded-t-[7px] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                    <h3 className="font-serif text-sm font-medium text-[#0F172A]">
                      {col.label}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-[4px] bg-[#FAF7F2] text-[#64748B] border border-[#E2E8F0]">
                    {colApps.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="p-2.5 flex-1 space-y-2.5 min-h-[350px]">
                  {colApps.length === 0 ? (
                    <div className="h-32 border border-dashed border-[#CBD5E1] rounded-[6px] flex flex-col items-center justify-center p-3 text-center">
                      <p className="text-xs text-[#94A3B8]">No candidates</p>
                      <p className="text-[10px] text-[#CBD5E1] mt-0.5">Drop here to move</p>
                    </div>
                  ) : (
                    colApps.map((app) => {
                      const appScorecards = scorecards.filter(
                        (s) => s.applicationId === app.id
                      );
                      const avgScore =
                        appScorecards.length > 0
                          ? (
                              appScorecards.reduce(
                                (acc, s) =>
                                  acc +
                                  (s.technical + s.culture + s.communication) / 3,
                                0
                              ) / appScorecards.length
                            ).toFixed(1)
                          : null;

                      const isDragging = draggedAppId === app.id;
                      const isDropdownOpen = activeDropdownAppId === app.id;
                      const score = app.matchScore ?? 50;

                      return (
                        <div
                          key={app.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, app.id)}
                          onDragEnd={handleDragEnd}
                          className={`bg-white border rounded-[6px] p-3 shadow-2xs hover:border-[#0B6E99]/60 transition-all duration-150 cursor-grab active:cursor-grabbing relative ${
                            isDragging ? 'opacity-40 border-dashed border-[#0B6E99]' : 'border-[#E2E8F0]'
                          }`}
                        >
                          {/* Card Content */}
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-1.5">
                              <div className="flex items-center gap-2">
                                {app.candidate.imageUrl ? (
                                  <img
                                    src={app.candidate.imageUrl}
                                    alt={app.candidate.name}
                                    className="w-7 h-7 rounded-full object-cover border border-[#E2E8F0] shrink-0"
                                  />
                                ) : (
                                  <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#E2E8F0] flex items-center justify-center text-xs text-[#64748B] font-medium shrink-0">
                                    {app.candidate.name.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <Link
                                    href={`/dashboard/applications/${app.id}`}
                                    className="font-medium text-xs text-[#0F172A] hover:text-[#0B6E99] block leading-tight"
                                  >
                                    {app.candidate.name}
                                  </Link>
                                  <span className="text-[10px] text-[#64748B] block truncate max-w-[120px]">
                                    {app.candidate.headline}
                                  </span>
                                </div>
                              </div>

                              {/* Accessible "Move" Button for Touch/Keyboard */}
                              <div className="relative shrink-0">
                                <button
                                  type="button"
                                  aria-label="Move candidate to another stage"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDropdownAppId(
                                      isDropdownOpen ? null : app.id
                                    );
                                  }}
                                  className="text-[11px] font-semibold text-[#64748B] hover:text-[#0F172A] px-1.5 py-0.5 rounded border border-[#E2E8F0] hover:bg-[#FAF7F2] cursor-pointer"
                                  title="Move to another stage"
                                >
                                  Move
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                  <div
                                    className="absolute right-0 top-6 z-30 w-36 bg-white border border-[#E2E8F0] rounded-[6px] shadow-sm py-1 text-xs"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="px-2 py-1 text-[10px] font-mono uppercase text-[#94A3B8] border-b border-[#F1F5F9]">
                                      Move to:
                                    </div>
                                    {PIPELINE_COLUMNS.map((stageItem) => (
                                      <button
                                        key={stageItem.stage}
                                        type="button"
                                        disabled={stageItem.stage === col.stage}
                                        onClick={() =>
                                          handleMoveCandidate(
                                            app.id,
                                            stageItem.stage
                                          )
                                        }
                                        className={`w-full text-left px-2.5 py-1.5 flex items-center justify-between transition-colors duration-150 ${
                                          stageItem.stage === col.stage
                                            ? 'text-[#94A3B8] cursor-not-allowed bg-[#FAF7F2]'
                                            : 'text-[#0F172A] hover:bg-[#FAF7F2] cursor-pointer'
                                        }`}
                                      >
                                        <span>{stageItem.label}</span>
                                        {stageItem.stage === col.stage && (
                                          <span className="text-[10px] text-[#94A3B8]">
                                            Current
                                          </span>
                                        )}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* AI Match Score Badge & Quality Flag */}
                            <div className="flex items-center gap-1.5 pt-0.5">
                              {app.isSpam ? (
                                <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#FFF1F2] text-[#9F1239] border border-[#FECDD3] rounded-[4px]">
                                  Spam Detected
                                </span>
                              ) : app.isEligible === false ? (
                                <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#FFF1F2] text-[#9F1239] border border-[#FECDD3] rounded-[4px]">
                                  Ineligible
                                </span>
                              ) : (
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-[4px] border ${
                                    score >= 85
                                      ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                                      : score >= 70
                                      ? 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]'
                                      : 'bg-[#F1F5F9] text-[#334155] border-[#CBD5E1]'
                                  }`}
                                >
                                  {score}% AI Match
                                </span>
                              )}
                            </div>

                            {/* Skills Chips */}
                            <div className="flex flex-wrap gap-1 pt-1">
                              {app.candidate.skills.slice(0, 3).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] bg-[#FAF7F2] text-[#475569] border border-[#E2E8F0] px-1.5 py-0.5 rounded-[4px]"
                                >
                                  {skill}
                                </span>
                              ))}
                              {app.candidate.skills.length > 3 && (
                                <span className="text-[10px] text-[#94A3B8] px-1 py-0.5">
                                  +{app.candidate.skills.length - 3}
                                </span>
                              )}
                            </div>

                            {/* Card Footer: Scorecard & Link */}
                            <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
                              {avgScore ? (
                                <span className="inline-flex items-center gap-1 font-medium text-[#92400E]">
                                  <StarIcon className="w-3 h-3 text-[#F59E0B]" filled />
                                  <span>{avgScore} / 5</span>
                                </span>
                              ) : (
                                <span className="text-[10px] text-[#94A3B8]">
                                  {new Date(app.appliedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              )}

                              <Link
                                href={`/dashboard/applications/${app.id}`}
                                className="inline-flex items-center gap-0.5 text-[#0B6E99] hover:underline font-medium"
                              >
                                <span>Profile</span>
                                <ChevronRightIcon className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppPage>
  );
}
