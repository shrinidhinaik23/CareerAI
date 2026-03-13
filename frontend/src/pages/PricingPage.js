import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../firebase"
import { useAuth } from "../context/AuthContext"

function PricingPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [loadingPlan, setLoadingPlan] = useState("")

  const requireLogin = () => {
    if (!currentUser) {
      alert("Please login first.")
      navigate("/login")
      return false
    }
    return true
  }

  const setFreePlan = async () => {
    if (!requireLogin()) return

    try {
      setLoadingPlan("free")

      const userRef = doc(db, "users", currentUser.uid)
      const snap = await getDoc(userRef)

      if (!snap.exists()) {
        await setDoc(userRef, {
          email: currentUser.email,
          plan: "free",
          analysesUsed: 0,
          createdAt: new Date().toISOString()
        })
      } else {
        await updateDoc(userRef, {
          plan: "free"
        })
      }

      alert("Free plan activated")
      navigate("/")
    } catch (error) {
      console.error(error)
      alert("Failed to activate free plan")
    } finally {
      setLoadingPlan("")
    }
  }

  const startRazorpayPayment = async (planName) => {
    if (!requireLogin()) return

    try {
      setLoadingPlan(planName)

      const response = await fetch("http://127.0.0.1:8000/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          plan: planName,
          userId: currentUser.uid,
          email: currentUser.email
        })
      })

      const data = await response.json()
      console.log("Create order response:", data)

      if (!data.orderId) {
        alert(data.detail || "Failed to create order")
        return
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Airesume",
        description: planName === "pro" ? "Pro Plan" : "Career Plus Plan",
        order_id: data.orderId,
        handler: async function (paymentResponse) {
          try {
            const verifyRes = await fetch("http://127.0.0.1:8000/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                userId: currentUser.uid,
                email: currentUser.email,
                plan: planName
              })
            })

            const verifyData = await verifyRes.json()
            console.log("Verify payment response:", verifyData)

            if (verifyData.success) {
              alert("Payment successful. Plan activated.")
              navigate("/")
            } else {
              alert(verifyData.detail || verifyData.message || "Payment verification failed.")
            }
          } catch (error) {
            console.error(error)
            alert("Verification failed")
          }
        },
        prefill: {
          email: currentUser.email
        },
        theme: {
          color: "#4f46e5"
        },
        modal: {
          ondismiss: function () {
            setLoadingPlan("")
          }
        }
      }

      const razor = new window.Razorpay(options)
      razor.open()
    } catch (error) {
      console.error(error)
      alert("Payment start failed")
    } finally {
      setLoadingPlan("")
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.top}>
          <h1 style={styles.heading}>Simple pricing for every stage</h1>
          <p style={styles.subheading}>
            Start free and upgrade when you need deeper insights, more analysis,
            and advanced career tools.
          </p>
        </div>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h3 style={styles.planTitle}>Starter</h3>
            <h2 style={styles.price}>Free</h2>
            <p style={styles.planText}>Good for trying core features</p>

            <ul style={styles.list}>
              <li>Basic resume checks</li>
              <li>Limited tool access</li>
              <li>Starter recommendations</li>
            </ul>

            <button
              style={styles.lightBtn}
              onClick={setFreePlan}
              disabled={loadingPlan === "free"}
            >
              {loadingPlan === "free" ? "Updating..." : "Start Free"}
            </button>
          </div>

          <div style={styles.featuredCard}>
            <div style={styles.badge}>Most Popular</div>
            <h3 style={styles.planTitleDark}>Pro</h3>
            <h2 style={styles.priceDark}>₹499</h2>
            <p style={styles.planTextDark}>For regular career optimization</p>

            <ul style={styles.listDark}>
              <li>Full resource access</li>
              <li>Advanced analysis</li>
              <li>Better recommendations</li>
              <li>More role-based insights</li>
            </ul>

            <button
              style={styles.darkBtn}
              onClick={() => startRazorpayPayment("pro")}
              disabled={loadingPlan === "pro"}
            >
              {loadingPlan === "pro" ? "Opening..." : "Upgrade"}
            </button>
          </div>

          <div style={styles.card}>
            <h3 style={styles.planTitle}>Career Plus</h3>
            <h2 style={styles.price}>₹999</h2>
            <p style={styles.planText}>For intensive applicants and planners</p>

            <ul style={styles.list}>
              <li>Everything in Pro</li>
              <li>Priority reports</li>
              <li>Advanced guidance</li>
              <li>More export options</li>
            </ul>

            <button
              style={styles.lightBtn}
              onClick={() => startRazorpayPayment("career_plus")}
              disabled={loadingPlan === "career_plus"}
            >
              {loadingPlan === "career_plus" ? "Opening..." : "Choose Plan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    padding: "40px 24px"
  },
  wrapper: {
    maxWidth: "1280px",
    margin: "0 auto"
  },
  top: {
    textAlign: "center",
    marginBottom: "40px"
  },
  heading: {
    margin: 0,
    fontSize: "64px",
    lineHeight: 1.1,
    color: "#0f172a"
  },
  subheading: {
    marginTop: "18px",
    fontSize: "18px",
    color: "#64748b"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "22px"
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "28px",
    padding: "30px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.04)"
  },
  featuredCard: {
    background: "#0b1736",
    borderRadius: "28px",
    padding: "30px",
    position: "relative",
    color: "#ffffff",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.18)"
  },
  badge: {
    position: "absolute",
    top: "-14px",
    right: "24px",
    background: "#635bff",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: "700"
  },
  planTitle: {
    margin: 0,
    fontSize: "24px",
    color: "#0f172a"
  },
  planTitleDark: {
    margin: 0,
    fontSize: "24px",
    color: "#ffffff"
  },
  price: {
    margin: "20px 0 12px",
    fontSize: "64px",
    color: "#0f172a"
  },
  priceDark: {
    margin: "20px 0 12px",
    fontSize: "64px",
    color: "#ffffff"
  },
  planText: {
    color: "#64748b",
    fontSize: "18px",
    marginBottom: "24px"
  },
  planTextDark: {
    color: "#dbe3f0",
    fontSize: "18px",
    marginBottom: "24px"
  },
  list: {
    color: "#334155",
    lineHeight: "2",
    paddingLeft: "24px",
    minHeight: "180px"
  },
  listDark: {
    color: "#eff6ff",
    lineHeight: "2",
    paddingLeft: "24px",
    minHeight: "180px"
  },
  lightBtn: {
    width: "100%",
    padding: "16px",
    borderRadius: "18px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#0f172a",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer"
  },
  darkBtn: {
    width: "100%",
    padding: "16px",
    borderRadius: "18px",
    border: "none",
    background: "#5b4df7",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer"
  }
}

export default PricingPage