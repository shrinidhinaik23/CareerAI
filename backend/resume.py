from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import re
import hmac
import hashlib
import razorpay
import firebase_admin
from firebase_admin import credentials, firestore

from services.resume_parser import extract_text_from_pdf
from services.skill_extractor import extract_skills
from services.ats_checker import check_ats
from services.job_matcher import job_match_score
from services.keyword_scanner import scan_keywords
from services.readability_checker import check_readability
from services.skills_gap import analyze_skill_gap
from services.career_path import suggest_career
from services.interview_generator import generate_questions
from services.cover_letter import generate_cover_letter
from services.linkedin_optimizer import optimize_linkedin
from services.learning_resources import get_learning_resources
from services.youtube_helper import get_youtube_playlist_count

# =========================
# LOAD ENV
# =========================
load_dotenv()

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
    raise RuntimeError("Razorpay keys are missing in backend/.env")

# =========================
# FIREBASE
# =========================
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase-service-account.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

# =========================
# RAZORPAY CLIENT
# =========================
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# =========================
# FASTAPI APP
# =========================
app = FastAPI()

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# REQUEST MODELS
# =========================
class OrderRequest(BaseModel):
    plan: str
    userId: str
    email: str

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    userId: str
    email: str
    plan: str

class InterviewRequest(BaseModel):
    role: str

# =========================
# HOME
# =========================
@app.get("/")
def home():
    return {"message": "Resume AI Backend Running"}

# =========================
# CREATE RAZORPAY ORDER
# =========================
@app.post("/create-order")
def create_order(payload: OrderRequest):
    try:
        if payload.plan == "pro":
            amount = 49900
        elif payload.plan == "career_plus":
            amount = 99900
        else:
            raise HTTPException(status_code=400, detail="Invalid plan")

        order_data = {
            "amount": amount,
            "currency": "INR",
            "receipt": f"receipt_{payload.userId}",
            "notes": {
                "userId": payload.userId,
                "email": payload.email,
                "plan": payload.plan
            }
        }

        order = razorpay_client.order.create(data=order_data)

        return {
            "orderId": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "key": RAZORPAY_KEY_ID
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =========================
# VERIFY PAYMENT
# =========================
@app.post("/verify-payment")
def verify_payment(payload: VerifyPaymentRequest):
    try:
        body = f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}"

        generated_signature = hmac.new(
            bytes(RAZORPAY_KEY_SECRET, "utf-8"),
            bytes(body, "utf-8"),
            hashlib.sha256
        ).hexdigest()

        if generated_signature != payload.razorpay_signature:
            raise HTTPException(status_code=400, detail="Payment verification failed")

        db.collection("users").document(payload.userId).set(
            {
                "email": payload.email,
                "plan": payload.plan,
                "updatedAt": firestore.SERVER_TIMESTAMP
            },
            merge=True
        )

        return {
            "success": True,
            "message": "Payment verified and plan updated"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =========================
# YOUTUBE PLAYLIST COUNT
# =========================
@app.get("/youtube-playlist-count")
def youtube_playlist_count(url: str):
    try:
        if not YOUTUBE_API_KEY:
            raise HTTPException(status_code=500, detail="YouTube API key missing")

        match = re.search(r"list=([a-zA-Z0-9_-]+)", url)

        if not match:
            raise HTTPException(status_code=400, detail="Invalid playlist URL")

        playlist_id = match.group(1)
        total_videos = get_youtube_playlist_count(playlist_id, YOUTUBE_API_KEY)

        return {
            "playlist_id": playlist_id,
            "total_videos": total_videos
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =========================
# PARSE RESUME
# =========================
@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    text = extract_text_from_pdf(file.file)
    skills = extract_skills(text)
    return {"text": text, "skills": skills}

# =========================
# ATS CHECK
# =========================
@app.post("/ats-check")
async def ats_check(file: UploadFile = File(...)):
    text = extract_text_from_pdf(file.file)
    result = check_ats(text)
    return result

# =========================
# JOB MATCH
# =========================
@app.post("/job-match")
async def job_match(file: UploadFile = File(...), job_description: str = Form(...)):
    text = extract_text_from_pdf(file.file)
    result = job_match_score(text, job_description)
    return result

# =========================
# KEYWORD SCAN
# =========================
@app.post("/keyword-scan")
async def keyword_scan(file: UploadFile = File(...), job_description: str = Form(...)):
    text = extract_text_from_pdf(file.file)
    result = scan_keywords(text, job_description)
    return result

# =========================
# READABILITY
# =========================
@app.post("/readability")
async def readability(file: UploadFile = File(...)):
    text = extract_text_from_pdf(file.file)
    score = check_readability(text)
    return {"readability": score}

# =========================
# SKILLS GAP
# =========================
@app.post("/skills-gap")
async def skills_gap(file: UploadFile = File(...), job_role: str = Form(...)):
    text = extract_text_from_pdf(file.file)
    skills = extract_skills(text)
    gap = analyze_skill_gap(skills, job_role)
    return gap

# =========================
# CAREER PATH
# =========================
@app.post("/career-path")
async def career_path(file: UploadFile = File(...)):
    text = extract_text_from_pdf(file.file)
    skills = extract_skills(text)
    path = suggest_career(skills)
    return path

# =========================
# INTERVIEW QUESTIONS (OLD GET)
# =========================
@app.get("/interview/{role}")
def interview(role: str):
    questions = generate_questions(role)
    return {"questions": questions}

# =========================
# INTERVIEW QUESTIONS (NEW POST)
# =========================
@app.post("/generate-interview-questions")
def generate_interview_questions(payload: InterviewRequest):
    try:
        role = payload.role.strip()

        if not role:
            raise HTTPException(status_code=400, detail="Role is required")

        technical = [
            f"What technical skills are required for a {role}?",
            f"Explain one project where you used {role} related skills.",
            f"What tools, frameworks, or platforms are commonly used in {role}?",
            f"How would you solve a real-world problem as a {role}?"
        ]

        hr = [
            "Tell me about yourself.",
            f"Why do you want to become a {role}?",
            "What are your strengths and weaknesses?",
            "How do you handle deadlines and pressure?"
        ]

        situational = [
            "Describe a time when you solved a difficult problem.",
            "How would you handle a disagreement in a team?",
            "What would you do if you were given a task you had never done before?",
            "How do you prioritize multiple tasks at the same time?"
        ]

        return {
            "role": role,
            "technical": technical,
            "hr": hr,
            "situational": situational
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =========================
# COVER LETTER
# =========================
@app.post("/cover-letter")
async def cover_letter(
    name: str = Form(...),
    role: str = Form(...),
    company: str = Form(...)
):
    letter = generate_cover_letter(name, role, company)
    return {"cover_letter": letter}

# =========================
# LINKEDIN OPTIMIZER
# =========================
@app.post("/linkedin")
async def linkedin(
    file: UploadFile = File(...),
    target_role: str = Form("")
):
    text = extract_text_from_pdf(file.file)
    result = optimize_linkedin(text, target_role)
    return result

# =========================
# COMPLETE ANALYSIS
# =========================
@app.post("/analyze-complete")
async def analyze_complete(
    file: UploadFile = File(...),
    job_role: str = Form(...),
    job_description: str = Form(...)
):
    try:
        text = extract_text_from_pdf(file.file)
        skills = extract_skills(text)

        ats_result = check_ats(text)
        match_score = job_match_score(text, job_description)
        keyword_result = scan_keywords(text, job_description)
        readability_result = check_readability(text)
        gap_result = analyze_skill_gap(skills, job_role)
        career_result = suggest_career(skills)

        jd_text = job_description.lower()
        resume_skills_lower = [skill.lower() for skill in skills]

        matched_skills = [skill for skill in skills if skill.lower() in jd_text]
        missing_skills = []

        if isinstance(gap_result, dict):
            gap_missing = gap_result.get("missing_skills", [])
            if gap_missing:
                missing_skills.extend(gap_missing)
        elif isinstance(gap_result, list):
            missing_skills.extend(gap_result)

        keyword_missing = keyword_result.get("missing_keywords", []) if isinstance(keyword_result, dict) else []

        for item in keyword_missing:
            if isinstance(item, str):
                split_items = [x.strip() for x in item.split(",") if x.strip()]
                for skill in split_items:
                    if skill not in missing_skills:
                        missing_skills.append(skill)

        cleaned_missing = []
        for skill in missing_skills:
            if skill and skill.lower() not in resume_skills_lower and skill not in cleaned_missing:
                cleaned_missing.append(skill)

        missing_skills = cleaned_missing

        skill_match_score = 0
        total_jd_skills = len(matched_skills) + len(missing_skills)
        if total_jd_skills > 0:
            skill_match_score = round((len(matched_skills) / total_jd_skills) * 100)

        learning_resources = get_learning_resources(missing_skills)

        return {
            "resume_text": text,
            "skills": skills,
            "ats": ats_result,
            "job_match_score": match_score,
            "skill_match_score": skill_match_score,
            "keyword_scan": keyword_result,
            "readability": readability_result,
            "career_path": career_result,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "learning_resources": learning_resources
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))