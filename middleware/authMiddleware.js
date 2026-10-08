import jwt from "jsonwebtoken";
import { getUser } from "../DB/user-db.js";

// Authenticate User
export async function authenticateUser(req, res, next) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                key: "UNAUTHORIZED",
                message: "Authentication token missing",
            });
        }

        const jwtSecret = process.env.JWT_SECRET || "default_secret";
        const decoded = jwt.verify(token, jwtSecret);

        if (!decoded || !decoded.id) {
            return res.status(401).json({
                key: "UNAUTHORIZED",
                message: "Invalid authentication token",
            });
        }

        const user = await getUser(decoded.id);

        if (!user) {
            return res.status(401).json({
                key: "UNAUTHORIZED",
                message: "User not found or unauthenticated",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            key: "UNAUTHORIZED",
            message: "Unauthorized access: " + error.message,
        });
    }
}
