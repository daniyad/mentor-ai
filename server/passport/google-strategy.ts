import User from '../models/user-model';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
require("dotenv").config();

const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK,
    },
    async (accessToken, refreshToken, profile, cb) => {
        try {
            // Find the user based on their Google ID
            const existingUser = await User.findOne({ googleId: profile.id });
            
            if (existingUser) {
                // User exists, update tokens
                existingUser.accessToken = accessToken;
                existingUser.refreshToken = refreshToken;
                await existingUser.save();
                return cb(null, existingUser);
            } else {
                // No user found, create a new user
                const newUser = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value, // Email is in the emails array
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    // Set defaults or use additional profile information as needed
                    password: '', // Consider handling this differently since it's OAuth
                    preferred_coding_language: 'default', // Set a default or based on additional data
                    language: 'default' // Set a default or based on additional data
                });

                return cb(null, newUser);
            }
        } catch (error) {
            return cb(error);
        }
    }
)

export default googleStrategy;

