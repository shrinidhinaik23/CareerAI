import re

def check_ats(resume_text: str):
    text = resume_text.lower()

    issues = []
    score = 100

    # basic section checks
    required_sections = [
        "education",
        "skills",
        "project",
        "experience"
    ]

    for section in required_sections:
        if section not in text:
            issues.append(f"Missing important section: {section.title()}")
            score -= 10

    # contact info checks
    if "@" not in resume_text:
        issues.append("Email address not found.")
        score -= 10

    phone_pattern = r"(\+?\d[\d\s-]{8,}\d)"
    if not re.search(phone_pattern, resume_text):
        issues.append("Phone number not found.")
        score -= 10

    # linkedin / github / portfolio checks
    if "linkedin" not in text:
        issues.append("LinkedIn link not found.")
        score -= 5

    if "github" not in text:
        issues.append("GitHub link not found.")
        score -= 5

    # formatting / ATS-friendly checks
    if "|" in resume_text:
        issues.append("Too many special separators like '|'. ATS may parse them poorly.")
        score -= 5

    if "\t" in resume_text:
        issues.append("Tabs detected. Simple spacing is safer for ATS parsing.")
        score -= 5

    # bullet / action wording checks
    action_verbs = [
        "developed", "built", "designed", "implemented", "created",
        "optimized", "engineered", "analyzed", "managed", "improved"
    ]

    found_action_verbs = any(word in text for word in action_verbs)
    if not found_action_verbs:
        issues.append("Use stronger action verbs in projects and experience.")
        score -= 8

    # length check
    words = resume_text.split()
    if len(words) < 150:
        issues.append("Resume content is too short. Add more project, skills, or experience details.")
        score -= 10
    elif len(words) > 1000:
        issues.append("Resume may be too long. Keep it concise and ATS-friendly.")
        score -= 5

    # measurable achievements
    if not re.search(r"\b\d+%|\b\d+\+|\b\d+\b", resume_text):
        issues.append("Add measurable achievements like percentages, counts, or outcomes.")
        score -= 7

    # uppercase heading style not mandatory but useful
    if "technical skills" not in text and "skills" not in text:
        issues.append("Skills section is not clearly labeled.")
        score -= 8

    if score < 0:
        score = 0

    return {
        "ats_score": score,
        "issues": issues
    }