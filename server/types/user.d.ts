enum PROBLEM_STATUS{
    ATTEMPTED,
    SOLVED
}

interface Attempt {
    problem_id: number,
    status: PROBLEM_STATUS
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