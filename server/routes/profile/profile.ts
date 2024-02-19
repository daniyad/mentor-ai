import express from 'express';
import ensureAuthenticated from '../../middlewares/auth-filter'
import { SectionModel } from '../../models/problem-model';

const profile = express.Router();

// Profile details route
profile.get('/details', ensureAuthenticated, async (req, res) => {
    try {
        const user = req.user as User;

        // Initialize solved counts
        let solvedCounts = {
            easySolved: 0,
            mediumSolved: 0,
            hardSolved: 0,
            totalSolved: 0,
            easyTotal: 0,
            mediumTotal: 0,
            hardTotal: 0,
            total: 0,
        };

        // Get all problems from the database
        const sections = await SectionModel.find(); // Adjust with correct method to get all sections
        sections.forEach(section => {
            section.problems.forEach(problem => {
                // Increment total problems based on difficulty
                const difficultyKey = problem.difficulty.toLowerCase() + 'Total'; // e.g., 'easyTotal'
                solvedCounts[difficultyKey]++;
                solvedCounts.total++;

                // Check if the user has solved this problem
                if (user.attempts.some(attempt => attempt.problem_id === problem.id && attempt.status === PROBLEM_STATUS.SOLVED)) {
                    const solvedKey = problem.difficulty.toLowerCase() + 'Solved'; // e.g., 'easySolved'
                    solvedCounts[solvedKey]++;
                    solvedCounts.totalSolved++;
                }
            });
        });

        // Extract and send the required details along with solved counts
        const userDetails = {
            name: user.name,
            language: user.language,
            solvedCounts: solvedCounts // Include solved counts in the response
        };

        res.json(userDetails);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});

export default profile;