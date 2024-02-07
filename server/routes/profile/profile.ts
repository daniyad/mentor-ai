import express from 'express';
import ensureAuthenticated from '../../middlewares/auth-filter'

const profile = express.Router();

// Profile details route
profile.get('/details', ensureAuthenticated, (req, res) => {
    try {
        // Accessing user information from the session
        const user = req.user as User

        // Extract and send the required details
        const userDetails = {
            name: user.name,
            email: user.email,
            preferred_coding_language: user.preferred_coding_language,
            language: user.language
        };

        res.json(userDetails);
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});

export default profile;