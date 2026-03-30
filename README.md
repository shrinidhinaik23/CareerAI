CareerAI — Resume Analysis & Career Guidance Platform

CareerAI is a full-stack web application that helps users analyze their resumes, identify missing skills, and get actionable suggestions to improve their job readiness.

The system processes resumes, compares them with job descriptions, and provides insights such as skill match, missing keywords, and improvement suggestions.

---

🚀 Live Demo

- 🌐 Frontend: https://career-ai-chi-six.vercel.app
- ⚙️ Backend: https://careeraibackend.onrender.com

---

✨ What This Project Does

- Upload a resume (PDF)
- Analyze skills present in the resume
- Compare resume with a job description
- Calculate skill match score
- Identify missing skills and keywords
- Provide suggestions to improve the resume
- Generate interview questions based on role
- Provide career path guidance
- Offer LinkedIn profile improvement tips
- Integrate Razorpay for premium features

---

📸 Screenshots

🏠 Home Page — Resume Upload

"Home" (./assets/home.png)

📊 Resume Analysis — Skill Match & Suggestions

"Analysis" (./assets/analysis.png)

🧩 Career Tools & Features

"Features" (./assets/features.png)

💳 Payment Integration (Razorpay)

"Payment" (./assets/payment.png)

---

🧠 How It Works

1. User uploads a resume (PDF format)
2. User enters target role and job description
3. Backend extracts text from the resume
4. The system compares:
   - Resume skills
   - Job description requirements
5. It calculates:
   - Skill match score
   - Missing skills
6. Generates:
   - Suggestions for improvement
   - Career guidance
   - Interview questions

---

🏗️ Architecture Overview

User → React Frontend → FastAPI Backend → Resume Processing → Analysis Logic → Response

---

🛠️ Tech Stack

Frontend

- React.js
- JavaScript
- CSS
- Axios
- Firebase Authentication

Backend

- FastAPI
- Python
- spaCy (basic NLP processing)
- scikit-learn (used for simple analysis tasks)
- pdfplumber (resume text extraction)

Integrations

- Razorpay (payment)
- Firebase (authentication)
- Vercel (frontend deployment)
- Render (backend deployment)

---

📂 Project Structure

CareerAI/
├── frontend/   # React UI
├── backend/    # FastAPI backend
├── CHATBOT/    # chatbot-related logic
├── assets/     # screenshots
└── README.md

---

🔌 Key Features Implemented

- Resume parsing from PDF
- Skill extraction and comparison
- Job description matching
- Missing keyword detection
- Basic ATS-style scoring
- Career suggestion generation
- Interview question generation
- LinkedIn suggestion feature
- Razorpay payment integration

---

⚙️ Run Locally

Clone Repository

git clone https://github.com/shrinidhinaik23/CareerAI.git
cd CareerAI

Backend Setup

cd backend
pip install -r requirements.txt
uvicorn resume:app --reload

Frontend Setup

cd frontend
npm install
npm start

---

🔐 Environment Variables

Create ".env" file in backend:

RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
YOUTUBE_API_KEY=your_key
FIREBASE_CREDENTIALS_PATH=your_path

---

⚡ Performance

- Most API responses are fast for normal inputs
- Full resume analysis typically completes within a few seconds
- Performance depends on resume size and backend cold start

---

⚠️ Limitations

- Accuracy depends on resume formatting
- Skill matching is rule-based / keyword-based
- Limited dataset for skill comparison
- Backend hosted on free tier may have cold start delay

---

🚧 Challenges Faced

- Extracting clean text from different resume formats
- Matching resume skills with job descriptions
- Handling inconsistent or missing keywords
- Integrating payment system securely
- Managing frontend and backend deployment

---

🚀 Future Improvements

- Improve skill matching accuracy
- Add better scoring logic
- Enhance UI/UX
- Support more resume formats
- Expand dataset for better recommendations

---

📌 Key Learnings

- Built a full-stack application using React and FastAPI
- Worked with PDF parsing and basic NLP techniques
- Designed REST APIs for multiple features
- Integrated payment gateway (Razorpay)
- Deployed frontend and backend services

---

👨‍💻 Author

Shrinidhi Manjunath Naik

- GitHub: https://github.com/shrinidhinaik23

---
