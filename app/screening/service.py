"""
Core Resume Intelligence & Automated Screening Service for HirePulse Flask ATS.
Coordinates Spam Detection, Eligibility Filtration, and AI Matching.
"""

import json
from datetime import datetime
from typing import Dict, Any, Optional

from .spam_detector import detect_spam
from .eligibility_filter import check_eligibility
from .matcher import extract_text_from_file, calculate_match_score


def process_application_screening(
    application_id: int,
    db_session: Optional[Any] = None,
    mock_data: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Executes end-to-end automated screening pipeline:
    1. Fetch Application, Candidate, and Job records from the database.
    2. Extract text from the saved resume file path.
    3. Run Spam Detection -> if spam, update status to 'Rejected' and exit.
    4. Run Eligibility Filtration -> if ineligible, update status to 'Rejected' (or 'Ineligible') and exit.
    5. Run AI Resume Matching -> compute match_score (0 - 100).
    6. Update Application in MySQL:
       - match_score = score
       - status = 'Screening' (or 'Review')
       - Save extracted skills and screening breakdown notes.
    7. Commit transaction and return screening summary dict.
    """
    summary: Dict[str, Any] = {
        "application_id": application_id,
        "processed_at": datetime.utcnow().isoformat(),
        "status": "Pending",
        "match_score": 0,
        "is_spam": False,
        "is_eligible": False,
        "screening_notes": ""
    }

    # 1. Fetch records from DB session or mock_data fallback
    app_record = None
    candidate_record = None
    job_record = None

    if db_session:
        try:
            # Typical Flask-SQLAlchemy query
            from .models import Application, Candidate, Job
            app_record = db_session.query(Application).get(application_id)
            if app_record:
                candidate_record = db_session.query(Candidate).get(app_record.candidate_id)
                job_record = db_session.query(Job).get(app_record.job_id)
        except Exception as e:
            print(f"Warning: db_session query error: {e}")

    # Fallback to provided mock data if db_session is None or test environment
    if not app_record and mock_data:
        app_record = mock_data.get("application")
        candidate_record = mock_data.get("candidate")
        job_record = mock_data.get("job")

    if not app_record:
        summary["status"] = "Error"
        summary["screening_notes"] = f"Application record with ID {application_id} not found."
        return summary

    # 2. Extract text from resume file
    resume_path = getattr(app_record, "resume_path", "")
    resume_text = ""
    if resume_path:
        resume_text = extract_text_from_file(resume_path)

    # If file content empty, fallback to candidate profile summary or raw text if provided
    if not resume_text:
        resume_text = getattr(candidate_record, "headline", "") + "\n" + " ".join(getattr(candidate_record, "skills", []))

    # 3. Step A: Spam & Quality Detection
    spam_result = detect_spam(resume_text)
    summary["is_spam"] = spam_result["is_spam"]
    summary["spam_details"] = spam_result

    if spam_result["is_spam"]:
        notes = f"[Failed Spam Check] {spam_result['reason']}"
        setattr(app_record, "status", "Rejected")
        setattr(app_record, "stage", "Rejected")
        setattr(app_record, "screening_notes", notes)
        setattr(app_record, "match_score", 0)

        if db_session:
            db_session.commit()

        summary["status"] = "Rejected"
        summary["screening_notes"] = notes
        return summary

    # 4. Step B: Hard Eligibility Filtration
    job_reqs = {
        "min_experience": getattr(job_record, "min_experience", 2.0) if job_record else 2.0,
        "mandatory_skills": getattr(job_record, "mandatory_skills", []) if job_record else [],
        "min_education": getattr(job_record, "min_education", None) if job_record else None
    }
    cand_profile = {
        "experience_years": getattr(candidate_record, "experience_years", None) if candidate_record else None
    }

    is_eligible, passed_criteria, missing_criteria, elig_details = check_eligibility(
        resume_text, job_reqs, cand_profile
    )
    summary["is_eligible"] = is_eligible
    summary["eligibility_details"] = elig_details

    if not is_eligible:
        missing_str = "; ".join(missing_criteria)
        notes = f"[Ineligible] Did not meet minimum criteria: {missing_str}"
        setattr(app_record, "status", "Rejected")
        setattr(app_record, "stage", "Rejected")
        setattr(app_record, "screening_notes", notes)
        setattr(app_record, "match_score", 20)  # Baseline low score for tracking

        if db_session:
            db_session.commit()

        summary["status"] = "Rejected"
        summary["screening_notes"] = notes
        summary["match_score"] = 20
        return summary

    # 5. Step C: AI Resume Matching & Scoring
    candidate_skills = getattr(candidate_record, "skills", []) if candidate_record else []
    job_skills = getattr(job_record, "mandatory_skills", []) if job_record else []
    job_desc = getattr(job_record, "description", "") if job_record else ""

    matching_result = calculate_match_score(
        resume_text=resume_text,
        job_description=job_desc,
        candidate_skills=candidate_skills,
        job_skills=job_skills
    )

    score = matching_result["match_score"]
    summary["match_score"] = score
    summary["matching_details"] = matching_result

    # 6. Step D: Update Application record in MySQL
    passed_str = "; ".join(passed_criteria)
    notes = (
        f"[Passed Screening - Match Score: {score}%]\n"
        f"Strengths: {matching_result['strengths']}\n"
        f"Passed Requirements: {passed_str}"
    )

    setattr(app_record, "match_score", score)
    setattr(app_record, "status", "Screening")
    setattr(app_record, "stage", "Screening")
    setattr(app_record, "screening_notes", notes)
    setattr(app_record, "extracted_skills", matching_result["top_matching_skills"])

    if db_session:
        db_session.commit()

    summary["status"] = "Screening"
    summary["screening_notes"] = notes
    return summary
