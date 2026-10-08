import express from "express";
import jwt from "jsonwebtoken";
import { getUserByEmail, sanitizeUser } from "../DB/user-db.js";
import { validateLoginInput } from "../middleware/userMiddleware.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const router = express.Router();


// 1. Login Function
router.post("/login", validateLoginInput, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await getUserByEmail(email);

        if (!user || !user.password) {
            return res.status(401).json({
                key: "INVALID_CREDENTIALS",
                message: "Invalid email or password",
                data: null
            });
        }

        const isMatch = password === user.password;

        if (!isMatch) {
            return res.status(401).json({
                key: "INVALID_CREDENTIALS",
                message: "Invalid email or password",
                data: null
            });
        }

        const jwtSecret = process.env.JWT_SECRET || "default_secret";
        const token = jwt.sign(
            { id: user.id, email: user.email },
            jwtSecret,
            { expiresIn: "24h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({
            key: "LOGIN_SUCCESS",
            message: "Login successful",
            data: sanitizeUser(user)
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ key: "SERVER_ERROR", message: "Internal server error"});
    }
});

// 2. Logout Function
router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });
    res.json({
        key: "LOGOUT_SUCCESS",
        message: "Logout successful",
    });
});

// 3. Current User Function
router.get("/current-user", authenticateUser, (req, res) => {
    res.json({
        key: "CURRENT_USER_FETCHED",
        message: "Current user details retrieved successfully",
        user: req.user
    });
});

export default router;
