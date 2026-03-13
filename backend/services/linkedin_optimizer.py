def optimize_linkedin(resume_text: str, target_role: str = ""):
    text = resume_text.lower()
    role_text = target_role.lower().strip()

    detected_headline = "Software Developer"

    role_map = [
        "full stack developer",
        "frontend developer",
        "backend developer",
        "data analyst",
        "java developer",
        "react developer",
        "software engineer",
        "mobile app developer",
        "cloud engineer",
        "devops engineer"
    ]

    for role in role_map:
        if role in text:
            detected_headline = role.title()
            break

    if role_text:
        detected_headline = role_text.title()

    skill_map = [
        "java", "python", "javascript", "react", "node", "mongodb", "firebase",
        "flutter", "html", "css", "sql", "tailwind", "git", "github",
        "express", "machine learning", "figma", "postman", "aws", "docker",
        "kubernetes", "excel", "power bi", "tableau", "api"
    ]

    found_keywords = []
    for skill in skill_map:
        if skill in text:
            found_keywords.append(skill)

    found_keywords = list(dict.fromkeys(found_keywords))

    summary = (
        f"Results-driven {detected_headline} with hands-on experience in "
        f"{', '.join(found_keywords[:6]) if found_keywords else 'software development and project execution'}. "
        f"Passionate about building impactful solutions, solving real-world problems, "
        f"and continuously improving technical and professional skills."
    )

    headline_versions = [
        f"{detected_headline} | {', '.join(found_keywords[:3])}" if found_keywords else detected_headline,
        f"Aspiring {detected_headline} | Building Real-World Projects",
        f"{detected_headline} | Problem Solver | Tech Enthusiast"
    ]

    role_keywords_map = {
        "data analyst": ["python", "sql", "excel", "power bi", "tableau"],
        "frontend developer": ["html", "css", "javascript", "react", "figma"],
        "backend developer": ["python", "node", "sql", "mongodb", "api"],
        "full stack developer": ["html", "css", "javascript", "react", "node", "mongodb", "api"],
        "java developer": ["java", "sql", "api", "git"],
        "cloud engineer": ["aws", "docker", "kubernetes", "python", "git"],
        "devops engineer": ["docker", "kubernetes", "aws", "git", "python"]
    }

    target_keywords = role_keywords_map.get(role_text, [])
    matched_role_keywords = [k for k in target_keywords if k in found_keywords]
    missing_role_keywords = [k for k in target_keywords if k not in found_keywords]

    linkedin_score = 40

    if detected_headline:
        linkedin_score += 15
    if summary:
        linkedin_score += 15
    if len(found_keywords) >= 5:
        linkedin_score += 15
    elif len(found_keywords) >= 3:
        linkedin_score += 10
    elif len(found_keywords) >= 1:
        linkedin_score += 5

    if len(matched_role_keywords) >= 4:
        linkedin_score += 15
    elif len(matched_role_keywords) >= 2:
        linkedin_score += 10
    elif len(matched_role_keywords) >= 1:
        linkedin_score += 5

    if linkedin_score > 100:
        linkedin_score = 100

    improvement_suggestions = [
        "Add measurable achievements in your About and Experience sections.",
        "Use target-role keywords naturally in headline, summary, and projects.",
        "Add GitHub, portfolio, and featured projects to improve visibility.",
        "Make your headline role-specific instead of generic.",
        "Highlight tools, frameworks, and business impact in project descriptions."
    ]

    return {
        "linkedin_score": linkedin_score,
        "headline": detected_headline,
        "headline_versions": headline_versions,
        "summary": summary,
        "top_keywords": found_keywords[:10],
        "target_role": target_role,
        "matched_role_keywords": matched_role_keywords,
        "missing_role_keywords": missing_role_keywords,
        "improvement_suggestions": improvement_suggestions
    }