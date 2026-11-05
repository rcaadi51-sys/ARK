/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Stage = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';

export type JobStatus = 'Open' | 'Closed' | 'Draft';

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

export type QuestionKind = 'text' | 'long_text' | 'yes_no' | 'select';

export interface Question {
  id: string;
  label: string;
  kind: QuestionKind;
  required: boolean;
  options?: string[]; // for select type
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  salaryRange: string;
  employmentType: EmploymentType;
  description: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  resumeFormats: string[]; // e.g. ['.pdf', '.docx']
  status: JobStatus;
  questions: Question[];
  createdAt: string;
  postedDateDisplay?: string; // e.g. 'Posted Oct 25'
  minExperience?: number;
  mandatorySkills?: string[];
  minEducation?: string;
}

export interface WorkHistoryItem {
  company: string;
  role: string;
  from: string;
  to: string;
  summary: string;
}

export interface Candidate {
  name: string;
  email: string;
  phone: string;
  headline: string;
  location: string;
  imageUrl?: string;
  skills: string[];
  workHistory: WorkHistoryItem[];
  experienceYears?: number;
  education?: string;
}

export interface QuestionAnswer {
  questionId: string;
  label: string;
  answer: string;
}

export interface AiScreeningResult {
  matchScore: number;
  isSpam: boolean;
  spamReason?: string;
  isEligible: boolean;
  passedCriteria: string[];
  missingCriteria: string[];
  strengths: string;
  concerns: string;
  topMatchingSkills: string[];
  missingSkills: string[];
  processedAt?: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidate: Candidate;
  stage: Stage;
  notes: string;
  answers: QuestionAnswer[];
  resumeName: string;
  appliedAt: string;
  // Screening intelligence
  matchScore?: number;
  isSpam?: boolean;
  spamReason?: string;
  isEligible?: boolean;
  passedCriteria?: string[];
  missingCriteria?: string[];
  aiScreening?: AiScreeningResult;
}

export interface Interview {
  id: string;
  applicationId: string;
  round: string;
  scheduledAt: string; // ISO date string
  interviewer: string;
  location: string;
}

export interface Scorecard {
  id: string;
  applicationId: string;
  reviewer: string;
  technical: number; // 1-5
  culture: number;   // 1-5
  communication: number; // 1-5
  feedback: string;
  submittedAt: string;
}

export interface UserSession {
  isStaff: boolean;
  userEmail: string;
  userName: string;
  role: 'Recruiter' | 'Hiring Manager' | 'Staff Engineer' | 'Candidate';
}
