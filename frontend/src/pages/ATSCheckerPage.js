    import { useState } from "react"

function ATSCheckerPage() {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleFile = (e) => {
    const selected = e.target.files && e.target.files[0]
    if (!selected) return
    setFile(selected)
    setFileName(selected.name)
  }

  const handleCheck = async () => {
    if (!file) {
      alert("Please upload your resume first.")
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("http://127.0.0.1:8000/ats-check", {
        method: "POST",
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.detail || "ATS check failed")
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

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.hero}>
          <div style={styles.badge}>AI Resume Tool</div>
          <h1 style={styles.title}>ATS Resume Checker</h1>
          <p style={styles.subtitle}>
            Upload your resume and instantly check ATS compatibility, formatting quality,
            and screening readiness.
          </p>
        </div>

        <div style={styles.topGrid}>
          <div style={styles.leftCard}>
            <h3 style={styles.cardTitle}>Upload Resume</h3>

            <label style={styles.uploadArea}>
              <div style={styles.uploadIcon}>↑</div>
              <p style={styles.uploadMain}>Click to upload your resume</p>
              <p style={styles.uploadSub}>PDF format recommended</p>
              <span style={styles.uploadButton}>Choose Resume</span>
              <input type="file" onChange={handleFile} style={{ display: "none" }} />
            </label>

            {fileName && <p style={styles.fileName}>Uploaded: {fileName}</p>}

            <button style={styles.actionButton} onClick={handleCheck}>
              {loading ? "Checking..." : "Check ATS Score"}
            </button>
          </div>

          <div style={styles.rightCard}>
            <h3 style={styles.cardTitle}>What you’ll get</h3>
            <div style={styles.featureItem}>ATS compatibility score</div>
            <div style={styles.featureItem}>Resume structure issues</div>
            <div style={styles.featureItem}>Formatting improvement tips</div>
            <div style={styles.featureItem}>Section completeness review</div>
            <div style={styles.featureItem}>Actionable ATS suggestions</div>
          </div>
        </div>

        {result && (
          <div style={styles.resultsGrid}>
            <div style={styles.scoreCard}>
              <p style={styles.previewLabel}>ATS Score</p>
              <div style={styles.scoreBig}>{result.ats_score || 0}%</div>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${result.ats_score || 0}%`
                  }}
                ></div>
              </div>
              <p style={styles.scoreNote}>
                {(result.ats_score || 0) >= 80
                  ? "Excellent ATS readiness."
                  : (result.ats_score || 0) >= 60
                  ? "Good resume, but can be improved."
                  : "Low ATS compatibility. Improve structure and wording."}
              </p>
            </div>

            <div style={styles.resultCard}>
              <h3 style={styles.resultTitle}>Issues Found</h3>
              {result.issues && result.issues.length > 0 ? (
                <ul style={styles.suggestionList}>
                  {result.issues.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p style={styles.emptyText}>No major ATS issues found.</p>
              )}
            </div>

            <div style={styles.resultCard}>
              <h3 style={styles.resultTitle}>Quick Status</h3>
              <div style={styles.statusWrap}>
                <span style={styles.goodSkill}>Readable Format</span>
                <span style={styles.goodSkill}>Resume Parsed</span>
                <span style={styles.badSkill}>
                  {result.issues && result.issues.length > 0 ? "Needs Improvement" : "Well Optimized"}
                </span>
              </div>
            </div>

            <div style={styles.fullWidthCard}>
              <h3 style={styles.resultTitle}>Improvement Suggestions</h3>
              <ul style={styles.suggestionList}>
                {result.issues && result.issues.length > 0 ? (
                  result.issues.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <>
                    <li>Keep section headings clear and standard.</li>
                    <li>Use role-specific keywords naturally in projects and skills.</li>
                    <li>Maintain clean formatting without tables or complex graphics.</li>
                  </>
                )}
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
    background: "linear-gradient(180deg, #f8fbff 0%, #f5f7fb 100%)",
    padding: "40px 24px"
  },
  wrapper: {
    maxWidth: "1180px",
    margin: "0 auto"
  },
  hero: {
    textAlign: "center",
    marginBottom: "30px"
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
    lineHeight: 1.08,
    color: "#0f172a"
  },
  subtitle: {
    marginTop: "16px",
    color: "#64748b",
    fontSize: "18px",
    lineHeight: "1.7",
    maxWidth: "850px",
    marginInline: "auto"
  },
  topGrid: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: "20px",
    marginBottom: "24px"
  },
  leftCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)"
  },
  rightCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)"
  },
  cardTitle: {
    marginTop: 0,
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
  actionButton: {
    width: "100%",
    marginTop: "18px",
    padding: "16px",
    border: "none",
    borderRadius: "16px",
    background: "linear-gradient(90deg, #34d399, #4f46e5)",
    color: "white",
    fontWeight: "800",
    fontSize: "16px",
    cursor: "pointer"
  },
  featureItem: {
    padding: "12px 0",
    borderBottom: "1px solid #edf2f7",
    color: "#475569",
    fontSize: "17px"
  },
  resultsGrid: {
    display: "grid",
    gridTemplateColumns: "1.1fr 1fr 1fr",
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
    gridColumn: "span 3"
  },
  resultTitle: {
    marginTop: 0,
    color: "#0f172a"
  },
  suggestionList: {
    margin: 0,
    paddingLeft: "18px",
    color: "#475569",
    lineHeight: "1.9"
  },
  statusWrap: {
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
  }
}

export default ATSCheckerPage