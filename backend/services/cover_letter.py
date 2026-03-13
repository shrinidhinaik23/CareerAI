def generate_cover_letter(name: str, role: str, company: str):
    name = name.strip()
    role = role.strip()
    company = company.strip()

    letter = f"""Dear Hiring Manager,

I am writing to express my interest in the {role} position at {company}. I am excited about the opportunity to contribute my skills, enthusiasm, and dedication to your team.

With a strong interest in {role} and a passion for continuous learning, I have developed a solid foundation in relevant technical and problem-solving skills through academics, projects, and practical experience. I enjoy working on real-world challenges, collaborating with teams, and building solutions that create meaningful impact.

I am particularly interested in {company} because of its reputation, growth opportunities, and commitment to innovation. I believe this role would be an excellent opportunity for me to further strengthen my skills while contributing positively to your organization.

I would welcome the opportunity to discuss how my background, motivation, and potential align with your requirements. Thank you for considering my application. I look forward to the possibility of contributing to {company}.

Sincerely,  
{name}
"""
    return letter