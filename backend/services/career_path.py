def suggest_career(skills):
    skills = [skill.lower() for skill in skills]

    roles_data = {
        "Data Analyst": {
            "required": ["python", "sql", "excel", "power bi", "tableau"],
            "growth": ["Senior Data Analyst", "Business Analyst", "Data Scientist"]
        },
        "Data Scientist": {
            "required": ["python", "sql", "machine learning", "statistics", "tableau"],
            "growth": ["Senior Data Scientist", "ML Engineer", "AI Engineer"]
        },
        "Frontend Developer": {
            "required": ["html", "css", "javascript", "react", "git"],
            "growth": ["Senior Frontend Developer", "UI Engineer", "Frontend Architect"]
        },
        "Backend Developer": {
            "required": ["python", "node", "sql", "mongodb", "api"],
            "growth": ["Senior Backend Developer", "System Architect", "Tech Lead"]
        },
        "Full Stack Developer": {
            "required": ["html", "css", "javascript", "react", "node", "mongodb", "api"],
            "growth": ["Senior Full Stack Developer", "Software Architect", "Engineering Manager"]
        },
        "Java Developer": {
            "required": ["java", "sql", "api", "git"],
            "growth": ["Senior Java Developer", "Backend Engineer", "Tech Lead"]
        },
        "Cloud Engineer": {
            "required": ["aws", "docker", "kubernetes", "python", "git"],
            "growth": ["Senior Cloud Engineer", "DevOps Engineer", "Cloud Architect"]
        },
        "DevOps Engineer": {
            "required": ["docker", "kubernetes", "aws", "git", "python"],
            "growth": ["Senior DevOps Engineer", "SRE", "Cloud Architect"]
        },
        "Business Analyst": {
            "required": ["excel", "sql", "power bi", "tableau", "communication"],
            "growth": ["Senior Business Analyst", "Product Analyst", "Product Manager"]
        },
        "HR Executive": {
            "required": ["communication", "excel", "recruitment"],
            "growth": ["Senior HR Executive", "HR Manager", "Talent Acquisition Lead"]
        },
        "Digital Marketer": {
            "required": ["seo", "content marketing", "social media", "excel"],
            "growth": ["Senior Digital Marketer", "Marketing Manager", "Brand Strategist"]
        },
        "Accountant": {
            "required": ["accounting", "excel", "taxation", "tally"],
            "growth": ["Senior Accountant", "Finance Analyst", "Finance Manager"]
        },
        "Pharmacist": {
            "required": ["pharmacology", "drug safety", "patient counseling"],
            "growth": ["Senior Pharmacist", "Clinical Pharmacist", "Medical Advisor"]
        }
    }

    scored_roles = []

    for role, data in roles_data.items():
        required = data["required"]
        matched = [skill for skill in required if skill in skills]
        missing = [skill for skill in required if skill not in skills]
        match_score = round((len(matched) / len(required)) * 100) if required else 0

        scored_roles.append({
            "role": role,
            "match_score": match_score,
            "matched_skills": matched,
            "missing_skills": missing,
            "career_growth": data["growth"]
        })

    scored_roles = sorted(scored_roles, key=lambda x: x["match_score"], reverse=True)

    return {
        "current_skills": skills,
        "recommended_roles": scored_roles[:6]
    }