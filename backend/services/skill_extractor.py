skills_db = [
    "python","java","sql","machine learning","deep learning",
    "react","node","git","docker","kubernetes","aws"
]

def extract_skills(text):
    text = text.lower()
    found = []

    for skill in skills_db:
        if skill in text:
            found.append(skill)

    return found