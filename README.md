🚀 CareerAI – AI-Powered Resume Analyzer & Career Guidance Platform

CareerAI is a full-stack AI-driven web application that helps users analyze their resumes, identify skill gaps, and get personalized career guidance in real-time.

---

🌐 Live Demo

Frontend: https://career-ai-chi-six.vercel.app
Backend API: https://careerai-backend-fe55.onrender.com

---

📌 Features

📄 Resume Analysis

- Upload resume (PDF format)
- Extract text using parser
- Identify skills using NLP

🎯 ATS Score Checker

- Evaluate resume structure
- Generate ATS score

🔍 Job Match & Keyword Scanner

- Compare resume with job description
- Identify missing keywords

🧠 Skill Gap Analyzer

- Detect missing skills
- Suggest improvements

🎓 Career Guidance

- Recommend career paths
- Suggest learning resources

💼 Interview Preparation

- Generate technical, HR, situational questions

✍️ Cover Letter Generator

- Generate customized cover letters

🔗 LinkedIn Optimizer

- Improve profile headline and keywords

💳 Payment Integration

- Razorpay integration
- Secure backend verification

🤖 AI Chatbot

- Resume assistant chatbot

---

🏗️ System Architecture

1. User uploads resume (PDF)
2. Backend extracts text
3. NLP extracts skills
4. Resume compared with job role & description
5. System calculates:
   - ATS Score
   - Job Match Score
   - Missing Skills
   - Missing Keywords
6. Learning resources generated
7. Results shown on frontend dashboard

---

🛠️ Tech Stack

Frontend:

- React.js
- HTML, CSS, JavaScript

Backend:

- FastAPI
- Python
- REST APIs

AI/ML:

- spaCy NLP

Database:

- Firebase

Payments:

- Razorpay

Deployment:

- Vercel (Frontend)
- Render (Backend)

---

⚙️ Installation

Backend:
cd backend
pip install -r requirements.txt
uvicorn resume:app --reload

Frontend:
cd frontend
npm install
npm start

---

🔐 Environment Variables

Create .env file inside backend:

RAZORPAY_KEY_ID=your_key_here
RAZORPAY_KEY_SECRET=your_secret_here
YOUTUBE_API_KEY=your_key_here

---

📊 Performance

- API response: < 2 seconds
- Full analysis: 3–8 seconds

---

⚠️ Limitations

- Backend may take time to wake up (Render free plan)
- Accuracy depends on resume content

---

🔮 Future Scope

- User login system
- Resume history tracking
- Advanced AI models

---

👨‍💻 Author

Shrinidhi Naik
GitHub: https://github.com/shrinidhinaik23