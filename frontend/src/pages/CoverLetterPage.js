import { useState } from "react"

function CoverLetterPage() {
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [company, setCompany] = useState("")
  const [loading, setLoading] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")

  const handleGenerate = async () => {
    if (!name.trim() || !role.trim() || !company.trim()) {
      alert("Please fill all fields.")
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("name", name)
      formData.append("role", role)
      formData.append("company", company)

      const response = await fetch("http://127.0.0.1:8000/cover-letter", {
        method: "POST",
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.detail || "Failed to generate cover letter")
        return
      }

      setCoverLetter(data.cover_letter || "")
    } catch (error) {
      console.error(error)
      alert("Could not connect to backend")
    } finally {
      setLoading(false)
    }
  }

  const copyLetter = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter)
      alert("Cover letter copied")
    } catch {
      alert("Copy failed")
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.hero}>
          <div style={styles.badge}>AI Resume Tool</div>
          <h1 style={styles.title}>Cover Letter Generator</h1>
          <p style={styles.subtitle}>
            Generate a professional cover letter instantly using your name, target role, and company.
          </p>
        </div>

        <div style={styles.topGrid}>
          <div style={styles.leftCard}>
            <h3 style={styles.cardTitle}>Generate Cover Letter</h3>

            <div style={styles.formGroup}>
              <label style={styles.label}>Your Name</label>
              <input
                style={styles.input}
                placeholder="Example: Shrinidhi Naik"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Target Role</label>
              <input
                style={styles.input}
                placeholder="Example: Java Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Company Name</label>
              <input
                style={styles.input}
                placeholder="Example: Infosys"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <button style={styles.actionButton} onClick={handleGenerate}>
              {loading ? "Generating..." : "Generate Cover Letter"}
            </button>
          </div>

          <div style={styles.rightCard}>
            <h3 style={styles.cardTitle}>What you’ll get</h3>
            <div style={styles.featureItem}>Professional cover letter draft</div>
            <div style={styles.featureItem}>Role-focused application content</div>
            <div style={styles.featureItem}>Company-targeted introduction</div>
            <div style={styles.featureItem}>Ready-to-copy output</div>
            <div style={styles.featureItem}>Faster application workflow</div>
          </div>
        </div>

        {coverLetter && (
          <div style={styles.resultCard}>
            <div style={styles.resultTop}>
              <h3 style={styles.resultTitle}>Generated Cover Letter</h3>
              <button style={styles.copyButton} onClick={copyLetter}>
                Copy
              </button>
            </div>

            <pre style={styles.letterBox}>{coverLetter}</pre>
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
  actionButton: {
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
  featureItem: {
    padding: "12px 0",
    borderBottom: "1px solid #edf2f7",
    color: "#475569",
    fontSize: "17px"
  },
  resultCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)"
  },
  resultTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px"
  },
  resultTitle: {
    margin: 0,
    color: "#0f172a"
  },
  copyButton: {
    border: "none",
    background: "#eef2ff",
    color: "#4338ca",
    padding: "10px 14px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer"
  },
  letterBox: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontSize: "15px",
    color: "#475569",
    background: "#f8fbff",
    padding: "18px",
    borderRadius: "16px",
    lineHeight: "1.9",
    margin: 0
  }
}

export default CoverLetterPage