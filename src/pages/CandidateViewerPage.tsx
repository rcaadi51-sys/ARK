/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useRouter } from '../router/Router';
import { useHirePulse } from '../context/HirePulseContext';
import { AppPage } from '../components/common/AppPage';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Input, Textarea } from '../components/common/Input';
import { EmptyState } from '../components/common/EmptyState';
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  FileTextIcon,
  DownloadIcon,
  ClockIcon,
  UserIcon,
  CheckIcon,
  XIcon,
  ArrowRightIcon,
  StarIcon,
  AlertCircleIcon
} from '../components/common/Icons';
import { Stage } from '../types';

const STAGE_ORDER: Stage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];

export function CandidateViewerPage() {
  const { params, navigate } = useRouter();
  const {
    getApplicationById,
    getJobById,
    updateApplicationStage,
    updateApplicationNotes,
    getInterviewsForApplication,
    scheduleInterview,
    getScorecardsForApplication,
    addScorecard,
    runAiScreening,
    session,
    loading
  } = useHirePulse();

  const appId = params.id;
  const application = getApplicationById(appId);
  const job = application ? getJobById(application.jobId) : undefined;
  const interviews = application ? getInterviewsForApplication(application.id) : [];
  const scorecards = application ? getScorecardsForApplication(application.id) : [];

  // Local state for notes
  const [notes, setNotes] = useState(application?.notes || '');
  const [notesSaved, setNotesSaved] = useState(false);
  const [screeningRunning, setScreeningRunning] = useState(false);

  // Local state for scheduling interview
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [roundName, setRoundName] = useState('Technical Architecture Pairing');
  const [scheduledAt, setScheduledAt] = useState('2026-11-10T15:00');
  const [interviewer, setInterviewer] = useState(session.userName);
  const [location, setLocation] = useState('Google Meet (meet.google.com/hpr-sync)');

  // Local state for new scorecard
  const [showScorecardForm, setShowScorecardForm] = useState(false);
  const [techRating, setTechRating] = useState(4);
  const [cultureRating, setCultureRating] = useState(4);
  const [commRating, setCommRating] = useState(5);
  const [reviewerName, setReviewerName] = useState(session.userName);
  const [scorecardFeedback, setScorecardFeedback] = useState('');

  // Local state for resume preview modal
  const [showResumeModal, setShowResumeModal] = useState(false);

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <EmptyState
          title="Candidate Profile Not Found"
          message="The application reference does not exist or may have been deleted."
          actionLabel="Back to Dashboard"
          onAction={() => navigate('/dashboard')}
        />
      </div>
    );
  }

  const { candidate } = application;

  // Handle stage change
  const handleStageSelect = async (newStage: Stage) => {
    await updateApplicationStage(application.id, newStage);
  };

  // Advance stage helper
  const handleAdvanceStage = async () => {
    const currentIndex = STAGE_ORDER.indexOf(application.stage);
    if (currentIndex >= 0 && currentIndex < STAGE_ORDER.length - 1) {
      const nextStage = STAGE_ORDER[currentIndex + 1];
      await updateApplicationStage(application.id, nextStage);
    } else if (application.stage === 'Rejected') {
      await updateApplicationStage(application.id, 'Screening');
    }
  };

  // Reject candidate helper
  const handleRejectCandidate = async () => {
    if (window.confirm(`Mark ${candidate.name} as Rejected?`)) {
      await updateApplicationStage(application.id, 'Rejected');
    }
  };

  // Save notes
  const handleSaveNotes = async () => {
    await updateApplicationNotes(application.id, notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  // Trigger automated AI screening
  const handleTriggerScreening = async () => {
    setScreeningRunning(true);
    try {
      await runAiScreening(application.id);
    } finally {
      setScreeningRunning(false);
    }
  };

  // Handle schedule interview
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roundName.trim() || !scheduledAt || !interviewer.trim()) return;

    await scheduleInterview({
      applicationId: application.id,
      round: roundName.trim(),
      scheduledAt: new Date(scheduledAt).toISOString(),
      interviewer: interviewer.trim(),
      location: location.trim() || 'Google Meet'
    });

    setShowScheduleForm(false);
  };

  // Handle scorecard submission
  const handleScorecardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scorecardFeedback.trim()) return;

    await addScorecard({
      applicationId: application.id,
      reviewer: reviewerName.trim() || session.userName,
      technical: techRating,
      culture: cultureRating,
      communication: commRating,
      feedback: scorecardFeedback.trim()
    });

    setScorecardFeedback('');
    setShowScorecardForm(false);
  };

  const ai = application.aiScreening;
  const matchScore = application.matchScore ?? 50;

  return (
    <AppPage
      title={candidate.name}
      subtitle={`${candidate.headline} · Applied for ${job ? job.title : 'Position'} (${new Date(
        application.appliedAt
      ).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})`}
      breadcrumbs={[
        { label: 'Staff Dashboard', onClick: () => navigate('/dashboard') },
        ...(job
          ? [{ label: job.title, onClick: () => navigate(`/dashboard/jobs/${job.id}`) }]
          : []),
        { label: candidate.name }
      ]}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {/* Stage Changer Dropdown */}
          <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] rounded-[6px] px-2 py-1 shadow-2xs">
            <span className="text-xs text-[#64748B] font-medium mr-1">Stage:</span>
            <select
              aria-label="Change candidate stage"
              value={application.stage}
              onChange={(e) => handleStageSelect(e.target.value as Stage)}
              className="text-xs font-semibold text-[#0F172A] bg-transparent focus:outline-none cursor-pointer"
            >
              {(['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'] as Stage[]).map(
                (st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Quick Advance / Reject actions */}
          {application.stage !== 'Hired' && (
            <Button
              variant="primary"
              size="sm"
              icon={<ArrowRightIcon className="w-3.5 h-3.5" />}
              onClick={handleAdvanceStage}
            >
              Advance Stage
            </Button>
          )}

          {application.stage !== 'Rejected' && (
            <Button
              variant="danger"
              size="sm"
              icon={<XIcon className="w-3.5 h-3.5" />}
              onClick={handleRejectCandidate}
            >
              Reject
            </Button>
          )}
        </div>
      }
    >
      {/* Profile Header Card */}
      <Card padding="md" className="mb-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {candidate.imageUrl ? (
              <img
                src={candidate.imageUrl}
                alt={candidate.name}
                className="w-16 h-16 rounded-full object-cover border border-[#E2E8F0] shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E2E8F0] flex items-center justify-center font-serif text-2xl text-[#0F172A] shrink-0">
                {candidate.name.charAt(0)}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-serif text-2xl text-[#0F172A] font-normal">
                  {candidate.name}
                </h2>
                <Badge variant="stage" stage={application.stage} size="md">
                  {application.stage}
                </Badge>
              </div>

              <p className="text-sm text-[#475569]">{candidate.headline}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B] pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <MapPinIcon className="w-3.5 h-3.5 text-[#94A3B8]" />
                  {candidate.location}
                </span>
                <a
                  href={`mailto:${candidate.email}`}
                  className="inline-flex items-center gap-1.5 hover:text-[#0B6E99] transition-colors"
                >
                  <MailIcon className="w-3.5 h-3.5 text-[#94A3B8]" />
                  {candidate.email}
                </a>
                <a
                  href={`tel:${candidate.phone}`}
                  className="inline-flex items-center gap-1.5 hover:text-[#0B6E99] transition-colors"
                >
                  <PhoneIcon className="w-3.5 h-3.5 text-[#94A3B8]" />
                  {candidate.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Resume Download Action */}
          <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 md:border-l border-[#E2E8F0] pt-4 md:pt-0 md:pl-6">
            <Button
              variant="secondary"
              size="sm"
              icon={<FileTextIcon className="w-3.5 h-3.5" />}
              onClick={() => setShowResumeModal(true)}
            >
              View Resume
            </Button>
            <a
              href={`#download-${application.resumeName}`}
              onClick={(e) => {
                e.preventDefault();
                alert(`Downloaded candidate resume: ${application.resumeName}`);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[6px] border border-[#E2E8F0] bg-white hover:bg-[#FAF7F2] text-[#0F172A] transition-colors duration-150"
            >
              <DownloadIcon className="w-3.5 h-3.5 text-[#64748B]" />
              Download
            </a>
          </div>
        </div>

        {/* Skills Chips */}
        <div className="mt-5 pt-4 border-t border-[#F1F5F9] flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mr-2">
            Tagged Skills:
          </span>
          {candidate.skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 text-xs font-medium bg-[#FAF7F2] border border-[#E2E8F0] rounded-[6px] text-[#334155]"
            >
              {skill}
            </span>
          ))}
        </div>
      </Card>

      {/* AI Resume Intelligence & Automated Screening Panel */}
      <Card padding="md" className="mb-8 border-[#0B6E99]/30 bg-[#FAF7F2]/60 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[6px] bg-[#0F172A] text-white flex items-center justify-center font-serif text-lg font-bold">
              {matchScore}%
            </div>
            <div>
              <h3 className="font-serif text-xl text-[#0F172A] font-normal flex items-center gap-2">
                <span>AI Resume Screening & Match Intelligence</span>
                <span className="text-[10px] font-mono uppercase bg-[#EBF5FA] text-[#0B6E99] border border-[#BAE6FD] px-1.5 py-0.5 rounded">
                  v2.0 NLP Engine
                </span>
              </h3>
              <p className="text-xs text-[#64748B]">
                Automated spam verification, non-negotiable eligibility gating, and hybrid semantic scoring.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            loading={screeningRunning || loading}
            onClick={handleTriggerScreening}
          >
            Re-run AI Screening
          </Button>
        </div>

        {/* Screening Results Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* Module A: Spam & Quality Detection */}
          <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-[6px] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                1. Spam & Quality
              </span>
              {application.isSpam ? (
                <span className="text-[10px] font-semibold text-[#9F1239] bg-[#FFF1F2] border border-[#FECDD3] px-1.5 py-0.5 rounded">
                  Failed
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] px-1.5 py-0.5 rounded flex items-center gap-1">
                  <CheckIcon className="w-3 h-3" /> Passed
                </span>
              )}
            </div>
            <p className="text-xs text-[#334155] leading-relaxed">
              {application.isSpam
                ? application.spamReason || 'Flagged as low-quality or keyword-stuffed document.'
                : 'Document meets length requirements (40+ words) with natural token distribution.'}
            </p>
          </div>

          {/* Module B: Hard Eligibility Filtration */}
          <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-[6px] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                2. Eligibility Criteria
              </span>
              {application.isEligible === false ? (
                <span className="text-[10px] font-semibold text-[#9F1239] bg-[#FFF1F2] border border-[#FECDD3] px-1.5 py-0.5 rounded">
                  Ineligible
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] px-1.5 py-0.5 rounded flex items-center gap-1">
                  <CheckIcon className="w-3 h-3" /> Qualified
                </span>
              )}
            </div>
            <div className="text-xs text-[#334155] space-y-1">
              {(application.passedCriteria || ['Meets minimum experience and education requirements']).map(
                (item, idx) => (
                  <p key={idx} className="text-[#065F46] text-[11px] flex items-center gap-1">
                    <CheckIcon className="w-3 h-3 shrink-0" />
                    <span>{item}</span>
                  </p>
                )
              )}
              {application.missingCriteria?.map((item, idx) => (
                <p key={idx} className="text-[#9F1239] text-[11px] flex items-center gap-1">
                  <AlertCircleIcon className="w-3 h-3 shrink-0" />
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Module C: AI Resume Matching & Ranking */}
          <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-[6px] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                3. Hybrid Match Score
              </span>
              <span className="text-xs font-serif font-bold text-[#0B6E99]">
                {matchScore} / 100
              </span>
            </div>
            <p className="text-xs text-[#334155] leading-relaxed">
              {ai?.strengths || 'Candidate exhibits high alignment with core requirements and job description responsibilities.'}
            </p>
            {ai?.topMatchingSkills && ai.topMatchingSkills.length > 0 && (
              <div className="pt-1 flex flex-wrap gap-1">
                {ai.topMatchingSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-[#EBF5FA] text-[#0B6E99] px-1.5 py-0.5 rounded border border-[#BAE6FD]"
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Work History, Custom Questions, Notes (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Work History Timeline */}
          <Card padding="md" className="space-y-4">
            <h3 className="font-serif text-lg text-[#0F172A] font-normal border-b border-[#E2E8F0] pb-2">
              Work History Timeline
            </h3>

            {candidate.workHistory.length === 0 ? (
              <p className="text-xs text-[#64748B]">No previous roles recorded.</p>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#E2E8F0]">
                {candidate.workHistory.map((role, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <span className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-[#0B6E99]" />
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="font-medium text-sm text-[#0F172A]">
                        {role.role} · <span className="text-[#64748B]">{role.company}</span>
                      </h4>
                      <span className="text-xs font-mono text-[#64748B]">
                        {role.from} – {role.to}
                      </span>
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      {role.summary}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Application's Custom Answers */}
          <Card padding="md" className="space-y-4">
            <h3 className="font-serif text-lg text-[#0F172A] font-normal border-b border-[#E2E8F0] pb-2">
              Screening Question Answers
            </h3>

            {application.answers.length === 0 ? (
              <p className="text-xs text-[#64748B]">
                No custom questions were configured for this application.
              </p>
            ) : (
              <div className="space-y-4">
                {application.answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#FAF7F2] border border-[#E2E8F0] rounded-[6px] space-y-1.5"
                  >
                    <p className="text-xs font-semibold text-[#475569]">
                      {ans.label}
                    </p>
                    <p className="text-xs sm:text-sm text-[#0F172A] whitespace-pre-line leading-relaxed">
                      {ans.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Interviewer Notes Textarea */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <h3 className="font-serif text-lg text-[#0F172A] font-normal">
                Internal Hiring Notes
              </h3>
              {notesSaved && (
                <span className="inline-flex items-center gap-1 text-xs text-[#065F46] font-medium">
                  <CheckIcon className="w-3.5 h-3.5" />
                  Notes saved
                </span>
              )}
            </div>

            <Textarea
              rows={4}
              placeholder="Record candidate observations, compensation expectations, or recruiter notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSaveNotes}
                loading={loading}
              >
                Save Notes
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Interview Scheduling & Scorecards (5 Cols) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Interview Scheduling */}
          <Card padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <div>
                <h3 className="font-serif text-lg text-[#0F172A] font-normal">
                  Interview Schedule
                </h3>
                <span className="text-xs text-[#64748B]">
                  {interviews.length} scheduled round{interviews.length === 1 ? '' : 's'}
                </span>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowScheduleForm(!showScheduleForm)}
              >
                {showScheduleForm ? 'Cancel' : 'Schedule Round'}
              </Button>
            </div>

            {/* Schedule Form */}
            {showScheduleForm && (
              <form
                onSubmit={handleScheduleSubmit}
                className="p-4 bg-[#FAF7F2] border border-[#E2E8F0] rounded-[6px] space-y-3"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                  Schedule New Interview
                </h4>

                <Input
                  label="Interview Round"
                  required
                  placeholder="e.g. Technical System Design"
                  value={roundName}
                  onChange={(e) => setRoundName(e.target.value)}
                />

                <Input
                  label="Date & Time"
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />

                <Input
                  label="Interviewer(s)"
                  required
                  placeholder="e.g. Rachel Sterling"
                  value={interviewer}
                  onChange={(e) => setInterviewer(e.target.value)}
                />

                <Input
                  label="Location / Meeting URL"
                  placeholder="e.g. Google Meet link or HQ Room 3B"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />

                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowScheduleForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" loading={loading}>
                    Confirm Schedule
                  </Button>
                </div>
              </form>
            )}

            {/* Scheduled interviews list */}
            {interviews.length === 0 ? (
              <p className="text-xs text-[#64748B] py-2">
                No interviews currently scheduled for {candidate.name}.
              </p>
            ) : (
              <div className="space-y-3">
                {interviews.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white border border-[#E2E8F0] rounded-[6px] space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-medium text-xs text-[#0F172A]">
                        {item.round}
                      </span>
                      <Badge variant="amber" size="sm">
                        {new Date(item.scheduledAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Badge>
                    </div>

                    <div className="text-[11px] text-[#64748B] space-y-1">
                      <div className="flex items-center gap-1.5">
                        <ClockIcon className="w-3.5 h-3.5 text-[#94A3B8]" />
                        <span>
                          {new Date(item.scheduledAt).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <UserIcon className="w-3.5 h-3.5 text-[#94A3B8]" />
                        <span>{item.interviewer}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPinIcon className="w-3.5 h-3.5 text-[#94A3B8]" />
                        <span className="text-[#0B6E99]">{item.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Scorecards */}
          <Card padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <div>
                <h3 className="font-serif text-lg text-[#0F172A] font-normal">
                  Evaluation Scorecards
                </h3>
                <span className="text-xs text-[#64748B]">
                  {scorecards.length} feedback review{scorecards.length === 1 ? '' : 's'}
                </span>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowScorecardForm(!showScorecardForm)}
              >
                {showScorecardForm ? 'Cancel' : 'Add Scorecard'}
              </Button>
            </div>

            {/* Scorecard Submission Form */}
            {showScorecardForm && (
              <form
                onSubmit={handleScorecardSubmit}
                className="p-4 bg-[#FAF7F2] border border-[#E2E8F0] rounded-[6px] space-y-3.5"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                  Submit Evaluation
                </h4>

                <Input
                  label="Reviewer Name"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                />

                {/* Rating 1-5 for Technical, Culture, Communication */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-[#475569]">
                      Technical Competency (1–5)
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setTechRating(star)}
                          className="p-0.5 cursor-pointer text-[#F59E0B]"
                        >
                          <StarIcon
                            className="w-4 h-4"
                            filled={star <= techRating}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-mono ml-1 font-semibold">{techRating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-[#475569]">
                      Culture & Values Fit (1–5)
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setCultureRating(star)}
                          className="p-0.5 cursor-pointer text-[#F59E0B]"
                        >
                          <StarIcon
                            className="w-4 h-4"
                            filled={star <= cultureRating}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-mono ml-1 font-semibold">{cultureRating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-[#475569]">
                      Communication & Clarity (1–5)
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setCommRating(star)}
                          className="p-0.5 cursor-pointer text-[#F59E0B]"
                        >
                          <StarIcon
                            className="w-4 h-4"
                            filled={star <= commRating}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-mono ml-1 font-semibold">{commRating}</span>
                    </div>
                  </div>
                </div>

                <Textarea
                  label="Detailed Feedback & Recommendation"
                  required
                  rows={3}
                  placeholder="Summarize strengths, potential risk areas, and hiring decision rationale..."
                  value={scorecardFeedback}
                  onChange={(e) => setScorecardFeedback(e.target.value)}
                />

                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowScorecardForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" loading={loading}>
                    Submit Scorecard
                  </Button>
                </div>
              </form>
            )}

            {/* List of Previous Scorecards */}
            {scorecards.length === 0 ? (
              <p className="text-xs text-[#64748B] py-2">
                No scorecards submitted yet for this applicant.
              </p>
            ) : (
              <div className="space-y-3">
                {scorecards.map((sc) => {
                  const overall = ((sc.technical + sc.culture + sc.communication) / 3).toFixed(1);
                  return (
                    <div
                      key={sc.id}
                      className="p-3 bg-white border border-[#E2E8F0] rounded-[6px] space-y-2 shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-xs text-[#0F172A]">{sc.reviewer}</p>
                          <span className="text-[10px] text-[#94A3B8]">
                            Submitted {new Date(sc.submittedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] rounded-[4px]">
                          <StarIcon className="w-3 h-3 text-[#F59E0B]" filled />
                          <span>{overall} / 5</span>
                        </span>
                      </div>

                      {/* Score breakdown pills */}
                      <div className="flex flex-wrap gap-2 text-[11px] text-[#475569] bg-[#FAF7F2] p-2 rounded-[4px] border border-[#E2E8F0]">
                        <span>
                          Technical: <strong>{sc.technical}/5</strong>
                        </span>
                        <span>·</span>
                        <span>
                          Culture: <strong>{sc.culture}/5</strong>
                        </span>
                        <span>·</span>
                        <span>
                          Communication: <strong>{sc.communication}/5</strong>
                        </span>
                      </div>

                      <p className="text-xs text-[#334155] leading-relaxed italic">
                        "{sc.feedback}"
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Resume Viewer Modal */}
      {showResumeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4"
          onClick={() => setShowResumeModal(false)}
        >
          <div
            className="bg-white border border-[#E2E8F0] rounded-[8px] max-w-2xl w-full p-6 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2">
                <FileTextIcon className="w-5 h-5 text-[#0B6E99]" />
                <div>
                  <h3 className="font-serif text-lg text-[#0F172A] font-normal">
                    {application.resumeName}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Resume submitted by {candidate.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close resume viewer"
                onClick={() => setShowResumeModal(false)}
                className="text-[#64748B] hover:text-[#0F172A] p-1 rounded cursor-pointer"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Document preview mock */}
            <div className="p-6 bg-[#FAF7F2] border border-[#E2E8F0] rounded-[6px] space-y-4 max-h-[60vh] overflow-y-auto text-xs text-[#334155] font-sans">
              <div className="border-b border-[#E2E8F0] pb-3">
                <h2 className="font-serif text-xl text-[#0F172A]">{candidate.name}</h2>
                <p className="text-[#64748B]">{candidate.headline} · {candidate.location}</p>
                <p className="text-[#64748B]">{candidate.email} · {candidate.phone}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#0F172A] uppercase tracking-wider text-[11px] mb-1">
                  Professional Experience
                </h4>
                {candidate.workHistory.map((w, i) => (
                  <div key={i} className="mb-3 space-y-0.5">
                    <p className="font-semibold text-[#0F172A]">
                      {w.role} – {w.company} ({w.from} - {w.to})
                    </p>
                    <p className="text-[#475569]">{w.summary}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E2E8F0] pt-2">
                <h4 className="font-bold text-[#0F172A] uppercase tracking-wider text-[11px] mb-1">
                  Key Competencies & Tools
                </h4>
                <p className="text-[#475569]">{candidate.skills.join(', ')}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowResumeModal(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<DownloadIcon className="w-3.5 h-3.5" />}
                onClick={() => {
                  alert(`Downloaded ${application.resumeName}`);
                }}
              >
                Download File
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppPage>
  );
}
