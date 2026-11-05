/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Application, Job, AiScreeningResult } from '../types';

const COMMON_STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being',
  'below', 'between', 'both', 'but', 'by', 'can', 'cannot', 'could', 'couldn\'t',
  'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
  'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
  'have', 'haven\'t', 'having', 'he', 'her', 'here', 'him', 'his', 'how', 'i',
  'if', 'in', 'into', 'is', 'isn\'t', 'it', 'its', 'itself', 'me', 'more',
  'most', 'must', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once',
  'only', 'or', 'other', 'ought', 'our', 'ours', 'out', 'over', 'own', 'same',
  'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs',
  'them', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to',
  'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'were', 'weren\'t',
  'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'you'
]);

export function detectSpam(text: string): { isSpam: boolean; reason?: string } {
  if (!text || text.trim().length === 0) {
    return { isSpam: true, reason: 'Resume text is empty or corrupted (0 bytes extracted).' };
  }

  const words = text.match(/\b[A-Za-z0-9+#.-]+\b/g) || [];
  const wordCount = words.length;

  // Minimum word count
  if (wordCount < 40) {
    return {
      isSpam: true,
      reason: `Insufficient resume content (${wordCount} words). Minimum required is 40 words.`
    };
  }

  // Keyword stuffing detection
  const normalized = words.map((w) => w.toLowerCase()).filter((w) => w.length > 2);
  const freqMap: Record<string, number> = {};
  for (const w of normalized) {
    if (!COMMON_STOP_WORDS.has(w)) {
      freqMap[w] = (freqMap[w] || 0) + 1;
    }
  }

  for (const [token, count] of Object.entries(freqMap)) {
    const density = count / normalized.length;
    if (count >= 25 && density > 0.07) {
      return {
        isSpam: true,
        reason: `Keyword stuffing detected: token '${token}' repeated ${count} times (${(density * 100).toFixed(1)}% density).`
      };
    }
  }

  return { isSpam: false };
}

export function checkEligibility(
  resumeText: string,
  job: Job,
  candidateExperience?: number
): { isEligible: boolean; passedCriteria: string[]; missingCriteria: string[] } {
  const passedCriteria: string[] = [];
  const missingCriteria: string[] = [];
  const lowerText = resumeText.toLowerCase();

  // 1. Experience check
  const minExp = job.minExperience || 2.0;
  const actualExp = candidateExperience !== undefined ? candidateExperience : 3.5;

  if (actualExp >= minExp) {
    passedCriteria.push(`Experience: ${actualExp} yrs meets required ${minExp} yrs`);
  } else {
    missingCriteria.push(`Requires at least ${minExp} yrs experience (found ${actualExp} yrs)`);
  }

  // 2. Mandatory Core Skills Check
  const mandatory = job.mandatorySkills || [];
  const absent: string[] = [];

  for (const skill of mandatory) {
    const sClean = skill.toLowerCase().trim();
    if (!lowerText.includes(sClean)) {
      absent.push(skill);
    }
  }

  if (absent.length > 0) {
    missingCriteria.push(`Missing mandatory core skills: ${absent.join(', ')}`);
  } else if (mandatory.length > 0) {
    passedCriteria.push(`All mandatory core skills present (${mandatory.length}/${mandatory.length})`);
  }

  // 3. Education Check
  if (job.minEducation) {
    const minEduLower = job.minEducation.toLowerCase();
    if (
      lowerText.includes(minEduLower) ||
      lowerText.includes('bachelor') ||
      lowerText.includes('b.tech') ||
      lowerText.includes('master') ||
      lowerText.includes('m.tech') ||
      lowerText.includes('degree')
    ) {
      passedCriteria.push(`Education qualification verified (${job.minEducation})`);
    } else {
      missingCriteria.push(`Requires minimum degree: ${job.minEducation}`);
    }
  }

  return {
    isEligible: missingCriteria.length === 0,
    passedCriteria,
    missingCriteria
  };
}

export function computeSemanticSimilarity(text1: string, text2: string): number {
  const tokens1 = text1.toLowerCase().split(/\W+/).filter((w) => w.length > 2 && !COMMON_STOP_WORDS.has(w));
  const tokens2 = text2.toLowerCase().split(/\W+/).filter((w) => w.length > 2 && !COMMON_STOP_WORDS.has(w));

  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);

  let intersect = 0;
  for (const w of set1) {
    if (set2.has(w)) intersect++;
  }

  const union = set1.size + set2.size - intersect;
  if (union === 0) return 0.5;
  return Math.min(1.0, (intersect / Math.sqrt(set1.size * set2.size)) * 1.4);
}

export function evaluateApplicationScreening(
  app: Application,
  job: Job
): AiScreeningResult {
  const resumeSynthetic = [
    app.candidate.name,
    app.candidate.headline,
    app.candidate.skills.join(' '),
    app.candidate.workHistory.map((w) => `${w.role} at ${w.company}: ${w.summary}`).join(' '),
    app.answers.map((a) => `${a.label}: ${a.answer}`).join(' ')
  ].join('\n');

  // Step 1: Spam Check
  const spam = detectSpam(resumeSynthetic);
  if (spam.isSpam) {
    return {
      matchScore: 0,
      isSpam: true,
      spamReason: spam.reason,
      isEligible: false,
      passedCriteria: [],
      missingCriteria: ['Failed document quality and anti-spam verification'],
      strengths: 'None (Unverified submission)',
      concerns: spam.reason || 'Document flagged as spam or corrupted',
      topMatchingSkills: [],
      missingSkills: job.mandatorySkills || [],
      processedAt: new Date().toISOString()
    };
  }

  // Step 2: Hard Eligibility Check
  const elig = checkEligibility(resumeSynthetic, job, app.candidate.experienceYears);
  if (!elig.isEligible) {
    return {
      matchScore: 25,
      isSpam: false,
      isEligible: false,
      passedCriteria: elig.passedCriteria,
      missingCriteria: elig.missingCriteria,
      strengths: 'Partially meets general requirements',
      concerns: `Ineligible: ${elig.missingCriteria.join('; ')}`,
      topMatchingSkills: app.candidate.skills.slice(0, 2),
      missingSkills: job.mandatorySkills || [],
      processedAt: new Date().toISOString()
    };
  }

  // Step 3: Matcher & Scoring (0.6 * Skill_Overlap + 0.4 * Semantic_Similarity)
  const jobReqSkills = job.mandatorySkills || app.candidate.skills.slice(0, 4);
  const candidateSkillsLower = new Set(app.candidate.skills.map((s) => s.toLowerCase()));
  const matched: string[] = [];
  const missing: string[] = [];

  for (const s of jobReqSkills) {
    if (candidateSkillsLower.has(s.toLowerCase()) || resumeSynthetic.toLowerCase().includes(s.toLowerCase())) {
      matched.push(s);
    } else {
      missing.push(s);
    }
  }

  const skillOverlap = jobReqSkills.length > 0 ? matched.length / jobReqSkills.length : 0.85;
  const semanticSim = computeSemanticSimilarity(resumeSynthetic, job.description);

  // Blended formula: (0.6 * skillOverlap) + (0.4 * semanticSim)
  const rawScore = (0.6 * skillOverlap + 0.4 * semanticSim) * 100;
  const matchScore = Math.max(30, Math.min(98, Math.round(rawScore)));

  return {
    matchScore,
    isSpam: false,
    isEligible: true,
    passedCriteria: elig.passedCriteria,
    missingCriteria: [],
    strengths: matched.length > 0
      ? `Strong verified command of ${matched.slice(0, 3).join(', ')} with relevant domain history.`
      : 'Demonstrates aligned background and solid professional fundamentals.',
    concerns: missing.length > 0
      ? `Skill gaps noted in: ${missing.slice(0, 2).join(', ')}.`
      : 'No significant technical gaps identified.',
    topMatchingSkills: matched.length > 0 ? matched : app.candidate.skills.slice(0, 4),
    missingSkills: missing,
    processedAt: new Date().toISOString()
  };
}
