# CareerAI – AI-Powered Resume Skill Gap Analyzer

CareerAI is a full-stack web application that helps users analyze resumes against job descriptions, identify missing skills, improve ATS compatibility, generate personalized recommendations, and prepare for interviews using AI-powered insights.

## Live Demo
- Frontend: https://career-ai-frontend.vercel.app
- Backend API: https://careerai-backend-4.onrender.com

## Key Features
- Resume upload and parsing
- ATS score analysis
- Skill gap detection based on job description
- Personalized learning recommendations
- Interview question generation
- Cover letter generation
- LinkedIn profile optimization suggestions
- AI chatbot support
- Razorpay payment integration

## Tech Stack
**Frontend:** React.js, Tailwind CSS  
**Backend:** FastAPI, Python  
**Other Tools:** Razorpay, NLP-based resume/JD analysis, deployment on Vercel and Render

## Screenshots
![Home Page](assets/home.png)
![ATS Analysis](assets/ats-analysis.png)
![Skill Gap Report](assets/skill-gap.png)
![Interview Questions](assets/interview-questions.png)

## 🧠 How It Works

1. Upload your resume (PDF format)
2. Enter target role and job description
3. Backend extracts and processes resume content
4. System analyzes:

   * Skill match score
   * Missing skills
   * ATS readability
5. Generates:

   * Improvement suggestions
   * Career path recommendations
   * Learning resources
6. Additional tools provide interview questions and profile optimization

---

## 🏗️ Architecture Overview

User → React Frontend → FastAPI Backend → NLP Processing → Analysis Engine → Response to UI

---


## 📂 Project Structure

CareerAI/
├── frontend/   # React UI
├── backend/    # FastAPI APIs
├── CHATBOT/    # Chatbot features
├── assets/     # Screenshots
└── README.md

---

## 🔌 Core Features

* Resume Parsing
* ATS Score Evaluation
* Skill Gap Detection
* Job Match Analysis
* Career Path Recommendation
* Interview Question Generator
* Cover Letter Generator
* Resume Keyword Scanner
* LinkedIn Profile Optimizer
* Learning Resource Finder

---

## ⚙️ Run Locally

### Clone Repository

```bash
git clone https://github.com/shrinidhinaik23/CareerAI.git
cd CareerAI
```

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🔐 Environment Variables

Create `.env` file in backend:

```env
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
YOUTUBE_API_KEY=your_key
FIREBASE_CREDENTIALS_PATH=your_path
```

---

## ⚡ Performance

* Fast API responses for individual features
* Complete resume analysis generated within a few seconds
* Optimized for real-time interaction

---

## ⚠️ Limitations

* Accuracy depends on resume format
* NLP-based matching may miss rare skills
* Backend cold start delay (free hosting)
* Limited dataset for skill comparison

---

## 🚧 Challenges Faced

* Extracting structured data from PDF resumes
* Matching resumes with job descriptions accurately
* Handling inconsistent skill keywords
* Integrating secure payment gateway
* Managing frontend-backend communication

---

## ✅ Solutions Implemented

* Applied NLP preprocessing techniques
* Designed modular API-based backend
* Implemented skill matching and gap analysis
* Integrated Razorpay for secure payments
* Deployed scalable frontend/backend setup

---

## 🚀 Future Improvements

* Advanced AI-based recommendations
* Improved ATS scoring algorithm
* Resume auto-enhancement suggestions
* Multi-language support
* Mobile application version

---

## 📌 Key Learnings

* Full-stack development (React + FastAPI)
* NLP-based resume analysis
* API design and integration
* Payment gateway integration
* Real-world deployment practices

---

## 👨‍💻 Author

**Shrinidhi Manjunath Naik**

* GitHub: https://github.com/shrinidhinaik23

---
