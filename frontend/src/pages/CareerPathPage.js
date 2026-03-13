import { useState } from "react"

function CareerPathPage() {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFile = (e) => {
    const selected = e.target.files && e.target.files[0]
    if (!selected) return

    setFile(selected)
    setFileName(selected.name)
  }

  const analyzeCareerPath = async () => {
    if (!file) {
      alert("Please upload your resume")
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("http://127.0.0.1:8000/career-path", {
        method: "POST",
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.detail || "Failed to analyze career path")
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
          <div style={styles.badge}>AI Career Tool</div>
          <h1 style={styles.title}>Career Path Analyzer</h1>
          <p style={styles.subtitle}>
            Upload your resume and discover your best-fit roles, skill match percentage,
            missing skills, and future career growth path.
          </p>
        </div>

        <div style={styles.topGrid}>
          <div style={styles.uploadCard}>
            <h3 style={styles.cardTitle}>Upload Resume</h3>

            <label style={styles.uploadArea}>
              <div style={styles.uploadIcon}>↑</div>
              <p style={styles.uploadMain}>Click to upload your resume</p>
              <p style={styles.uploadSub}>PDF format recommended</p>
              <span style={styles.uploadButton}>Choose Resume</span>
              <input type="file" onChange={handleFile} style={{ display: "none" }} />
            </label>

            {fileName && <p style={styles.fileName}>Uploaded: {fileName}</p>}

            <button style={styles.analyzeButton} onClick={analyzeCareerPath}>
              {loading ? "Analyzing..." : "Analyze Career Path"}
            </button>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>What you’ll get</h3>
            <div style={styles.featureItem}>Top matching career roles</div>
            <div style={styles.featureItem}>Role-wise match percentage</div>
            <div style={styles.featureItem}>Matched and missing skills</div>
            <div style={styles.featureItem}>Career growth roadmap</div>
            <div style={styles.featureItem}>Resume-driven career suggestions</div>
          </div>
        </div>

        {result && (
          <>
            <div style={styles.skillsCard}>
              <h3 style={styles.cardTitle}>Your Current Skills</h3>
              <div style={styles.skillWrap}>
                {result.current_skills && result.current_skills.length > 0 ? (
                  result.current_skills.map((skill, index) => (
                    <span key={index} style={styles.goodSkill}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <p style={styles.emptyText}>No skills found.</p>
                )}
              </div>
            </div>

            <div style={styles.rolesGrid}>
              {result.recommended_roles.map((item, index) => (
                <div key={index} style={styles.roleCard}>
                  <div style={styles.roleTop}>
                    <h3 style={styles.roleTitle}>{item.role}</h3>
                    <span style={styles.scoreBadge}>{item.match_score}% Match</span>
                  </div>

                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${item.match_score}%`
                      }}
                    ></div>
                  </div>

                  <div style={styles.section}>
                    <h4 style={styles.sectionTitle}>Matched Skills</h4>
                    <div style={styles.skillWrap}>
                      {item.matched_skills.length > 0 ? (
                        item.matched_skills.map((skill, idx) => (
                          <span key={idx} style={styles.goodSkill}>
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p style={styles.emptyText}>No matched skills</p>
                      )}
                    </div>
                  </div>

                  <div style={styles.section}>
                    <h4 style={styles.sectionTitle}>Missing Skills</h4>
                    <div style={styles.skillWrap}>
                      {item.missing_skills.length > 0 ? (
                        item.missing_skills.map((skill, idx) => (
                          <span key={idx} style={styles.badSkill}>
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p style={styles.emptyText}>No missing skills</p>
                      )}
                    </div>
                  </div>

                  <div style={styles.section}>
                    <h4 style={styles.sectionTitle}>Career Growth Path</h4>
                    <div style={styles.growthPath}>
                      {item.career_growth.map((step, idx) => (
                        <span key={idx} style={styles.growthStep}>
                          {step}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
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
  uploadCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)"
  },
  infoCard: {
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
  analyzeButton: {
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
  skillsCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    padding: "22px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)",
    marginBottom: "24px"
  },
  rolesGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px"
  },
  roleCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    padding: "22px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)"
  },
  roleTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px"
  },
  roleTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "24px"
  },
  scoreBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "13px",
    whiteSpace: "nowrap"
  },
  progressBar: {
    width: "100%",
    height: "10px",
    background: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
    marginBottom: "16px"
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #34d399, #4f46e5)"
  },
  section: {
    marginTop: "18px"
  },
  sectionTitle: {
    margin: "0 0 10px",
    color: "#0f172a",
    fontSize: "18px"
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
  growthPath: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px"
  },
  growthStep: {
    padding: "8px 12px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#4338ca",
    fontSize: "13px",
    fontWeight: "600"
  },
  emptyText: {
    color: "#64748b",
    margin: 0
  }
}

export default CareerPathPage