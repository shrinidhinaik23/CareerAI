import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"

function Navbar() {
  const location = useLocation()
  const { currentUser, logout } = useAuth()
  const [plan, setPlan] = useState("")

  // ==============================
  // LOAD USER PLAN
  // ==============================
  useEffect(() => {
    const loadPlan = async () => {
      if (!currentUser) {
        setPlan("")
        return
      }

      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid))
        if (snap.exists()) {
          setPlan(snap.data().plan || "free")
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadPlan()
  }, [currentUser])

  // ==============================
  // LOGOUT
  // ==============================
  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      alert("Failed to logout")
    }
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        Career AI
      </Link>

      <div className="nav-center">
        <Link
          to="/resources"
          className={location.pathname.startsWith("/resources") ? "nav-link active" : "nav-link"}
        >
          Resources
        </Link>

        <Link
  to="/tools/learning-resource-finder"
  className={location.pathname.startsWith("/tools") ? "nav-link active" : "nav-link"}
>
  Tools
</Link>

        <Link
          to="/pricing"
          className={location.pathname === "/pricing" ? "nav-link active" : "nav-link"}
        >
          Pricing
        </Link>
      </div>

      <div className="nav-right">
        {currentUser ? (
          <>
            <span style={styles.planText}>
              {plan ? `Plan: ${plan}` : ""}
            </span>

            <span style={styles.userEmail}>
              {currentUser.email}
            </span>

            <button className="btn btn-light" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-light">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Get Started
            </Link>
          </>
        )}
      </div>
      
    </nav>
  )
}

const styles = {
  planText: {
    fontSize: "13px",
    color: "#4f46e5",
    marginRight: "10px",
    fontWeight: "700"
  },
  userEmail: {
    fontSize: "14px",
    color: "#475569",
    marginRight: "10px"
  }
}

export default Navbar