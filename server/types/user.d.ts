enum PROBLEM_STATUS{
    ATTEMPTED,
    SOLVED
}

interface Attempt {
    problem_id: number,
    status: PROBLEM_STATUS
}

interface User extends Express.User {
    name: string;
    email: string;
    password: string;
    preferred_coding_language: string;
    language: string;
    attempts: [Attempt]
}


declare global {
    namespace Express {
        interface Request {
        user?: User; // Override the default Express.User with your custom User type
        }
    }
}