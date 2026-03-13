import re

def check_readability(resume_text: str):
    text = resume_text.strip()

    if not text:
        return {
            "score": 0,
            "suggestions": ["Resume text could not be read properly."]
        }

    clean_text = re.sub(r"\s+", " ", text)
    words = clean_text.split()
    sentences = re.split(r"[.!?]+", clean_text)
    sentences = [s.strip() for s in sentences if s.strip()]

    word_count = len(words)
    sentence_count = len(sentences)

    score = 100
    suggestions = []

    # Too short / too long
    if word_count < 150:
        score -= 20
        suggestions.append("Resume is too short. Add more details about projects, skills, or experience.")
    elif word_count > 900:
        score -= 10
        suggestions.append("Resume is too long. Keep it concise and focused.")

    # Sentence length
    if sentence_count > 0:
        avg_sentence_length = word_count / sentence_count
    else:
        avg_sentence_length = word_count

    if avg_sentence_length > 25:
        score -= 15
        suggestions.append("Some sentences are too long. Use shorter and clearer statements.")
    elif avg_sentence_length < 5:
        score -= 8
        suggestions.append("Content looks fragmented. Use fuller, meaningful bullet points.")

    # Bullet points
    bullet_count = len(re.findall(r"[•\-▪]", text))
    if bullet_count < 3:
        score -= 10
        suggestions.append("Use more bullet points to improve readability.")

    # Common important sections
    lower_text = text.lower()
    sections = ["education", "skills", "project", "experience"]
    missing_sections = [section for section in sections if section not in lower_text]
    if missing_sections:
        score -= 10
        suggestions.append(
            f"Add clearly labeled sections like: {', '.join(missing_sections)}."
        )

    # Excessive special characters
    special_chars = len(re.findall(r"[|{}[\]\\/~`]", text))
    if special_chars > 5:
        score -= 8
        suggestions.append("Too many special characters may reduce ATS readability.")

    # Action verbs
    action_verbs = [
        "developed", "built", "designed", "implemented", "created",
        "optimized", "engineered", "analyzed", "managed", "improved"
    ]
    if not any(verb in lower_text for verb in action_verbs):
        score -= 10
        suggestions.append("Use stronger action verbs in projects and experience.")

    # Numbers / measurable results
    if not re.search(r"\b\d+%|\b\d+\+|\b\d+\b", text):
        score -= 8
        suggestions.append("Add measurable achievements like percentages, counts, or results.")

    # Final cleanup
    if score < 0:
        score = 0

    if not suggestions:
        suggestions = [
            "Your resume is clear and well-structured.",
            "Keep section headings standard and easy to scan.",
            "Maintain concise bullet points and measurable achievements."
        ]

    return {
        "score": score,
        "suggestions": suggestions
    }