# chatbot_resume_interactive.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="Airesume Website Feature Chatbot")

# Enable CORS for frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------
# Request model
# -------------------
class Message(BaseModel):
    text: str

# -------------------
# Website Features
# -------------------
website_features = {
    "ats resume checker": "ATS Resume Checker evaluates your resume for Applicant Tracking System compatibility and helps improve screening performance.",
    "job match score": "Job Match Score compares your resume with a target role instantly, highlighting where you match and where skills are missing.",
    "interview questions generator": "This tool generates role-based interview questions and sample answers to help with preparation.",
    "cover letter generator": "Cover Letter Generator creates personalized cover letters in seconds tailored to the job you want.",
    "linkedin profile optimizer": "LinkedIn Profile Optimizer improves your profile strength and recruiter visibility.",
    "resume keyword scanner": "Resume Keyword Scanner finds missing job-specific keywords in your resume.",
    "resume readability checker": "Resume Readability Checker makes your resume clearer and easier to read.",
    "skills gap analyzer": "Skills Gap Analyzer identifies missing skills for your target role based on your resume.",
    "career path analyzer": "Career Path Analyzer explores role progression and next-step career planning.",
    "personalized learning tracker": "The Personalized Learning Tracker helps you track skill progress, set learning goals, and monitor improvements over time.",
}

# -------------------
# Resume-related questions
# -------------------
resume_questions = {
    "quick_start": [
        "How well does my resume match this job description?",
        "What are the top 3 skills I’m missing for this role?",
        "Can you scan my resume for ATS keywords?"
    ],
    "deep_dive": [
        "Which technical tools should I learn first to get hired?",
        "Why is my experience not a 100% match for this position?",
        "Are there soft skills mentioned in the job post that I forgot to include?"
    ],
    "fix_it": [
        "How can I rephrase my current experience to bridge this gap?",
        "What projects can I do to prove I have [Missing Skill]?",
        "Suggest 3 certifications that would make my resume stronger for this role."
    ],
    "reality_check": [
        "Am I qualified for a Senior version of this role, or should I stay Junior?",
        "What are the most 'high-priority' keywords I need to add right now?",
        "If an AI recruiter looks at my resume, what is missing?"
    ]
}

# -------------------
# Role-based interview questions
# -------------------
role_questions = {
    "data analyst": [
        "What is the difference between clustered and non-clustered indexes in SQL?",
        "How do you handle missing data in a dataset?",
        "Explain the difference between inner join, left join, and outer join.",
        "How would you explain a complex analysis to a non-technical stakeholder?",
        "Which data visualization tools have you used and why?"
    ],
    "digital marketing": [
        "What is SEO and why is it important?",
        "Explain the difference between organic and paid traffic.",
        "How do you measure the success of a marketing campaign?",
        "Which social media platforms are most effective for B2B marketing?",
        "What tools do you use for email marketing automation?"
    ],
    "finance": [
        "What are the main financial statements and their purposes?",
        "Explain the difference between cash flow and profit.",
        "How do you evaluate the financial health of a company?",
        "What is working capital and why is it important?",
        "Describe a time you identified a financial risk and mitigated it."
    ],
}

# -------------------
# Role aliases to handle multiple user inputs
# -------------------
role_aliases = {
    "data analyst": ["data analyst", "data analysis", "data analytics"],
    "digital marketing": ["digital marketing", "marketing"],
    "finance": ["finance", "financial", "accounting"],
}

# -------------------
# Helper: Check if question is resume related
# -------------------
def is_resume_question(text: str) -> bool:
    text = text.lower()
    keywords = [
        "resume match",
        "missing skills",
        "ats keywords",
        "gap",
        "certification",
        "projects",
        "senior",
        "junior",
        "high-priority keywords"
    ]
    return any(k in text for k in keywords)

# -------------------
# API Endpoints
# -------------------
@app.get("/")
def root():
    return {"message": "Airesume Website Feature Chatbot is running"}

@app.post("/chat")
def chat(message: Message):
    user_text = message.text.lower()

    # 1. Resume Questions
    if is_resume_question(user_text):
        reply = "Here are some ways you can approach your resume evaluation:\n\n"
        for section, questions in resume_questions.items():
            reply += f"<mark>{section.replace('_',' ').title()} Questions</mark>:\n"
            for q in questions:
                reply += f"- {q}\n"
            reply += "\n"
        reply += "Resource to use: ATS Resume Checker, Job Match Score, Resume Keyword Scanner, Skills Gap Analyzer"
        return {"reply": reply}

    # 2. Role-based Interview Questions
    for role, aliases in role_aliases.items():
        if any(alias in user_text for alias in aliases):
            questions = role_questions.get(role, [])
            reply = f"Here are some {role.title()} interview questions:\n"
            for q in questions:
                reply += f"- {q}\n"
            reply += "\nResource to use: Interview Questions Generator"
            return {"reply": reply}

    # 3. Greetings
    greetings = ["hi", "hello", "hey"]
    if any(word in user_text for word in greetings):
        return {"reply": "Hello! I’m the Airesume assistant. I can answer questions about our website features and resume evaluation."}

    if "how are you" in user_text:
        return {"reply": "I’m just a bot, but I’m ready to help you with Airesume features and resume questions!"}

    # 4. Website Features
    for feature, description in website_features.items():
        if feature in user_text:
            return {"reply": f"{description}\n\nResource to use: {feature.replace('_',' ').title()}"}

    # 5. Generic feature queries
    if any(word in user_text for word in ["feature", "how", "use", "functionality", "help", "tool", "resource"]):
        feature_list = ", ".join([f.title() for f in website_features.keys()])
        return {"reply": f"I can help you understand the following features: {feature_list}."}

    # 6. Fallback
    return {"reply": "Sorry, I only answer questions about Airesume website features, resume evaluation, or role-based interview questions."}

# -------------------
# Run server
# -------------------
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8005, log_level="info")