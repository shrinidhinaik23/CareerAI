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

    if keyword in ["c", "c++", "node.js", "next.js", "rest api", "power bi", "machine learning", "android studio"]:
        return keyword in text

    pattern = r"\b" + re.escape(keyword) + r"\b"
    return re.search(pattern, text) is not None

def scan_keywords(resume_text: str, job_description: str):
    resume_text = normalize_text(resume_text)
    job_description = normalize_text(job_description)

    matched_keywords = []
    missing_keywords = []

    # first check known skill keywords
    jd_keywords = []
    for keyword in SKILL_KEYWORDS:
        if keyword_exists(job_description, keyword):
            jd_keywords.append(keyword)

    # if user typed very small JD like "java"
    if not jd_keywords:
        raw_words = [w.strip() for w in job_description.split() if len(w.strip()) > 1]
        jd_keywords = list(dict.fromkeys(raw_words))

    jd_keywords = list(dict.fromkeys(jd_keywords))

    for keyword in jd_keywords:
        if keyword_exists(resume_text, keyword):
            matched_keywords.append(keyword)
        else:
            missing_keywords.append(keyword)

    return {
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords
    }