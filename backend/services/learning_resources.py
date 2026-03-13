def get_learning_resources(missing_skills):
    results = []

    for skill in missing_skills:
        skill_clean = skill.lower().strip()

        youtube = f"https://www.youtube.com/results?search_query={skill_clean}+course"
        coursera = f"https://www.coursera.org/search?query={skill_clean}"
        udemy = f"https://www.udemy.com/courses/search/?q={skill_clean}"
        edx = f"https://www.edx.org/search?q={skill_clean}"
        google = f"https://www.google.com/search?q={skill_clean}+course"

        results.append({
            "skill": skill,
            "resources": [
                {
                    "title": f"Learn {skill} - Video Course",
                    "platform": "YouTube",
                    "type": "Video",
                    "url": youtube
                },
                {
                    "title": f"{skill} Professional Course",
                    "platform": "Coursera",
                    "type": "Course",
                    "url": coursera
                },
                {
                    "title": f"{skill} Bootcamp",
                    "platform": "Udemy",
                    "type": "Course",
                    "url": udemy
                },
                {
                    "title": f"{skill} Certification",
                    "platform": "edX",
                    "type": "Course",
                    "url": edx
                },
                {
                    "title": f"More {skill} Learning Resources",
                    "platform": "Google",
                    "type": "Search",
                    "url": google
                }
            ]
        })

    return results