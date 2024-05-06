import express from 'express';
import passport from 'passport';

const google_auth = express.Router();

// Route that triggers the Google OAuth flow
google_auth.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

google_auth.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect to your desired destination
        res.redirect('/profile/details');
    }
);