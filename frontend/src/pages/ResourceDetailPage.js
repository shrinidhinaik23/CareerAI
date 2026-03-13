import { Link, useParams } from "react-router-dom"
import { resources } from "../data/resourcesData"

function ResourceDetailPage() {
  const { slug } = useParams()

  const resource = resources.find((item) => item.slug === slug)

  if (!resource) {
    return (
      <div style={styles.page}>
        <div style={styles.wrapper}>
          <h1 style={styles.notFoundTitle}>Tool not found</h1>
          <p style={styles.notFoundText}>
            The resource you are trying to open does not exist.
          </p>

          <Link to="/resources" style={styles.backButton}>
            Back to Resources
          </Link>
        </div>
      </div>
    )
  }

  const getToolLink = () => {

    if (resource.slug === "personalized-tracker") {
      return "/resources/personalized-tracker"
    }

    if (resource.slug === "interview-questions-generator") {
      return "/resources/interview-questions-generator"
    }

    if (resource.slug === "career-path-analyzer") {
      return "/resources/career-path-analyzer"
    }

    if (resource.slug === "resume-keyword-scanner") {
      return "/resources/resume-keyword-scanner"
    }

    if (resource.slug === "skills-gap-analyzer") {
      return "/"
    }

    if (resource.slug === "linkedin-profile-optimizer") {
      return "/resources/linkedin-profile-optimizer"
    }










    if (resource.slug === "ats-resume-checker") {
      return "/resources/ats-resume-checker"
    }

    if (resource.slug === "job-match-score") {
      return "/resources/job-match-score"
    }

    if (resource.slug === "cover-letter-generator") {
      return "/reources/cover-letter-generator"
    }

    if (resource.slug === "resume-readability-checker") {
      return "/resources/resume-readability-checker"
    }

    return "/resources"
  }

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.hero}>
          <div style={styles.iconBox}>{resource.icon}</div>

          <div>
            <div style={styles.badge}>AI Resume Tool</div>
            <h1 style={styles.title}>{resource.title}</h1>
            <p style={styles.subtitle}>{resource.subtitle}</p>
          </div>
        </div>

        <div style={styles.contentCard}>
          <h2 style={styles.sectionTitle}>About this tool</h2>
          <p style={styles.description}>{resource.description}</p>

          <div style={styles.featureBox}>
            <h3 style={styles.featureTitle}>What this tool helps you do</h3>

            <ul style={styles.featureList}>
              <li>Understand your current profile better</li>
              <li>Get role-based improvement guidance</li>
              <li>Build a stronger resume and career plan</li>
              <li>Take action using personalized suggestions</li>
            </ul>
          </div>

          <div style={styles.buttonRow}>
            <Link to={getToolLink()} style={styles.tryButton}>
              Try This Tool
            </Link>

            <Link to="/resources" style={styles.backButton}>
              Back to Resources
            </Link>
          </div>
        </div>
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
    display: "flex",
    gap: "20px",
    alignItems: "center",
    marginBottom: "24px"
  },

  iconBox: {
    width: "88px",
    height: "88px",
    borderRadius: "24px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "38px",
    flexShrink: 0
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
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)"
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: "12px",
    color: "#0f172a",
    fontSize: "24px"
  },

  description: {
    color: "#475569",
    fontSize: "17px",
    lineHeight: "1.8",
    marginBottom: "24px"
  },

  featureBox: {
    background: "#f8fbff",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    padding: "20px",
    marginBottom: "28px"
  },

  featureTitle: {
    marginTop: 0,
    color: "#0f172a",
    fontSize: "20px"
  },

  featureList: {
    margin: 0,
    paddingLeft: "20px",
    color: "#475569",
    lineHeight: "2"
  },

  buttonRow: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap"
  },

  tryButton: {
    textDecoration: "none",
    background: "linear-gradient(90deg, #34d399, #4f46e5)",
    color: "#ffffff",
    padding: "14px 22px",
    borderRadius: "14px",
    fontWeight: "700",
    display: "inline-block"
  },

  backButton: {
    textDecoration: "none",
    background: "#ffffff",
    color: "#0f172a",
    padding: "14px 22px",
    borderRadius: "14px",
    fontWeight: "700",
    border: "1px solid #d1d5db",
    display: "inline-block"
  },

  notFoundTitle: {
    marginTop: 0,
    color: "#0f172a"
  },

  notFoundText: {
    color: "#64748b",
    marginBottom: "20px"
  }
}

export default ResourceDetailPage