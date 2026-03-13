import { useState } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth"
import { auth, googleProvider, db } from "../firebase"
import { Link, useNavigate } from "react-router-dom"
import { doc, setDoc } from "firebase/firestore"

function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  // ==============================
  // EMAIL SIGNUP
  // ==============================
  const handleSignup = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        plan: "free",
        analysesUsed: 0,
        createdAt: new Date().toISOString()
      })

      navigate("/")
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered")
      } else {
        setError("Could not create account")
      }
    } finally {
      setLoading(false)
    }
  }

  // ==============================
  // GOOGLE SIGNUP
  // ==============================
  const handleGoogleSignup = async () => {
    setError("")

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      await setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          plan: "free",
          analysesUsed: 0,
          createdAt: new Date().toISOString()
        },
        { merge: true }
      )

      navigate("/")
    } catch (err) {
      setError("Google signup failed")
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create your account</h1>
        <p style={styles.subtitle}>Start using Airesume with your own profile</p>

        <button type="button" style={styles.googleButton} onClick={handleGoogleSignup}>
          Continue with Google
        </button>

        <div style={styles.divider}>or</div>

        <form onSubmit={handleSignup}>
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
            placeholder="Create password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label style={styles.label}>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
            style={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account? <Link to="/login">Login</Link>
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

export default SignupPage