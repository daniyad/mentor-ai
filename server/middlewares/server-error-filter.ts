import { Request, Response, NextFunction } from 'express';

// Error handling middleware function
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err); // Log the error for server-side review

    // Send a generic error message to the client
    res.status(500).send({
        message: 'An unexpected error occurred. Please try again later.'
    });
};

export default errorHandler;