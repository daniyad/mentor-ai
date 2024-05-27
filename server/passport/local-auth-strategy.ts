import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import passport from 'passport';
import {UsersModel} from '../models/user-model'

const localStrategy = new LocalStrategy(async (email, password, done) => {
  try {
      // Find the user by email
      const user = await UsersModel.findOne({ email: email });

      if (!user) {
          // If user not found
          console.error("Incorrect username")
          return done(null, false, { message: 'Incorrect username.' });
      }

      // Compare password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
          // Passwords do not match
          console.error("Incorrect password")
          return done(null, false, { message: 'Incorrect password.' });
      } else {
          // Passwords match, return the user
          return done(null, user);
      }
  } catch (err) {
      return done(err);
  }
});


export default localStrategy