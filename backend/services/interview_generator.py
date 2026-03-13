def generate_questions(role):

    role = role.lower()

    questions = {
        "python developer": [
            "What are Python decorators?",
            "Explain list vs tuple",
            "What is GIL in Python?"
        ],

        "data scientist": [
            "What is supervised learning?",
            "Explain overfitting",
            "What is feature engineering?"
        ],

        "data analyst": [
            "What is data cleaning?",
            "Explain SQL joins",
            "What is data visualization?"
        ]
    }

    return questions.get(role, ["Tell me about yourself", "Why should we hire you?"])