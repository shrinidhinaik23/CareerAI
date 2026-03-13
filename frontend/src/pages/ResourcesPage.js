import { Link } from "react-router-dom"
import { resources } from "../data/resourcesData"

function ResourcesPage() {
  return (
    <div className="page resources-page">
      <section className="resources-hero">
        <h1>Explore Career Resources</h1>
        <p>
          Choose a tool to improve resumes, job applications, interview prep,
          and professional visibility.
        </p>
      </section>

      <section className="resources-grid-wrap">
        <div className="resources-grid">
          {resources.map((item) => (
            <Link
              key={item.slug}
              to={`/resources/${item.slug}`}
              className="resource-card"
            >
              <div className="resource-icon">{item.icon}</div>

              <div>
                <h3 className="resource-title">{item.title}</h3>
                <p className="resource-subtitle">{item.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ResourcesPage