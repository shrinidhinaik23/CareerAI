import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "../firebase"

function PersonalizedTrackerPage() {
  const [currentUser, setCurrentUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [dataReady, setDataReady] = useState(false)

  const [courseName, setCourseName] = useState("")
  const [platform, setPlatform] = useState("YouTube")
  const [courseUrl, setCourseUrl] = useState("")
  const [totalLessons, setTotalLessons] = useState("")
  const [completedLessons, setCompletedLessons] = useState("")
  const [reminderDate, setReminderDate] = useState("")
  const [courses, setCourses] = useState([])
  const [loadingYoutube, setLoadingYoutube] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)

      try {
        if (user) {
          const userRef = doc(db, "users", user.uid)
          const snap = await getDoc(userRef)

          if (snap.exists()) {
            const data = snap.data()
            setCourses(data.learningTrackerCourses || [])
          } else {
            setCourses([])
          }
        } else {
          const saved = localStorage.getItem("learningTrackerCourses")
          setCourses(saved ? JSON.parse(saved) : [])
        }
      } catch (error) {
        console.error("Error loading tracker data:", error)
        setCourses([])
      } finally {
        setLoadingUser(false)
        setDataReady(true)
      }
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (!dataReady) return

    const saveData = async () => {
      try {
        if (currentUser) {
          const userRef = doc(db, "users", currentUser.uid)
          await setDoc(
            userRef,
            {
              email: currentUser.email,
              learningTrackerCourses: courses
            },
            { merge: true }
          )
        } else {
          localStorage.setItem("learningTrackerCourses", JSON.stringify(courses))
        }
      } catch (error) {
        console.error("Error saving tracker data:", error)
      }
    }

    saveData()
  }, [courses, currentUser, dataReady])

  const getYoutubeLessonCount = async (url) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/youtube-playlist-count?url=${encodeURIComponent(url)}`
      )

      const data = await res.json()

      if (!res.ok) {
        console.error(data)
        return 0
      }

      return data.total_videos || 0
    } catch (error) {
      console.error("YouTube API error:", error)
      return 0
    }
  }

  const addCourse = async () => {

  if (!courseName.trim()) {
    alert("Enter course name")
    return
  }

  if (!courseUrl.trim()) {
    alert("Enter course link")
    return
  }

  let finalTotalLessons = Number(totalLessons || 0)
  const finalCompletedLessons = Number(completedLessons || 0)

  // -------- SMART AUTO DETECT --------

  if (platform === "YouTube" && courseUrl.includes("playlist")) {

    setLoadingYoutube(true)

    const detectedLessons = await getYoutubeLessonCount(courseUrl)

    setLoadingYoutube(false)

    if (detectedLessons > 0) {
      finalTotalLessons = detectedLessons
    }

  }

  // Hackathon auto estimates
  if (platform === "Udemy" && finalTotalLessons === 0) {
    finalTotalLessons = 50
  }

  if (platform === "Coursera" && finalTotalLessons === 0) {
    finalTotalLessons = 40
  }

  if (platform === "Google" && finalTotalLessons === 0) {
    finalTotalLessons = 30
  }

  if (finalTotalLessons === 0) {
    finalTotalLessons = 25
  }

  if (finalCompletedLessons > finalTotalLessons) {
    alert("Completed lessons cannot exceed total lessons")
    return
  }

  const newCourse = {
    id: Date.now(),
    title: courseName.trim(),
    platform,
    url: courseUrl.trim(),
    totalLessons: finalTotalLessons,
    completedLessons: finalCompletedLessons,
    reminderDate
  }

  setCourses((prev) => [newCourse, ...prev])

  setCourseName("")
  setPlatform("YouTube")
  setCourseUrl("")
  setTotalLessons("")
  setCompletedLessons("")
  setReminderDate("")
}

  const deleteCourse = (id) => {
    setCourses((prev) => prev.filter((course) => course.id !== id))
  }

  const updateCompletedLessons = (id, value) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.id !== id) return course

        let nextValue = Number(value || 0)
        if (nextValue < 0) nextValue = 0
        if (nextValue > Number(course.totalLessons)) {
          nextValue = Number(course.totalLessons)
        }

        return {
          ...course,
          completedLessons: nextValue
        }
      })
    )
  }

  const getProgress = (course) => {
    if (!course.totalLessons) return 0
    return Math.round((Number(course.completedLessons) / Number(course.totalLessons)) * 100)
  }

  const getOverallProgress = () => {
    const total = courses.reduce((sum, course) => sum + Number(course.totalLessons || 0), 0)
    const completed = courses.reduce(
      (sum, course) => sum + Number(course.completedLessons || 0),
      0
    )

    if (total === 0) return 0
    return Math.round((completed / total) * 100)
  }

  const isDueToday = (date) => {
    if (!date) return false
    const today = new Date().toISOString().split("T")[0]
    return today === date
  }

  if (loadingUser) {
    return (
      <div style={styles.page}>
        <div style={styles.wrapper}>
          <p style={styles.emptyText}>Loading tracker...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.hero}>
          <div style={styles.badge}>Unique Student Feature</div>
          <h1 style={styles.title}>Personalized Learning Tracker</h1>
          <p style={styles.subtitle}>
            Add YouTube, Udemy, or Coursera courses, track lesson progress, and manage
            your learning journey like a course dashboard.
          </p>
        </div>

        <div style={styles.topGrid}>
          <div style={styles.formCard}>
            <h3 style={styles.cardTitle}>Add Course</h3>

            <div style={styles.formGrid}>
              <input
                style={styles.input}
                placeholder="Course name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />

              <select
                style={styles.input}
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                <option>YouTube</option>
                <option>Udemy</option>
                <option>Coursera</option>
                <option>Google</option>
              </select>

              <input
                style={styles.input}
                placeholder="Course or playlist link"
                value={courseUrl}
                onChange={(e) => setCourseUrl(e.target.value)}
              />

              <input
                style={styles.input}
                type="number"
                placeholder={
                  platform === "YouTube"
                    ? "Total lessons (auto for playlist)"
                    : "Total lessons"
                }
                value={totalLessons}
                onChange={(e) => setTotalLessons(e.target.value)}
              />

              <input
                style={styles.input}
                type="number"
                placeholder="Completed lessons"
                value={completedLessons}
                onChange={(e) => setCompletedLessons(e.target.value)}
              />

              <input
                style={styles.input}
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
              />
            </div>

            <button style={styles.button} onClick={addCourse}>
              {loadingYoutube ? "Detecting playlist lessons..." : "Add Course"}
            </button>

            <p style={styles.helperText}>
              Tip: For YouTube playlist links, total lessons can be detected automatically.
            </p>
          </div>

          <div style={styles.progressCard}>
            <p style={styles.progressLabel}>Overall Progress</p>
            <div style={styles.progressBig}>{getOverallProgress()}%</div>
            <div style={styles.progressBarDark}>
              <div
                style={{
                  ...styles.progressFillDark,
                  width: `${getOverallProgress()}%`
                }}
              ></div>
            </div>
            <p style={styles.progressNote}>
              {getOverallProgress() >= 80
                ? "Great consistency. Keep going."
                : getOverallProgress() >= 50
                ? "Good progress. Stay regular with your learning."
                : "Start small and build your learning habit."}
            </p>
          </div>
        </div>

        <div style={styles.listCard}>
          <h3 style={styles.cardTitle}>Your Courses</h3>

          {courses.length === 0 ? (
            <p style={styles.emptyText}>No courses added yet.</p>
          ) : (
            <div style={styles.courseList}>
              {courses.map((course) => (
                <div key={course.id} style={styles.courseCard}>
                  <div style={styles.courseTop}>
                    <div>
                      <h4 style={styles.courseTitle}>{course.title}</h4>
                      <p style={styles.courseMeta}>
                        {course.platform} • {course.completedLessons}/{course.totalLessons} lessons
                      </p>
                    </div>

                    <button style={styles.deleteButton} onClick={() => deleteCourse(course.id)}>
                      Delete
                    </button>
                  </div>

                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${getProgress(course)}%`
                      }}
                    />
                  </div>

                  <p style={styles.coursePercent}>{getProgress(course)}% complete</p>

                  <div style={styles.updateRow}>
                    <label style={styles.updateLabel}>Update completed lessons:</label>
                    <input
                      type="number"
                      min="0"
                      max={course.totalLessons}
                      value={course.completedLessons}
                      onChange={(e) => updateCompletedLessons(course.id, e.target.value)}
                      style={styles.smallInput}
                    />
                  </div>

                  <div style={styles.bottomRow}>
                    {course.url ? (
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.linkButton}
                      >
                        Open Course
                      </a>
                    ) : (
                      <span style={styles.noLink}>No link added</span>
                    )}

                    {isDueToday(course.reminderDate) ? (
                      <span style={styles.reminderBadge}>Reminder Due Today</span>
                    ) : course.reminderDate ? (
                      <span style={styles.reminderText}>Reminder: {course.reminderDate}</span>
                    ) : (
                      <span style={styles.reminderText}>No reminder set</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
  topGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: "20px",
    marginBottom: "24px"
  },
  formCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)"
  },
  progressCard: {
    background: "#0f172a",
    color: "#fff",
    borderRadius: "24px",
    padding: "24px"
  },
  cardTitle: {
    marginTop: 0,
    color: "#0f172a"
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px"
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none"
  },
  button: {
    marginTop: "14px",
    padding: "14px 22px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(90deg, #34d399, #4f46e5)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer"
  },
  helperText: {
    marginTop: "12px",
    marginBottom: 0,
    color: "#64748b",
    fontSize: "14px"
  },
  progressLabel: {
    marginTop: 0,
    color: "#cbd5e1",
    fontSize: "14px"
  },
  progressBig: {
    fontSize: "58px",
    fontWeight: "800",
    color: "#34d399",
    marginBottom: "14px"
  },
  progressBarDark: {
    width: "100%",
    height: "10px",
    background: "#334155",
    borderRadius: "999px",
    overflow: "hidden",
    marginBottom: "16px"
  },
  progressFillDark: {
    height: "100%",
    background: "linear-gradient(90deg, #34d399, #4f46e5)"
  },
  progressNote: {
    color: "#cbd5e1",
    lineHeight: "1.7",
    marginBottom: 0
  },
  listCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)"
  },
  courseList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  courseCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "18px",
    background: "#f8fbff"
  },
  courseTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "start"
  },
  courseTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "20px"
  },
  courseMeta: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "14px"
  },
  progressBar: {
    width: "100%",
    height: "8px",
    background: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
    marginTop: "12px"
  },
  progressFill: {
    height: "100%",
    background: "#4f46e5"
  },
  coursePercent: {
    marginTop: "10px",
    marginBottom: "14px",
    fontWeight: "700",
    color: "#0f172a"
  },
  updateRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "14px",
    flexWrap: "wrap"
  },
  updateLabel: {
    color: "#475569",
    fontWeight: "600"
  },
  smallInput: {
    width: "120px",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none"
  },
  bottomRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center"
  },
  linkButton: {
    textDecoration: "none",
    background: "#dcfce7",
    color: "#166534",
    padding: "10px 14px",
    borderRadius: "12px",
    fontWeight: "700",
    display: "inline-block"
  },
  noLink: {
    color: "#64748b",
    fontWeight: "600"
  },
  deleteButton: {
    border: "none",
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px 14px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer"
  },
  reminderBadge: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "13px"
  },
  reminderText: {
    color: "#475569",
    fontWeight: "600",
    fontSize: "14px"
  },
  emptyText: {
    color: "#64748b",
    margin: 0
  }
}

export default PersonalizedTrackerPage