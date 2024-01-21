import { Request, Response, NextFunction } from 'express';


const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) { // Passport.js provides this method
        return next() // User is authenticated, proceed to the next function
    }
    // User is not authenticated
    res.status(401).send('User not authenticated')
};

export default ensureAuthenticated