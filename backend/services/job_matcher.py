import re

SKILL_KEYWORDS = [
    "java", "python", "javascript", "react", "node", "node.js", "express",
    "mongodb", "sql", "mysql", "postgresql", "firebase", "html", "css",
    "tailwind", "bootstrap", "git", "github", "api", "rest api",
    "machine learning", "docker", "aws", "azure", "kubernetes",
    "excel", "power bi", "tableau", "figma", "postman", "android studio",
    "c", "c++", "dart", "flutter", "next.js", "nextjs"
]

def normalize_text(text: str) -> str:
    text = text.lower()
    text = text.replace("\n", " ")
    text = re.sub(r"[^a-z0-9+#.\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def keyword_exists(text: str, keyword: str) -> bool:
    keyword = keyword.lower().strip()

    special_terms = [
        "c", "c++", "node.js", "next.js", "rest api",
        "power bi", "machine learning", "android studio"
    ]

    if keyword in special_terms:
        return keyword in text

    pattern = r"\b" + re.escape(keyword) + r"\b"
    return re.search(pattern, text) is not None

def extract_jd_keywords(job_description: str):
    jd_text = normalize_text(job_description)
    keywords = []

    for keyword in SKILL_KEYWORDS:
        if keyword_exists(jd_text, keyword):
            keywords.append(keyword)

    if not keywords:
        raw_words = [w.strip() for w in jd_text.split() if len(w.strip()) > 1]
        keywords = list(dict.fromkeys(raw_words))

    return list(dict.fromkeys(keywords))

def job_match_score(resume_text: str, job_description: str):
    resume_text = normalize_text(resume_text)
    jd_keywords = extract_jd_keywords(job_description)

    if not jd_keywords:
        return 0

    matched = 0
    for keyword in jd_keywords:
        if keyword_exists(resume_text, keyword):
            matched += 1

    score = round((matched / len(jd_keywords)) * 100)
    return score