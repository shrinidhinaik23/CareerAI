import { useState } from "react"

function HomePage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [targetRole, setTargetRole] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [isReadingFile, setIsReadingFile] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")
  const [pastedResume, setPastedResume] = useState("")
  const [loading, setLoading] = useState(false)

  const [results, setResults] = useState({
    score: 0,
    matchedSkills: [],
    missingSkills: [],
    suggestions: [],
    learningResources: [],
    careerPath: null,
    readability: null
  })

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return

    setSelectedFile(file)
    setFileName(file.name)
    setShowResults(false)
  }

  const handleAnalyze = async () => {
    if (activeTab === "upload") {
      if (!selectedFile) {
        alert("Please upload a resume first.")
        return
      }
    } else {
      if (!pastedResume.trim()) {
        alert("Please paste resume text first.")
        return
      }
      alert("For now, backend analysis works with uploaded file. Please use Upload File tab.")
      return
    }

    if (!targetRole.trim() || !jobDescription.trim()) {
      alert("Please enter target role and job description.")
      return
    }

    try {
      setLoading(true)
      setIsReadingFile(true)

      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("job_role", targetRole)
      formData.append("job_description", jobDescription)

      const response = await fetch("http://127.0.0.1:8000/analyze-complete", {
        method: "POST",
        body: formData
      })

      const data = await response.json()
      console.log("Backend result:", data)

      if (!response.ok) {
        alert(data.detail || "Analysis failed")
        return
      }

      const skillScore = data.skill_match_score || 0
      const suggestions = []

      if ((data.missing_skills || []).length > 0) {
        suggestions.push(
          `Add or learn these missing skills: ${data.missing_skills.slice(0, 3).join(", ")}`
        )
      }

      if (skillScore < 50) {
        suggestions.push("Low skill match. Add more role-specific skills to improve your resume.")
      } else if (skillScore < 70) {
        suggestions.push("Moderate skill match. You can improve with a few targeted skills.")
      } else if (skillScore < 90) {
        suggestions.push("Good skill match. Add a few more tools and keywords for a stronger fit.")
      } else {
        suggestions.push("Excellent skill match. Your resume looks highly compatible.")
      }

      if (
        data.keyword_scan &&
        data.keyword_scan.missing_keywords &&
        data.keyword_scan.missing_keywords.length > 0
      ) {
        suggestions.push(
          `Important job-description keywords missing: ${data.keyword_scan.missing_keywords
            .slice(0, 3)
            .join(", ")}`
        )
      }

      if ((data.missing_skills || []).length > 0) {
        localStorage.setItem("lastMissingSkill", data.missing_skills[0])
      }

      setResults({
        score: skillScore,
        matchedSkills: data.matched_skills || [],
        missingSkills: data.missing_skills || [],
        suggestions,
        learningResources: data.learning_resources || [],
        careerPath: data.career_path || null,
        readability: data.readability || null
      })

      setShowResults(true)
    } catch (error) {
      console.error(error)
      alert("Could not connect to backend.")
    } finally {
      setLoading(false)
      setIsReadingFile(false)
    }
  }

  return (
    <div style={styles.page}>
      <section style={styles.heroTop}>
        <div style={styles.badge}>Airesume Smart Tools</div>
        <h1 style={styles.title}>Discover your resume skill gaps</h1>
        <p style={styles.subtitle}>
          Upload your resume, compare it with your target role, and get matched skills,
          missing skills, learning resources, and next career suggestions instantly.
        </p>
      </section>

      <section style={styles.grid}>
        <div style={styles.leftCard}>
          <div style={styles.cardTitleRow}>
            <h3 style={styles.cardTitle}>Your Resume</h3>
            <span style={styles.required}>Required</span>
          </div>

          <div style={styles.tabRow}>
            <button
              style={activeTab === "upload" ? styles.activeTab : styles.tab}
              onClick={() => setActiveTab("upload")}
            >
              Upload File
            </button>

            <button
              style={activeTab === "paste" ? styles.activeTab : styles.tab}
              onClick={() => setActiveTab("paste")}
            >
              Paste Text
            </button>
          </div>

          {activeTab === "upload" ? (
            <>
              <label style={styles.uploadArea}>
                <div style={styles.uploadIcon}>↑</div>
                <p style={styles.uploadMain}>Click to upload or drag and drop</p>
                <p style={styles.uploadSub}>PDF, DOCX, or TXT</p>
                <span style={styles.uploadButton}>Choose Resume</span>
                <input type="file" onChange={handleFile} style={{ display: "none" }} />
              </label>

              {fileName && <p style={styles.fileName}>Uploaded: {fileName}</p>}
              {isReadingFile && <p style={styles.readingText}>Analyzing resume...</p>}
            </>
          ) : (
            <div style={styles.formGroup}>
              <label style={styles.label}>Paste Resume Text</label>
              <textarea
                style={styles.textarea}
                placeholder="Paste your complete resume text here..."
                value={pastedResume}
                onChange={(e) => setPastedResume(e.target.value)}
              />
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Target Role</label>
            <input
              style={styles.input}
              placeholder="Example: Full Stack Developer"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Job Description</label>
            <textarea
              style={styles.textarea}
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <p style={styles.helper}>
              Include requirements, tools, and responsibilities for better matching.
            </p>
          </div>

          <button style={styles.analyzeButton} onClick={handleAnalyze}>
            {loading ? "Analyzing Resume..." : "Analyze Resume"}
          </button>
        </div>

        <div style={styles.rightCard}>
          <div style={styles.rightHeader}>
            <div style={styles.rightIcon}>✦</div>
            <h3 style={styles.rightTitle}>What You'll Get</h3>
          </div>

          <div style={styles.featureItem}>Matched skills for your target role</div>
          <div style={styles.featureItem}>Missing skills you need to learn</div>
          <div style={styles.featureItem}>Skill match score</div>
          <div style={styles.featureItem}>Learning videos and course links</div>
          <div style={styles.featureItem}>Recommended next career path</div>

          <div style={styles.tagRow}>
            <span style={styles.tag}>100% Private</span>
            <span style={styles.tag}>Instant Results</span>
          </div>
        </div>
      </section>

      {showResults && (
        <section style={styles.resultsSection}>
          <div style={styles.resultsTop}>
            <h2 style={styles.resultsHeading}>Your Skill Gap Analysis</h2>
            <p style={styles.resultsSub}>
              Based on the provided resume and target role: {targetRole}
            </p>
          </div>

          <div style={styles.resultsGrid}>
            <div style={styles.scoreCard}>
              <p style={styles.previewLabel}>Skill Match Score</p>
              <div style={styles.scoreBig}>{results.score}%</div>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${results.score}%` }}></div>
              </div>
              <p style={styles.scoreNote}>
                {results.score >= 80
                  ? "Your current skills are strongly aligned with this role."
                  : results.score >= 60
                  ? "You are moderately aligned. Learning a few missing skills can improve your chances."
                  : "Your skill gap is high. Focus on the missing skills and recommended resources."}
              </p>
            </div>

            <div style={styles.resultCard}>
              <h3 style={styles.resultCardTitle}>Matched Skills</h3>
              <div style={styles.skillWrap}>
                {results.matchedSkills.length > 0 ? (
                  results.matchedSkills.map((skill) => (
                    <span key={skill} style={styles.goodSkill}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <p style={styles.emptyText}>No matched skills found yet.</p>
                )}
              </div>
            </div>

            <div style={styles.resultCard}>
              <h3 style={styles.resultCardTitle}>Missing Skills</h3>
              <div style={styles.skillWrap}>
                {results.missingSkills.length > 0 ? (
                  results.missingSkills.map((skill) => (
                    <span key={skill} style={styles.badSkill}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <p style={styles.emptyText}>No major missing skills found.</p>
                )}
              </div>
            </div>

            <div style={styles.suggestionCard}>
              <h3 style={styles.resultCardTitle}>Improvement Suggestions</h3>
              <ul style={styles.suggestionList}>
                {results.suggestions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div style={styles.learningCard}>
              <h3 style={styles.resultCardTitle}>Learning Resources</h3>
              {results.learningResources.length > 0 ? (
                results.learningResources.map((item, index) => (
                  <div key={index} style={styles.resourceBlock}>
                    <h4 style={styles.resourceSkill}>{item.skill}</h4>
                    <div style={styles.resourceLinks}>
                      {item.resources.map((resource, idx) => (
                        <a
                          key={idx}
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.resourceLink}
                        >
                          {resource.platform} · {resource.title}
                        </a>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p style={styles.emptyText}>No learning resources needed.</p>
              )}
            </div>

            <div style={styles.resultCard}>
              <h3 style={styles.resultCardTitle}>Recommended Career Path</h3>

              {results.careerPath && results.careerPath.recommended_roles ? (
                <div style={styles.careerPathWrap}>
                  {results.careerPath.recommended_roles.slice(0, 3).map((item, index) => (
                    <div key={index} style={styles.careerMiniCard}>
                      <div style={styles.careerMiniTop}>
                        <span style={styles.goodSkill}>{item.role}</span>
                        <span style={styles.scoreMiniBadge}>{item.match_score}%</span>
                      </div>

                      <p style={styles.careerMiniText}>
                        Growth: {item.career_growth && item.career_growth.length > 0
                          ? item.career_growth.join(" → ")
                          : "No growth path"}
                      </p>

                      <div style={styles.skillWrap}>
                        {item.missing_skills && item.missing_skills.length > 0 ? (
                          item.missing_skills.slice(0, 4).map((skill, idx) => (
                            <span key={idx} style={styles.badSkill}>
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span style={styles.goodSkill}>No major missing skills</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={styles.emptyText}>No career suggestions available.</p>
              )}
            </div>

            <div style={styles.resultCard}>
              <h3 style={styles.resultCardTitle}>Readability</h3>
              <pre style={styles.preBlock}>
                {results.readability
                  ? JSON.stringify(results.readability, null, 2)
                  : "No readability result available."}
              </pre>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

const styles = {
  page: {
    padding: "50px 60px 70px",
    background: "linear-gradient(180deg, #f8fbff 0%, #f5f7fb 100%)",
    minHeight: "100vh"
  },

  heroTop: {
    textAlign: "center",
    maxWidth: "920px",
    margin: "0 auto 38px"
  },

  badge: {
    display: "inline-block",
    background: "#eef2ff",
    color: "#4f46e5",
    padding: "8px 16px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "14px",
    marginBottom: "14px"
  },

  title: {
    margin: 0,
    fontSize: "54px",
    lineHeight: "1.08",
    color: "#0f172a"
  },

  subtitle: {
    marginTop: "16px",
    fontSize: "19px",
    color: "#5b6b80",
    lineHeight: "1.7"
  },

  grid: {
    maxWidth: "1240px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1.35fr 0.85fr",
    gap: "24px",
    alignItems: "start"
  },

  leftCard: {
    background: "#ffffff",
    border: "1px solid #e5eaf2",
    borderRadius: "26px",
    padding: "28px",
    boxShadow: "0 16px 38px rgba(15, 23, 42, 0.05)"
  },

  rightCard: {
    background: "#ffffff",
    border: "1px solid #e5eaf2",
    borderRadius: "26px",
    padding: "26px",
    boxShadow: "0 16px 38px rgba(15, 23, 42, 0.05)"
  },

  cardTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px"
  },

  cardTitle: {
    margin: 0,
    fontSize: "24px",
    color: "#0f172a"
  },

  required: {
    fontSize: "13px",
    color: "#ef4444",
    fontWeight: "700"
  },

  tabRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "22px"
  },

  activeTab: {
    border: "1px solid #14b8a6",
    background: "#eafcf8",
    color: "#0f766e",
    padding: "12px 20px",
    borderRadius: "999px",
    fontWeight: "700",
    cursor: "pointer"
  },

  tab: {
    border: "1px solid #e2e8f0",
    background: "#fff",
    color: "#64748b",
    padding: "12px 20px",
    borderRadius: "999px",
    fontWeight: "700",
    cursor: "pointer"
  },

  uploadArea: {
    display: "block",
    border: "2px dashed #dbe3ef",
    borderRadius: "22px",
    padding: "46px 20px",
    textAlign: "center",
    background: "#f8fbff",
    cursor: "pointer"
  },

  uploadIcon: {
    fontSize: "34px",
    color: "#94a3b8",
    marginBottom: "12px"
  },

  uploadMain: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a"
  },

  uploadSub: {
    margin: "10px 0 18px",
    color: "#64748b",
    fontSize: "16px"
  },

  uploadButton: {
    display: "inline-block",
    background: "#4f46e5",
    color: "white",
    padding: "13px 22px",
    borderRadius: "999px",
    fontWeight: "700"
  },

  fileName: {
    marginTop: "12px",
    color: "#334155",
    fontWeight: "600"
  },

  readingText: {
    marginTop: "8px",
    color: "#4f46e5",
    fontWeight: "600"
  },

  formGroup: {
    marginTop: "20px"
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "700",
    color: "#111827"
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #d1d9e6",
    fontSize: "15px",
    outline: "none"
  },

  textarea: {
    width: "100%",
    minHeight: "170px",
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid #d1d9e6",
    fontSize: "15px",
    resize: "vertical",
    background: "#f8fbff",
    outline: "none"
  },

  helper: {
    marginTop: "8px",
    marginBottom: 0,
    fontSize: "14px",
    color: "#64748b"
  },

  analyzeButton: {
    width: "100%",
    marginTop: "20px",
    padding: "16px",
    border: "none",
    borderRadius: "16px",
    background: "linear-gradient(90deg, #34d399, #4f46e5)",
    color: "white",
    fontWeight: "800",
    fontSize: "16px",
    cursor: "pointer"
  },

  rightHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px"
  },

  rightIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "14px",
    background: "#dcfce7",
    color: "#16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px"
  },

  rightTitle: {
    margin: 0,
    fontSize: "28px",
    color: "#0f172a"
  },

  featureItem: {
    padding: "12px 0",
    borderBottom: "1px solid #edf2f7",
    color: "#475569",
    fontSize: "17px"
  },

  tagRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "18px"
  },

  tag: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#64748b",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: "600"
  },

  resultsSection: {
    maxWidth: "1240px",
    margin: "34px auto 0"
  },

  resultsTop: {
    textAlign: "center",
    marginBottom: "24px"
  },

  resultsHeading: {
    margin: 0,
    fontSize: "40px",
    color: "#0f172a"
  },

  resultsSub: {
    marginTop: "10px",
    color: "#64748b",
    fontSize: "17px"
  },

  resultsGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr",
    gap: "20px"
  },

  scoreCard: {
    background: "#0f172a",
    color: "white",
    borderRadius: "24px",
    padding: "24px"
  },

  previewLabel: {
    marginTop: 0,
    color: "#cbd5e1",
    fontSize: "14px"
  },

  scoreBig: {
    fontSize: "62px",
    fontWeight: "800",
    color: "#34d399",
    marginBottom: "14px"
  },

  progressBar: {
    width: "100%",
    height: "10px",
    background: "#334155",
    borderRadius: "999px",
    overflow: "hidden",
    marginBottom: "16px"
  },

  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #34d399, #4f46e5)"
  },

  scoreNote: {
    color: "#cbd5e1",
    lineHeight: "1.7",
    marginBottom: 0
  },

  resultCard: {
    background: "#ffffff",
    border: "1px solid #e5eaf2",
    borderRadius: "24px",
    padding: "22px"
  },

  suggestionCard: {
    background: "#ffffff",
    border: "1px solid #e5eaf2",
    borderRadius: "24px",
    padding: "22px",
    gridColumn: "span 2"
  },

  learningCard: {
    background: "#ffffff",
    border: "1px solid #e5eaf2",
    borderRadius: "24px",
    padding: "22px",
    gridColumn: "span 3"
  },

  resultCardTitle: {
    marginTop: 0,
    color: "#0f172a"
  },

  skillWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px"
  },

  goodSkill: {
    padding: "8px 12px",
    borderRadius: "999px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "13px",
    fontWeight: "600"
  },

  badSkill: {
    padding: "8px 12px",
    borderRadius: "999px",
    background: "#fee2e2",
    color: "#991b1b",
    fontSize: "13px",
    fontWeight: "600"
  },

  emptyText: {
    color: "#64748b",
    margin: 0
  },

  suggestionList: {
    margin: 0,
    paddingLeft: "18px",
    color: "#475569",
    lineHeight: "1.9"
  },

  resourceBlock: {
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: "1px solid #edf2f7"
  },

  resourceSkill: {
    margin: "0 0 10px",
    color: "#0f172a"
  },

  resourceLinks: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  resourceLink: {
    textDecoration: "none",
    color: "#2563eb",
    fontWeight: "600"
  },

  preBlock: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontSize: "13px",
    color: "#475569",
    background: "#f8fafc",
    padding: "12px",
    borderRadius: "12px"
  },

  careerPathWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  careerMiniCard: {
    border: "1px solid #e5eaf2",
    borderRadius: "16px",
    padding: "14px",
    background: "#f8fbff"
  },

  careerMiniTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px"
  },

  scoreMiniBadge: {
    background: "#eef2ff",
    color: "#4338ca",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700"
  },

  careerMiniText: {
    margin: "0 0 10px",
    color: "#475569",
    fontSize: "14px",
    lineHeight: "1.6"
  }
}

export default HomePage