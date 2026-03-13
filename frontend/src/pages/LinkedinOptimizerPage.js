import { useState } from "react"

function LinkedinOptimizerPage() {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [targetRole, setTargetRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleFile = (e) => {
    const selected = e.target.files && e.target.files[0]
    if (!selected) return
    setFile(selected)
    setFileName(selected.name)
  }

  const handleOptimize = async () => {
    if (!file) {
      alert("Please upload your resume first.")
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("target_role", targetRole)

      const response = await fetch("http://127.0.0.1:8000/linkedin", {
        method: "POST",
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.detail || "LinkedIn optimization failed")
        return
      }

      setResult(data)
    } catch (error) {
      console.error(error)
      alert("Could not connect to backend")
    } finally {
      setLoading(false)
    }
  }

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      alert("Copied")
    } catch {
      alert("Copy failed")
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.hero}>
          <div style={styles.badge}>AI Resume Tool</div>
          <h1 style={styles.title}>LinkedIn Profile Optimizer</h1>
          <p style={styles.subtitle}>
            Improve profile strength, generate better headlines, analyze keyword gaps,
            and boost recruiter visibility.
          </p>
        </div>

        <div style={styles.contentCard}>
          <h2 style={styles.sectionTitle}>Upload your resume</h2>

          <label style={styles.uploadArea}>
            <div style={styles.uploadIcon}>↑</div>
            <p style={styles.uploadMain}>Click to upload your resume</p>
            <p style={styles.uploadSub}>PDF format recommended</p>
            <span style={styles.uploadButton}>Choose Resume</span>
            <input type="file" onChange={handleFile} style={{ display: "none" }} />
          </label>

          {fileName && <p style={styles.fileName}>Uploaded: {fileName}</p>}

          <div style={styles.formGroup}>
            <label style={styles.label}>Target Role</label>
            <input
              style={styles.input}
              placeholder="Example: Java Developer, Data Analyst"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
          </div>

          <button style={styles.tryButton} onClick={handleOptimize}>
            {loading ? "Optimizing..." : "Optimize Profile"}
          </button>
        </div>

        {result && (
          <div style={styles.resultsGrid}>
            <div style={styles.scoreCard}>
              <p style={styles.previewLabel}>LinkedIn Score</p>
              <div style={styles.scoreBig}>{result.linkedin_score}%</div>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${result.linkedin_score}%` }}></div>
              </div>
              <p style={styles.scoreNote}>
                {result.linkedin_score >= 80
                  ? "Strong profile foundation."
                  : result.linkedin_score >= 60
                  ? "Good profile, but can be improved."
                  : "Your profile needs stronger optimization."}
              </p>
            </div>

            <div style={styles.resultCard}>
              <h3 style={styles.resultTitle}>Suggested Headline</h3>
              <p style={styles.resultText}>{result.headline}</p>
            </div>

            <div style={styles.resultCard}>
              <h3 style={styles.resultTitle}>Professional Summary</h3>
              <p style={styles.resultText}>{result.summary}</p>
              <button style={styles.smallButton} onClick={() => copyText(result.summary)}>
                Copy Summary
              </button>
            </div>

            <div style={styles.fullWidthCard}>
              <h3 style={styles.resultTitle}>Headline AI Generator</h3>
              <div style={styles.optionWrap}>
                {result.headline_versions && result.headline_versions.map((item, index) => (
                  <div key={index} style={styles.optionCard}>
                    <p style={styles.resultText}>{item}</p>
                    <button style={styles.smallButton} onClick={() => copyText(item)}>
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.resultCard}>
              <h3 style={styles.resultTitle}>Top LinkedIn Keywords</h3>
              <div style={styles.skillWrap}>
                {result.top_keywords && result.top_keywords.length > 0 ? (
                  result.top_keywords.map((item, index) => (
                    <span key={index} style={styles.goodSkill}>
                      {item}
                    </span>
                  ))
                ) : (
                  <p style={styles.emptyText}>No keywords found.</p>
                )}
              </div>
            </div>

            <div style={styles.resultCard}>
              <h3 style={styles.resultTitle}>Keyword Gap vs Role</h3>
              <p style={styles.subMiniTitle}>Matched</p>
              <div style={styles.skillWrap}>
                {result.matched_role_keywords && result.matched_role_keywords.length > 0 ? (
                  result.matched_role_keywords.map((item, index) => (
                    <span key={index} style={styles.goodSkill}>
                      {item}
                    </span>
                  ))
                ) : (
                  <p style={styles.emptyText}>No matched role keywords.</p>
                )}
              </div>

              <p style={{ ...styles.subMiniTitle, marginTop: "14px" }}>Missing</p>
              <div style={styles.skillWrap}>
                {result.missing_role_keywords && result.missing_role_keywords.length > 0 ? (
                  result.missing_role_keywords.map((item, index) => (
                    <span key={index} style={styles.badSkill}>
                      {item}
                    </span>
                  ))
                ) : (
                  <p style={styles.emptyText}>No missing role keywords.</p>
                )}
              </div>
            </div>

            <div style={styles.fullWidthCard}>
              <h3 style={styles.resultTitle}>LinkedIn ATS Keyword Scanner Tips</h3>
              <ul style={styles.featureList}>
                {result.improvement_suggestions &&
                  result.improvement_suggestions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fbff",
    padding: "40px 24px"
  },
  wrapper: {
    maxWidth: "1100px",
    margin: "0 auto"
  },
  hero: {
    marginBottom: "24px"
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
    fontSize: "46px",
    lineHeight: 1.1,
    color: "#0f172a"
  },
  subtitle: {
    marginTop: "14px",
    color: "#64748b",
    fontSize: "18px",
    lineHeight: 1.7
  },
  contentCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "28px",
    padding: "28px",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
    marginBottom: "24px"
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: "12px",
    color: "#0f172a",
    fontSize: "24px"
  },
  uploadArea: {
    display: "block",
    border: "2px dashed #dbe3ef",
    borderRadius: "22px",
    padding: "40px 20px",
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
    color: "#ffffff",
    padding: "13px 22px",
    borderRadius: "999px",
    fontWeight: "700"
  },
  fileName: {
    marginTop: "12px",
    color: "#334155",
    fontWeight: "600"
  },
  formGroup: {
    marginTop: "18px"
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
  tryButton: {
    marginTop: "18px",
    border: "none",
    background: "linear-gradient(90deg, #34d399, #4f46e5)",
    color: "#ffffff",
    padding: "14px 22px",
    borderRadius: "14px",
    fontWeight: "700",
    display: "inline-block",
    cursor: "pointer"
  },
  resultsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
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
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    padding: "22px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)"
  },
  fullWidthCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    padding: "22px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)",
    gridColumn: "span 2"
  },
  resultTitle: {
    marginTop: 0,
    color: "#0f172a"
  },
  resultText: {
    color: "#475569",
    lineHeight: "1.8",
    marginBottom: 0
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
  featureList: {
    margin: 0,
    paddingLeft: "20px",
    color: "#475569",
    lineHeight: "2"
  },
  optionWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  optionCard: {
    background: "#f8fbff",
    border: "1px solid #e5e7eb",
    padding: "14px",
    borderRadius: "14px"
  },
  smallButton: {
    marginTop: "10px",
    border: "none",
    background: "#eef2ff",
    color: "#4338ca",
    padding: "8px 12px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer"
  },
  subMiniTitle: {
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "8px"
  },
  emptyText: {
    color: "#64748b",
    margin: 0
  }
}

export default LinkedinOptimizerPage