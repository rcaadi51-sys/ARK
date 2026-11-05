"""
Spam & Quality Detection Module for Resume Processing.
Validates uploaded resume text before deeper semantic parsing.
"""

import re
import string
from collections import Counter
from typing import Dict, Any, Tuple


# Common English words and resume vocab for character and dictionary ratio heuristics
COMMON_RESUME_VOCAB = {
    "experience", "work", "job", "education", "skills", "projects", "developer",
    "engineer", "manager", "team", "responsibilities", "university", "college",
    "degree", "management", "developed", "designed", "managed", "led", "software",
    "technologies", "system", "data", "summary", "contact", "email", "phone"
}


def detect_spam(resume_text: str) -> Dict[str, Any]:
    """
    Validates resume text for spam, corruption, keyword stuffing, and gibberish.

    Args:
        resume_text: Raw plain text extracted from candidate's resume file.

    Returns:
        Dict containing:
            - is_spam (bool): True if flagged as spam or invalid.
            - reason (str): Human-readable explanation.
            - confidence (float): 0.0 to 1.0 confidence score.
            - details (dict): Detailed diagnostic metrics.
    """
    if not resume_text or not isinstance(resume_text, str):
        return {
            "is_spam": True,
            "reason": "Resume text is empty or corrupted (0 bytes extracted).",
            "confidence": 1.0,
            "details": {"word_count": 0, "gibberish_ratio": 1.0, "max_repetition": 0}
        }

    # 1. Clean and tokenize words
    raw_text = resume_text.strip()
    words = re.findall(r"\b[A-Za-z0-9+#.-]+\b", raw_text)
    word_count = len(words)

    # Check minimum word count (minimum 40 words required for a legitimate resume)
    MIN_WORD_COUNT = 40
    if word_count < MIN_WORD_COUNT:
        return {
            "is_spam": True,
            "reason": f"Insufficient resume content ({word_count} words). Minimum required is {MIN_WORD_COUNT} words.",
            "confidence": 0.95,
            "details": {"word_count": word_count, "threshold": MIN_WORD_COUNT}
        }

    # 2. Check unprintable and non-ASCII character corruption
    printable_chars = set(string.printable)
    unprintable_count = sum(1 for c in raw_text if c not in printable_chars)
    total_chars = max(1, len(raw_text))
    unprintable_ratio = unprintable_count / total_chars

    if unprintable_ratio > 0.15:
        return {
            "is_spam": True,
            "reason": f"File corrupted with high ratio of binary/unprintable characters ({unprintable_ratio:.1%}).",
            "confidence": 0.98,
            "details": {"unprintable_ratio": unprintable_ratio, "word_count": word_count}
        }

    # 3. Check for Gibberish / Non-dictionary character clusters
    # Words with no vowels or excessively long random alphanumeric strings (e.g., 'asdfkjhqwertyzxcv')
    long_no_vowel_words = [
        w for w in words
        if len(w) > 6 and not re.search(r"[aeiouyAEIOUY]", w)
    ]
    if len(long_no_vowel_words) > max(3, word_count * 0.08):
        return {
            "is_spam": True,
            "reason": "High frequency of unpronounceable token sequences or OCR gibberish detected.",
            "confidence": 0.88,
            "details": {
                "gibberish_tokens_sample": long_no_vowel_words[:5],
                "gibberish_count": len(long_no_vowel_words)
            }
        }

    # 4. Keyword stuffing detection
    # Checks if any single token represents an unnatural proportion (> 6% of entire resume)
    # or repeats more than 30 times in an unnatural burst.
    normalized_words = [w.lower() for w in words if len(w) > 2]
    counts = Counter(normalized_words)
    total_norm_words = max(1, len(normalized_words))

    stuffed_keywords = []
    for token, freq in counts.most_common(5):
        # Exclude benign structural words like 'and', 'the', 'for'
        if token in {"the", "and", "for", "with", "that", "from", "have"}:
            continue
        density = freq / total_norm_words
        if freq >= 28 and density >= 0.06:
            stuffed_keywords.append((token, freq, round(density * 100, 1)))

    if stuffed_keywords:
        top_stuffed = stuffed_keywords[0]
        return {
            "is_spam": True,
            "reason": (
                f"Keyword stuffing detected: token '{top_stuffed[0]}' appears {top_stuffed[1]} times "
                f"({top_stuffed[2]}% of entire text density)."
            ),
            "confidence": 0.92,
            "details": {
                "stuffed_keywords": stuffed_keywords,
                "word_count": word_count
            }
        }

    # 5. Passed all quality and spam checks
    return {
        "is_spam": False,
        "reason": "Passed automated spam and document quality screening.",
        "confidence": 0.0,
        "details": {
            "word_count": word_count,
            "unprintable_ratio": round(unprintable_ratio, 4),
            "unique_terms": len(counts)
        }
    }
