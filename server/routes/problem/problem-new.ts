import express from "express";
import axios from "axios"
import { CourseModel, DbCourse } from "../../models/problem-model";
import authFilter from "../../middlewares/auth-filter"
import { UsersModel, DbUser } from "../../models/user-model";


const problem_new = express.Router();
const judgeApiKey = process.env.JUDGE_API_KEY ?? ""


problem_new.get("/course", authFilter, async (req, res) => {
    try {
        const user = req.user as User; // User information from session
        const courseId = parseInt(req.query.courseId as string, 10); // Get courseId from query param

        const course = await CourseModel.findOne({ id: courseId }).populate('sections.problems');
        if (!course) {
            res.status(400).send("The requested course doesn't exist")
            return;
        }
        // TODO(Din): Update data model to contain course metadata
        const courseMetadata = {
            level: "Beginner",
            timeToComplete: 25,
            prerequisites: []
        }

        // Construct the response object
        const response = {
            id: course.id,
            title: course.title,
            short_description: course.short_description,
            description: course.description,
            skills: course.skills,
            metadata: courseMetadata,
            sections: course.sections.map(section => {
                // Extract section properties
                const { id, title, short_description, problems } = section;

                // Construct problems info
                const problemsInfo = problems.map(problem => ({
                    id: problem.id,
                    name: problem.name,
                    difficulty: problem.difficulty,
                    isSolved: user.attempts.some(attempt =>
                        attempt.course_id === courseId &&
                        attempt.section_id === section.id && 
                        attempt.problem_id === problem.id && 
                        attempt.status === "SOLVED"
                    ),
                }));

                return {
                    id,
                    title,
                    short_description,
                    problems: problemsInfo,
                };
            }),
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

problem_new.get("/course-end", authFilter, async (req, res) => {
    try {
        const user = req.user as User; 
        // TODO(Din): hard-coding the course id here
        const course = await CourseModel.findOne({ id: 1 })
        // Check if the user has completed the course
        const hasCompletedCourse = user.course_status === "COMPLETED";

        // Return the course status
        res.status(200).json({ 
            hasCompletedCourse: hasCompletedCourse,
            name: user.name,
            courseName: course.title,
        });
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

problem_new.get("/problem", authFilter, async (req, res) => {
    try {
        const courseId = parseInt(req.query.courseId as string, 10); // Get courseId from query param
        const sectionId = parseInt(req.query.sectionId as string, 10); // Get sectionId from query param
        const problemId = parseInt(req.query.problemId as string, 10); // Get problemId from query param
        const user = req.user as User; // User information from session

        const course = await CourseModel.findOne({ id: courseId })
        if (!course) {
            res.status(400).send("The requested course doesn't exist")
        }

        const section = course.sections.find(section => section.id == sectionId)
        if (!section) {
            res.status(400).send("The requested section doesn't exist")
            return;
        }

        // Fetch the problem based on problemId within the section
        const problem = section.problems.find(p => p.id == problemId);

        if (!problem) {
            res.status(400).send("Requested problem does not exist");
            return;
        }

        // Check if the problem is solved by the user
        const isSolved = user.attempts.some(attempt =>
            attempt.course_id === courseId && 
            attempt.section_id === sectionId &&
            attempt.problem_id === problemId &&
            attempt.status == "SOLVED"
        );

        const pythonCodeTemplate = problem.code_body.find(template => template.language === 'Python');
        const next_problem = findNextProblem(problemId, sectionId, course)

        const response = {
            id: problem.id,
            name: problem.name,
            difficulty: problem.difficulty,
            description_body: problem.description_body,
            code_body: pythonCodeTemplate,
            is_solved: isSolved,
            next_problem: next_problem,
            expected_output: problem.expected_output,
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

const findNextProblem = (currentProblemId: number, currentSectionId: number, course: DbCourse) => {
    const currentSection = course.sections.find(section => section.id === currentSectionId);

    // Find the current problem index
    const currentProblemIndex = currentSection.problems.findIndex(problem => problem.id === currentProblemId);

    if (currentProblemIndex < currentSection.problems.length - 1) {
        // Next problem is in the same section
        return {
            problem_id: currentSection.problems[currentProblemIndex + 1].id,
            section_id: currentSectionId,
            is_course_end: false,
        };
    } 
    // Find the current section index
    const currentSectionIndex = course.sections.findIndex(section => section.id === currentSectionId);

    if (currentSectionIndex < course.sections.length - 1) {
        // Next problem is in the next section
        return {
            problem_id: course.sections[currentSectionIndex + 1].problems[0].id,
            section_id: course.sections[currentSectionIndex + 1].id,
            is_course_end: false,
        };
    }

    return {
        problem_id: -1,
        section_id: -1,
        is_course_end: true
    }
}

problem_new.post("/submit", authFilter, async (req, res) => {
    const courseId = parseInt(req.query.courseId as string, 10); // Get courseId from query param
    const sectionId = parseInt(req.query.sectionId as string, 10); // Get sectionId from query param
    const problemId = parseInt(req.query.problemId as string, 10); // Get problemId from query param

    const user = req.user as User; // User information from session
    const course = await CourseModel.findOne({ id: courseId })
    if (!course) {
        res.status(400).send("The requested course doesn't exist")
    }

    const section = course.sections.find(section => section.id == sectionId)
    if (!section) {
        res.status(400).send("The requested section doesn't exist")
        return;
    }

    // Fetch the problem based on problemId within the section
    const problem = section.problems.find(p => p.id == problemId);

    if (!problem) {
        res.status(400).send("Requested problem does not exist");
        return;
    }

    const awards = []
    const dbUser = await UsersModel.findById(user.id); // Fetch the user from the database
    const hasSolved = dbUser.attempts.some(attempt =>
        attempt.course_id === courseId &&
        attempt.section_id === sectionId &&
        attempt.problem_id === problemId &&
        attempt.status === "SOLVED"
    );
    if (!hasSolved) {
        dbUser.attempts.push({
            section_id: sectionId,
            course_id: courseId,
            problem_id: problemId,
            status: "SOLVED"
        });
        awards.push(...checkAndAwardUser(dbUser, course))
    }

    const nextProblem = findNextProblem(problemId, sectionId, course)
    if (nextProblem.is_course_end == true && user.course_status == "IN_PROGRESS") {
        dbUser.course_status = "COMPLETED"
    }
    await dbUser.save(); // Save the user
    
    res.status(200).json(
        {
            status: "Accepted",
            awards: [ { 
                name: "Second Award", 
                description: "Half-way there!"
            }],
        }
    )
})




const checkAndAwardUser = (dbUser: DbUser, course: DbCourse) => {
    const totalProblems = course.sections.reduce((total, section) => total + section.problems.length, 0);
    const solvedProblems = dbUser.attempts.filter((attempt: any) => attempt.status === "SOLVED").length;

    const awardFirstProblem =  { 
        name: "First Award", 
        description: "First problem to go!" 
    }
    const awardHalfProblems = { 
        name: "Second Award", 
        description: "Half-way there!"
    };
    const awardAllProblems = { 
        name: "Third Award", 
        description: "You finsihed it all!" 
    };

    const achievedAwards = []
    if (solvedProblems === 1 && !dbUser.awards.some(award => award.name === awardFirstProblem.name)) {
        // Award for solving the first problem
        dbUser.awards.push(awardFirstProblem)
        achievedAwards.push(awardFirstProblem)
    }

    if (solvedProblems >= Math.floor(totalProblems / 2) && !dbUser.awards.some(award => award.name === awardHalfProblems.name)) {
        // Award for solving half of the problems
        dbUser.awards.push(awardHalfProblems)
        achievedAwards.push(awardHalfProblems)
    }

    if (solvedProblems === totalProblems && !dbUser.awards.some(award => award.name === awardAllProblems.name)) {
        // Award for solving all problems
        dbUser.awards.push(awardAllProblems)
        achievedAwards.push(awardAllProblems)
    }
    return achievedAwards
}

function stringToBase64(str: string): string {
    return Buffer.from(str).toString('base64');
}

export default problem_new;