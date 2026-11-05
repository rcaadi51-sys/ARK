/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Job,
  Application,
  Interview,
  Scorecard,
  Stage,
  JobStatus,
  UserSession,
  Candidate,
  QuestionAnswer,
  AiScreeningResult
} from '../types';
import {
  SEED_JOBS,
  SEED_APPLICATIONS,
  SEED_INTERVIEWS,
  SEED_SCORECARDS
} from '../data/seedData';
import { evaluateApplicationScreening } from '../services/screeningService';

interface HirePulseContextType {
  jobs: Job[];
  applications: Application[];
  interviews: Interview[];
  scorecards: Scorecard[];
  session: UserSession;
  loading: boolean;
  createJob: (job: Omit<Job, 'id' | 'createdAt'>) => Promise<Job>;
  updateJobStatus: (id: string, status: JobStatus) => Promise<void>;
  submitApplication: (
    jobId: string,
    candidate: Candidate,
    resumeName: string,
    answers: QuestionAnswer[]
  ) => Promise<Application>;
  updateApplicationStage: (applicationId: string, stage: Stage) => Promise<void>;
  updateApplicationNotes: (applicationId: string, notes: string) => Promise<void>;
  scheduleInterview: (interview: Omit<Interview, 'id'>) => Promise<Interview>;
  addScorecard: (scorecard: Omit<Scorecard, 'id' | 'submittedAt'>) => Promise<Scorecard>;
  runAiScreening: (applicationId: string) => Promise<AiScreeningResult | null>;
  setSession: React.Dispatch<React.SetStateAction<UserSession>>;
  toggleStaffMode: () => void;
  resetToDemoData: () => void;
  getJobById: (id: string) => Job | undefined;
  getApplicationById: (id: string) => Application | undefined;
  getApplicationsForJob: (jobId: string) => Application[];
  getInterviewsForApplication: (appId: string) => Interview[];
  getScorecardsForApplication: (appId: string) => Scorecard[];
}

const HirePulseContext = createContext<HirePulseContextType | null>(null);

const STORAGE_KEY = 'hirepulse_data_v2';

export function HirePulseProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_jobs`);
      return saved ? JSON.parse(saved) : SEED_JOBS;
    } catch {
      return SEED_JOBS;
    }
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_apps`);
      return saved ? JSON.parse(saved) : SEED_APPLICATIONS;
    } catch {
      return SEED_APPLICATIONS;
    }
  });

  const [interviews, setInterviews] = useState<Interview[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_interviews`);
      return saved ? JSON.parse(saved) : SEED_INTERVIEWS;
    } catch {
      return SEED_INTERVIEWS;
    }
  });

  const [scorecards, setScorecards] = useState<Scorecard[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_scorecards`);
      return saved ? JSON.parse(saved) : SEED_SCORECARDS;
    } catch {
      return SEED_SCORECARDS;
    }
  });

  const [session, setSession] = useState<UserSession>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_session`);
      return saved
        ? JSON.parse(saved)
        : {
            isStaff: true,
            userEmail: 'jordan.kelly@hirepulse.internal',
            userName: 'Jordan Kelly',
            role: 'Recruiter'
          };
    } catch {
      return {
        isStaff: true,
        userEmail: 'jordan.kelly@hirepulse.internal',
        userName: 'Jordan Kelly',
        role: 'Recruiter'
      };
    }
  });

  const [loading, setLoading] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_jobs`, JSON.stringify(jobs));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [jobs]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_apps`, JSON.stringify(applications));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_interviews`, JSON.stringify(interviews));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [interviews]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_scorecards`, JSON.stringify(scorecards));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [scorecards]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_session`, JSON.stringify(session));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [session]);

  const toggleStaffMode = () => {
    setSession((prev) => ({
      ...prev,
      isStaff: !prev.isStaff
    }));
  };

  const resetToDemoData = () => {
    setJobs(SEED_JOBS);
    setApplications(SEED_APPLICATIONS);
    setInterviews(SEED_INTERVIEWS);
    setScorecards(SEED_SCORECARDS);
    setSession({
      isStaff: true,
      userEmail: 'jordan.kelly@hirepulse.internal',
      userName: 'Jordan Kelly',
      role: 'Recruiter'
    });
  };

  const getJobById = (id: string) => jobs.find((j) => j.id === id);

  const getApplicationById = (id: string) => applications.find((a) => a.id === id);

  const getApplicationsForJob = (jobId: string) =>
    applications.filter((a) => a.jobId === jobId);

  const getInterviewsForApplication = (appId: string) =>
    interviews.filter((i) => i.applicationId === appId);

  const getScorecardsForApplication = (appId: string) =>
    scorecards.filter((s) => s.applicationId === appId);

  // Fake async methods
  const createJob = async (jobData: Omit<Job, 'id' | 'createdAt'>): Promise<Job> => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 200));
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString(),
      postedDateDisplay: 'Posted Today'
    };
    setJobs((prev) => [newJob, ...prev]);
    setLoading(false);
    return newJob;
  };

  const updateJobStatus = async (id: string, status: JobStatus): Promise<void> => {
    await new Promise((res) => setTimeout(res, 100));
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status } : j))
    );
  };

  const submitApplication = async (
    jobId: string,
    candidate: Candidate,
    resumeName: string,
    answers: QuestionAnswer[]
  ): Promise<Application> => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 350));

    const targetJob = jobs.find((j) => j.id === jobId);

    // Initial basic application
    const rawApp: Application = {
      id: `app-${Date.now()}`,
      jobId,
      candidate,
      stage: 'Applied',
      notes: 'Submitted via careers portal application form.',
      answers,
      resumeName,
      appliedAt: new Date().toISOString()
    };

    // Run AI Resume Screening & Eligibility Engine
    if (targetJob) {
      const screeningResult = evaluateApplicationScreening(rawApp, targetJob);
      rawApp.matchScore = screeningResult.matchScore;
      rawApp.isSpam = screeningResult.isSpam;
      rawApp.isEligible = screeningResult.isEligible;
      rawApp.passedCriteria = screeningResult.passedCriteria;
      rawApp.missingCriteria = screeningResult.missingCriteria;
      rawApp.aiScreening = screeningResult;

      if (screeningResult.isSpam) {
        rawApp.stage = 'Rejected';
        rawApp.notes = `[Failed Spam Check] ${screeningResult.spamReason}`;
      } else if (!screeningResult.isEligible) {
        rawApp.stage = 'Rejected';
        rawApp.notes = `[Ineligible] ${screeningResult.missingCriteria.join('; ')}`;
      } else {
        rawApp.stage = 'Screening';
        rawApp.notes = `[AI Screened - ${screeningResult.matchScore}% Match] ${screeningResult.strengths}`;
      }
    }

    setApplications((prev) => [rawApp, ...prev]);
    setLoading(false);
    return rawApp;
  };

  const runAiScreening = async (applicationId: string): Promise<AiScreeningResult | null> => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 400));

    const app = applications.find((a) => a.id === applicationId);
    if (!app) {
      setLoading(false);
      return null;
    }

    const job = jobs.find((j) => j.id === app.jobId);
    if (!job) {
      setLoading(false);
      return null;
    }

    const result = evaluateApplicationScreening(app, job);

    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === applicationId) {
          return {
            ...a,
            matchScore: result.matchScore,
            isSpam: result.isSpam,
            isEligible: result.isEligible,
            passedCriteria: result.passedCriteria,
            missingCriteria: result.missingCriteria,
            aiScreening: result,
            notes: `${a.notes}\n[AI Screening Re-evaluated: ${result.matchScore}% Match]`
          };
        }
        return a;
      })
    );

    setLoading(false);
    return result;
  };

  const updateApplicationStage = async (applicationId: string, stage: Stage): Promise<void> => {
    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, stage } : a))
    );
  };

  const updateApplicationNotes = async (applicationId: string, notes: string): Promise<void> => {
    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, notes } : a))
    );
  };

  const scheduleInterview = async (
    interviewData: Omit<Interview, 'id'>
  ): Promise<Interview> => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 150));
    const newInterview: Interview = {
      ...interviewData,
      id: `int-${Date.now()}`
    };
    setInterviews((prev) => [...prev, newInterview]);
    setLoading(false);
    return newInterview;
  };

  const addScorecard = async (
    scorecardData: Omit<Scorecard, 'id' | 'submittedAt'>
  ): Promise<Scorecard> => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 150));
    const newScorecard: Scorecard = {
      ...scorecardData,
      id: `sc-${Date.now()}`,
      submittedAt: new Date().toISOString()
    };
    setScorecards((prev) => [...prev, newScorecard]);
    setLoading(false);
    return newScorecard;
  };

  return (
    <HirePulseContext.Provider
      value={{
        jobs,
        applications,
        interviews,
        scorecards,
        session,
        loading,
        createJob,
        updateJobStatus,
        submitApplication,
        updateApplicationStage,
        updateApplicationNotes,
        scheduleInterview,
        addScorecard,
        runAiScreening,
        setSession,
        toggleStaffMode,
        resetToDemoData,
        getJobById,
        getApplicationById,
        getApplicationsForJob,
        getInterviewsForApplication,
        getScorecardsForApplication
      }}
    >
      {children}
    </HirePulseContext.Provider>
  );
}

export function useHirePulse() {
  const context = useContext(HirePulseContext);
  if (!context) {
    throw new Error('useHirePulse must be used within a HirePulseProvider');
  }
  return context;
}
