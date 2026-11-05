"""
Hard Eligibility Filtration Module for HirePulse ATS.
Disqualifies candidates who do not satisfy non-negotiable job requirements.
"""

import re
from typing import List, Dict, Any, Tuple, Optional


EDUCATION_HIERARCHY = {
    "high school": 1,
    "diploma": 2,
    "associate": 3,
    "bachelor": 4,
    "b.tech": 4,
    "btech": 4,
    "b.e": 4,
    "be": 4,
    "b.sc": 4,
    "bsc": 4,
    "master": 5,
    "m.tech": 5,
    "mtech": 5,
    "m.e": 5,
    "m.sc": 5,
    "msc": 5,
    "mba": 5,
    "phd": 6,
    "doctorate": 6
}


def parse_experience_years(resume_text: str, candidate_experience_years: Optional[float] = None) -> float:
    """
    Determines candidate's total years of experience using candidate record or regex heuristics.
    """
    if candidate_experience_years is not None and candidate_experience_years >= 0:
        return float(candidate_experience_years)

    # Heuristic: look for patterns like '5+ years of experience', '7 yrs experience'
    patterns = [
        r"(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience",
        r"experience\s*:\s*(\d+(?:\.\d+)?)\s*(?:years?|yrs?)",
        r"total\s+experience\s*:\s*(\d+(?:\.\d+)?)\s*(?:years?|yrs?)"
    ]
    extracted_years = []
    lower_text = resume_text.lower()
    for p in patterns:
        matches = re.findall(p, lower_text)
        for m in matches:
            try:
                extracted_years.append(float(m))
            except ValueError:
                continue

    if extracted_years:
        return max(extracted_years)

    # Fallback heuristic: calculate span between earliest mentioned year and current year
    years_mentioned = re.findall(r"\b(199\d|20[0-2]\d)\b", resume_text)
    if years_mentioned:
        valid_years = [int(y) for y in years_mentioned if 1995 <= int(y) <= 2026]
        if valid_years:
            earliest = min(valid_years)
            span = max(0, 2026 - earliest)
            # Cap realistic direct experience heuristic
            return min(15.0, float(span))

    return 2.0  # Safe default baseline if not parsed


def parse_education_rank(text: str) -> int:
    """Returns the highest recognized educational degree rank."""
    lower_text = text.lower()
    highest_rank = 0
    for edu_key, rank in EDUCATION_HIERARCHY.items():
        # Match word boundaries for abbreviation or degree title
        pattern = r"\b" + re.escape(edu_key) + r"\b"
        if re.search(pattern, lower_text):
            if rank > highest_rank:
                highest_rank = rank
    return highest_rank


def check_eligibility(
    resume_text: str,
    job_requirements: Dict[str, Any],
    candidate_profile: Optional[Dict[str, Any]] = None
) -> Tuple[bool, List[str], List[str], Dict[str, Any]]:
    """
    Evaluates candidate against mandatory criteria.

    Args:
        resume_text: Extracted resume text.
        job_requirements: Dict containing:
            - min_experience (float / int): Minimum required years of experience.
            - mandatory_skills (List[str]): List of non-negotiable core skills.
            - min_education (str, optional): Required degree level (e.g. 'Bachelor', 'Master').
        candidate_profile: Optional pre-parsed candidate dictionary.

    Returns:
        Tuple: (is_eligible, passed_criteria, missing_criteria, details)
    """
    passed_criteria: List[str] = []
    missing_criteria: List[str] = []
    details: Dict[str, Any] = {}

    lower_resume = resume_text.lower()

    # 1. Experience Check
    min_exp = float(job_requirements.get("min_experience", 0))
    candidate_exp_val = candidate_profile.get("experience_years") if candidate_profile else None
    actual_exp = parse_experience_years(resume_text, candidate_exp_val)
    details["candidate_experience_years"] = actual_exp
    details["required_experience_years"] = min_exp

    if actual_exp >= min_exp:
        passed_criteria.append(f"Experience: {actual_exp:.1f} yrs meets required {min_exp:.1f} yrs")
    else:
        missing_criteria.append(f"Requires at least {min_exp:.1f} yrs experience (found ~{actual_exp:.1f} yrs)")

    # 2. Mandatory Core Skills Check
    mandatory_skills: List[str] = job_requirements.get("mandatory_skills", [])
    found_skills: List[str] = []
    absent_skills: List[str] = []

    for skill in mandatory_skills:
        skill_clean = skill.strip().lower()
        if not skill_clean:
            continue

        # Regex with boundary or symbol handling (e.g., C++, Node.js)
        escaped_skill = re.escape(skill_clean)
        pattern = rf"(?:\b|_){escaped_skill}(?:\b|_)"
        if re.search(pattern, lower_resume) or (skill_clean in lower_resume):
            found_skills.append(skill)
        else:
            absent_skills.append(skill)

    details["found_mandatory_skills"] = found_skills
    details["absent_mandatory_skills"] = absent_skills

    if absent_skills:
        missing_criteria.append(f"Missing mandatory core skills: {', '.join(absent_skills)}")
    else:
        if mandatory_skills:
            passed_criteria.append(f"All mandatory core skills present ({len(found_skills)}/{len(mandatory_skills)})")

    # 3. Education Check
    min_education = job_requirements.get("min_education")
    if min_education:
        req_rank = parse_education_rank(min_education)
        cand_rank = parse_education_rank(lower_resume)
        details["required_education_rank"] = req_rank
        details["candidate_education_rank"] = cand_rank

        if cand_rank >= req_rank or req_rank == 0:
            passed_criteria.append(f"Education requirement met ({min_education})")
        else:
            missing_criteria.append(f"Requires minimum qualification: {min_education}")

    is_eligible = len(missing_criteria) == 0

    return is_eligible, passed_criteria, missing_criteria, details
