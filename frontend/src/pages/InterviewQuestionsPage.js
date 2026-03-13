import { useState } from "react"

function InterviewQuestionsPage() {
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleGenerate = async () => {
    if (!role.trim()) {
      alert("Please enter a role")
      return
    }

    try {
      setLoading(true)

      const response = await fetch("http://127.0.0.1:8000/generate-interview-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ role })
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.detail || "Failed to generate questions")
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
          <div style={styles.badge}>AI Mock Prep</div>
          <h1 style={styles.title}>Interview Questions Generator</h1>
          <p style={styles.subtitle}>
            Enter a target role and generate technical, HR, and situational interview questions instantly.
          </p>
        </div>

        <div style={styles.formCard}>
          <label style={styles.label}>Target Role</label>
          <div style={styles.row}>
            <input
              style={styles.input}
              placeholder="Example: Data Analyst, Java Developer, HR Executive"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <button style={styles.button} onClick={handleGenerate}>
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        {result && (
          <div style={styles.grid}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Technical Questions</h3>
              <ul style={styles.list}>
                {result.technical.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>HR Questions</h3>
              <ul style={styles.list}>
                {result.hr.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div style={{ ...styles.card, gridColumn: "span 2" }}>
              <h3 style={styles.cardTitle}>Situational Questions</h3>
              <ul style={styles.list}>
                {result.situational.map((item, index) => (
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
    background: "#f6f9fc",
    padding: "40px 24px"
  },
  wrapper: {
    maxWidth: "1100px",
    margin: "0 auto"
  },
  hero: {
    textAlign: "center",
    marginBottom: "28px"
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
    fontSize: "52px",
    color: "#0f172a"
  },
  subtitle: {
    marginTop: "16px",
    color: "#64748b",
    fontSize: "18px",
    lineHeight: "1.7"
  },
  formCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)",
    marginBottom: "24px"
  },
  label: {
    display: "block",
    marginBottom: "10px",
    fontWeight: "700",
    color: "#111827"
  },
  row: {
    display: "flex",
    gap: "12px"
  },
  input: {
    flex: 1,
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none"
  },
  button: {
    padding: "14px 22px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(90deg, #34d399, #4f46e5)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px"
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)"
  },
  cardTitle: {
    marginTop: 0,
    color: "#0f172a"
  },
  list: {
    margin: 0,
    paddingLeft: "20px",
    color: "#475569",
    lineHeight: "1.9"
  }
}

export default InterviewQuestionsPage