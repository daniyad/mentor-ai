import passport from 'passport';
import localStrategy from './local-auth-strategy';
import Users from '../models/user-model';
import googleStrategy from './google-strategy';

const initializePassport = () => {
    passport.use(localStrategy);
    passport.use(googleStrategy);

    passport.serializeUser((user: any, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await Users.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};

export default initializePassport;