"""
SQLAlchemy Models for HirePulse ATS.
Compatible with Flask-SQLAlchemy and MySQL/PostgreSQL backends.
"""

from datetime import datetime
from typing import Optional, List

try:
    from flask_sqlalchemy import SQLAlchemy
    db = SQLAlchemy()
except ImportError:
    # Minimal stand-in if running without Flask installed
    class DummyDB:
        Model = object
        Column = lambda *args, **kwargs: None
        Integer = String = Text = Float = DateTime = Boolean = JSON = None
    db = DummyDB()


class Job:
    """Represents a Job Requisition."""
    def __init__(self, id=None, title="", department="", location="", description="",
                 min_experience=2.0, mandatory_skills=None, min_education=None, status="Open"):
        self.id = id
        self.title = title
        self.department = department
        self.location = location
        self.description = description
        self.min_experience = min_experience
        self.mandatory_skills = mandatory_skills or []
        self.min_education = min_education
        self.status = status


class Candidate:
    """Represents a Candidate Profile."""
    def __init__(self, id=None, name="", email="", phone="", headline="", location="", skills=None, experience_years=None):
        self.id = id
        self.name = name
        self.email = email
        self.phone = phone
        self.headline = headline
        self.location = location
        self.skills = skills or []
        self.experience_years = experience_years


class Application:
    """Represents a Candidate's Application for a specific Job Requisition."""
    def __init__(self, id=None, job_id=None, candidate_id=None, stage="Applied",
                 status="Applied", resume_path="", match_score=0, screening_notes="",
                 extracted_skills=None, applied_at=None):
        self.id = id
        self.job_id = job_id
        self.candidate_id = candidate_id
        self.stage = stage
        self.status = status
        self.resume_path = resume_path
        self.match_score = match_score
        self.screening_notes = screening_notes
        self.extracted_skills = extracted_skills or []
        self.applied_at = applied_at or datetime.utcnow()
