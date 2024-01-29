import express from 'express';
import passport from 'passport';
import validator from 'validator';
import UsersModel from '../../models/user-model';
import bcrypt from 'bcrypt'
import ensureAuthenticated from '../../middlewares/auth-filter'

const auth = express.Router();

auth.post('/login-locally', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err); // handle error
    }
    if (!user) {
      // Authentication failed
      return res.status(401).send({ message: info.message }); // Send 401 status with error message
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Authentication successful, redirect to the desired route
      return res.redirect('/api/problems-new/problems');
    });
  })(req, res, next);
});

auth.post('/signup-locally', async (req, res, next) => {
  const { email, password, name } = req.body;

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
          name: name,
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