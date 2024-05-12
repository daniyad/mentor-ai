import UsersModel from '../models/user-model';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { v4 as uuidv4 } from 'uuid';
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
            const existingUser = await UsersModel.findOne({ googleId: profile.id });
            
            if (existingUser) {
                console.log("Found existing user");
                // User exists, update tokens
                existingUser.accessToken = accessToken;
                existingUser.refreshToken = refreshToken;
                await existingUser.save();
                return cb(null, existingUser);
            } else {
                console.log("Create new user");
                console.log("Profile incoming");
                console.log(profile);
                // No user found, create a new user
                const newUser = await UsersModel.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value, // Email is in the emails array
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    // Set defaults or use additional profile information as needed
                    password: uuidv4(), // Consider handling this differently since it's OAuth
                    preferred_coding_language: 'Python', // Set a default or based on additional data
                    language: 'English', // Set a default or based on additional data
                    attempts: [],
                });

                return cb(null, newUser);
            }
        } catch (error) {
            return cb(error);
        }
    }
)

export default googleStrategy;

