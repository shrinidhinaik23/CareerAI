import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import FloatingChatbotButton from "./components/FloatingChatbotButton"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import PersonalizedTrackerPage from "./pages/PersonalizedTrackerPage"
import PricingPage from "./pages/PricingPage"
import ResourcesPage from "./pages/ResourcesPage"
import ResourceDetailPage from "./pages/ResourceDetailPage"
import InterviewQuestionsPage from "./pages/InterviewQuestionsPage"
import ResumeKeywordScannerPage from "./pages/ResumeKeywordScannerPage"
import LinkedinOptimizerPage from "./pages/LinkedinOptimizerPage"
import ATSCheckerPage from "./pages/ATSCheckerPage"
import JobMatchScorePage from "./pages/JobMatchScorePage"
import CoverLetterPage from "./pages/CoverLetterPage"
import ResumeReadabilityCheckerPage from "./pages/ResumeReadabilityCheckerPage"
import CareerPathPage from "./pages/CareerPathPage"
import LearningResourceFinderPage from "./pages/LearningResourceFinderPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"


function App() {
  return (
    <Router>
      <div className="app-shell">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/career-path-analyzer" element={<CareerPathPage />} />
          <Route path="/resources/interview-questions-generator" element={<InterviewQuestionsPage />} />
          <Route path="/resources/personalized-tracker" element={<PersonalizedTrackerPage />} />
          <Route path="/resources/resume-keyword-scanner" element={<ResumeKeywordScannerPage />} />
          <Route path="/resources/linkedin-profile-optimizer" element={<LinkedinOptimizerPage />} />
          <Route path="/resources/ats-resume-checker" element={<ATSCheckerPage />} />
          <Route path="/resources/job-match-score" element={<JobMatchScorePage />} />
          <Route path="/resources/cover-letter-generator" element={<CoverLetterPage />} />
          <Route path="/resources/resume-readability-checker" element={<ResumeReadabilityCheckerPage />} />
          <Route path="/resources/:slug" element={<ResourceDetailPage />} />
          <Route path="/tools/learning-resource-finder" element={<LearningResourceFinderPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
        <FloatingChatbotButton />
      </div>
    </Router>
  )
}

export default App