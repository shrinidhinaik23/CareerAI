from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class RoleRequest(BaseModel):
    role: str


@router.post("/generate-interview-questions")
def generate_questions(data: RoleRequest):

    role = data.role.lower()

    technical = [
        f"What programming languages are commonly used for {role}?",
        f"Explain a project where you applied {role} skills.",
        f"What tools or frameworks are important for a {role}?",
        f"How do you debug problems in a {role} workflow?"
    ]

    hr = [
        "Tell me about yourself.",
        "Why are you interested in this role?",
        "What are your strengths and weaknesses?",
        "Where do you see yourself in 5 years?"
    ]

    situational = [
        "Describe a challenging problem you solved.",
        "How do you handle tight deadlines?",
        "Explain a time you worked in a team.",
        "How do you handle failure in a project?"
    ]

    return {
        "technical": technical,
        "hr": hr,
        "situational": situational
    }