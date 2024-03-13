import express from 'express';
import passport from 'passport';
import validator from 'validator';
import UsersModel from '../../models/user-model';
import bcrypt from 'bcrypt'
import ensureAuthenticated from '../../middlewares/auth-filter'

const auth = express.Router();


auth.post('/login-locally', (req, res, next) => { 
  if (req.isAuthenticated()) {
    // User is already logged in, so redirect or send a message
    return res.status(400).send({ message: "User already logged in." });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err); // handle error
    }
    if (!user) {
      // Authentication failed
      return res.json({ success: false, message: info.message }); // Send response with failure flag
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Authentication successful
      return res.json({ success: true }); // Indicate success in the response
    });
  })(req, res, next);
});

auth.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
});

auth.post('/signup-locally', async (req, res, next) => {
  const { email, password, username } = req.body;

  try {
    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).send({ message: 'Invalid email format' });
    }

    // Check if email already exists
    const existingUser = await UsersModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).send({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await UsersModel.create({
      name: username,
      email: email,
      password: hashedPassword,
      preferred_coding_language: "Python",
      language: "English",
      attempts: []
      // other fields if needed
    });

    // Authenticate the user to start the session
    req.logIn(newUser, (err) => {
      if (err) return next(err);
      return res.redirect('/problems-new/problems');
    });

  } catch (error) {
    return next(error); // Pass errors to error-handling middleware
  }
});

// Logout route
auth.post('/logout', ensureAuthenticated, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      // Handle the error case
      return next(err);
    }
    // Explicitly destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return next(err); // Handle errors in session destruction
      }

      // Redirect or send a response after successful logout
      res.redirect('/login');
    });
  });
});


export default auth;