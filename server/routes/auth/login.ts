import express from 'express';
import passport from 'passport';

const auth = express.Router();

auth.post('/login', passport.authenticate('local', {
  successRedirect: '/problems-new/problems', // Redirect to another route on successful authentication
  failureRedirect: '/login',     // Redirect back to the login page on failure
}));


export default auth;