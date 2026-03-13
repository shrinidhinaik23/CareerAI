import { useState } from "react"
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup
} from "firebase/auth"
import { auth, googleProvider } from "../firebase"
import { Link, useNavigate } from "react-router-dom"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/")
    } catch (err) {
      setError("Invalid email or password")
    }

    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setError("")
    try {
      await signInWithPopup(auth, googleProvider)
      navigate("/")
    } catch (err) {
      setError("Google login failed")
    }
  }

  const handleResetPassword = async () => {
    if (!email) {
      alert("Please enter your email first")
      return
    }

    try {
      await sendPasswordResetEmail(auth, email)
      alert("Reset email sent. Check inbox, spam, or promotions.")
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        alert("No account found with this email.")
      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email address.")
      } else {
        alert("Failed to send reset email. Please try again.")
      }
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Login to continue using Airesume</p>

        <button type="button" style={styles.googleButton} onClick={handleGoogleLogin}>
          Continue with Google
        </button>

        <div style={styles.divider}>or</div>

        <form onSubmit={handleLogin}>
          <label style={styles.label}>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label style={styles.label}>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <p style={styles.forgot} onClick={handleResetPassword}>
            Forgot password?
          </p>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.footerText}>
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8fbff",
    padding: "30px"
  },

  card: {
    width: "100%",
    maxWidth: "430px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "22px",
    padding: "32px",
    boxShadow: "0 16px 40px rgba(15,23,42,0.08)"
  },

  title: {
    margin: 0,
    fontSize: "34px",
    color: "#111827"
  },

  subtitle: {
    marginTop: "10px",
    marginBottom: "24px",
    color: "#6b7280"
  },

  googleButton: {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#111827",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer"
  },

  divider: {
    textAlign: "center",
    margin: "18px 0",
    color: "#94a3b8",
    fontWeight: "600"
  },

  label: {
    display: "block",
    marginBottom: "8px",
    marginTop: "14px",
    fontWeight: "600",
    color: "#111827"
  },

  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none"
  },

  forgot: {
    marginTop: "8px",
    fontSize: "14px",
    color: "#4f46e5",
    cursor: "pointer"
  },

  button: {
    width: "100%",
    marginTop: "22px",
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer"
  },

  error: {
    color: "#dc2626",
    marginTop: "12px",
    marginBottom: 0
  },

  footerText: {
    marginTop: "18px",
    textAlign: "center",
    color: "#6b7280"
  }
}

export default LoginPage