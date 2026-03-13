import { useState } from "react"

function FloatingChatbotButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={styles.chatButton}
        title="Open Chatbot"
      >
        💬
      </button>

      {open && (
        <div style={styles.chatWindow}>
          <div style={styles.chatHeader}>
            <span>AI Resume Assistant</span>
            <button onClick={() => setOpen(false)} style={styles.closeButton}>
              ×
            </button>
          </div>

          <iframe
            src="http://localhost:5500"
            title="Airesume Chatbot"
            style={styles.iframe}
          />
        </div>
      )}
    </>
  )
}

const styles = {
  chatButton: {
    position: "fixed",
    right: "20px",   // 👈 changed from left
    bottom: "20px",
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(90deg, #34d399, #4f46e5)",
    color: "#ffffff",
    fontSize: "28px",
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.25)",
    zIndex: 9999
  },

  chatWindow: {
    position: "fixed",
    right: "20px",   // 👈 changed from left
    bottom: "95px",
    width: "360px",
    height: "520px",
    background: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.25)",
    overflow: "hidden",
    zIndex: 9999,
    border: "1px solid #e5e7eb"
  },

  chatHeader: {
    height: "56px",
    background: "#4f46e5",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    fontWeight: "700"
  },

  closeButton: {
    background: "transparent",
    border: "none",
    color: "#ffffff",
    fontSize: "22px",
    cursor: "pointer"
  },

  iframe: {
    width: "100%",
    height: "calc(100% - 56px)",
    border: "none"
  }
}

export default FloatingChatbotButton