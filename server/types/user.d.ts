enum PROBLEM_STATUS{
    ATTEMPTED,
    SOLVED
}

interface Attempt {
    course_id: number,
    section_id: number,
    problem_id: number,
    status: "ATTEMPTED" | "SOLVED"
}

interface User extends Express.User {
    id: number;
    name: string;
    email: string;
    password: string;
    preferred_coding_language: string;
    language: string;
    attempts: [Attempt]
}