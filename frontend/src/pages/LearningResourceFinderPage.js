import { useState, useEffect } from "react"

function LearningResourceFinderPage() {
  const [skill, setSkill] = useState(localStorage.getItem("lastMissingSkill")||"")
  const [results, setResults] = useState([])
    useEffect(() => {
  const savedSkill = localStorage.getItem("lastMissingSkill")

  if (savedSkill) {
    const encoded = encodeURIComponent(savedSkill)

    setResults([
      {
        platform: "YouTube",
        title: `${savedSkill} video tutorials`,
        url: `https://www.youtube.com/results?search_query=${encoded}+course`
      },
      {
        platform: "Coursera",
        title: `${savedSkill} professional courses`,
        url: `https://www.coursera.org/search?query=${encoded}`
      },
      {
        platform: "Udemy",
        title: `${savedSkill} bootcamps`,
        url: `https://www.udemy.com/courses/search/?q=${encoded}`
      },
      {
        platform: "Google",
        title: `More ${savedSkill} learning resources`,
        url: `https://www.google.com/search?q=${encoded}+course`
      }
    ])
  }
}, [])
  const handleSearch = () => {
    const value = skill.trim()
    if (!value) {
      alert("Please enter a skill")
      return
    }

    const encoded = encodeURIComponent(value)

    setResults([
      {
        platform: "YouTube",
        title: `${value} video tutorials`,
        url: `https://www.youtube.com/results?search_query=${encoded}+course`
      },
      {
        platform: "Coursera",
        title: `${value} professional courses`,
        url: `https://www.coursera.org/search?query=${encoded}`
      },
      {
        platform: "Udemy",
        title: `${value} bootcamps`,
        url: `https://www.udemy.com/courses/search/?q=${encoded}`
      },
      {
        platform: "Google",
        title: `More ${value} learning resources`,
        url: `https://www.google.com/search?q=${encoded}+course`
      }
    ])
  }

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.hero}>
          <div style={styles.badge}>Smart Learning Tool</div>
          <h1 style={styles.title}>Skill Learning Assistant</h1>
         <p style={styles.subtitle}>
  Explore the best videos and courses for any missing skill from your resume analysis.
  Learn faster with curated links from YouTube, Coursera, Udemy, and Google.
</p>
        </div>

        <div style={styles.card}>
          <label style={styles.label}>Enter Skill</label>
          <div style={styles.row}>
            <input
              style={styles.input}
              placeholder="Example: Docker, AWS, Excel, Pharmacology"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />
            <button style={styles.button} onClick={handleSearch}>
              Find Resources
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div style={styles.resultsCard}>
            <h2 style={styles.resultsTitle}>Recommended Resources</h2>

            <div style={styles.grid}>
              {results.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.linkCard}
                >
                  <div style={styles.platform}>{item.platform}</div>
                  <div style={styles.linkTitle}>{item.title}</div>
                </a>
              ))}
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
    marginBottom: "32px"
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
    lineHeight: 1.1,
    color: "#0f172a"
  },
  subtitle: {
    marginTop: "16px",
    color: "#64748b",
    fontSize: "18px",
    lineHeight: 1.7
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)"
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
  resultsCard: {
    marginTop: "24px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)"
  },
  resultsTitle: {
    marginTop: 0,
    color: "#0f172a"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px"
  },
  linkCard: {
    textDecoration: "none",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "18px",
    background: "#f8fbff"
  },
  platform: {
    color: "#4f46e5",
    fontWeight: "700",
    marginBottom: "8px"
  },
  linkTitle: {
    color: "#0f172a",
    fontWeight: "600"
  }
}

export default LearningResourceFinderPage