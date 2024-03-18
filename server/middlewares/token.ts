import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface UserRequest extends Request {
    user?: string | JwtPayload;
}

export function authenticateToken(
    req: UserRequest,
    res: express.Response,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers["authorization"];
    const token = authHeader;

    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Token not provided" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
        if (err) {
            return res
                .status(403)
                .json({ success: false, message: "Invalid token" });
        }
        req.user = user;
        next();
    });
}
