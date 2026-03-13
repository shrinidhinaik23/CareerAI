import json

def analyze_skill_gap(user_skills, job_role):

    with open("data/job_skills.json") as f:
        job_data = json.load(f)

    role = job_role.lower()

    if role not in job_data:
        return {"error": "Role not found"}

    required_skills = job_data[role]

    missing = []

    for skill in required_skills:
        if skill not in user_skills:
            missing.append(skill)

    return {
        "required_skills": required_skills,
        "missing_skills": missing
    }