import {getUser} from "../DB/user-db.js";

// Validate User ID
export async function validateUserId(req, res, next) {
    const id = Number(req.params.id);

    // Check ID format
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            key: "INVALID_ID",
            message: "Invalid user ID",
        });
    }

    // Check whether user exists
    const user = await getUser(id);

    if (!user) {
        return res.status(404).json({
            key: "INVALID_ID",
            message: "User not found",
        });
    }

    // Store user so the route doesn't need to call getUser again
    req.user = user;

    next();
}


// Validate Create User
export function validateCreateUser(req, res, next) {
    const { firstName, age } = req.body;

    // firstName is required
    if (
        firstName === undefined ||
        firstName === null ||
        firstName.trim() === ""
    ) {
        return res.status(400).json({
            key: "INVALID_FIRST_NAME",
            message: "firstName is required",
        });
    }

    // age validation
    if (age !== undefined) {
        if (!Number.isInteger(age) || age <= 0) {
            return res.status(400).json({
                key: "INVALID_AGE",
                message: "age must be a valid number",
            });
        }
    }

    next();
}

// Validate Login Input
export function validateLoginInput(req, res, next) {
    const { email, password } = req.body || {};

    if (!email || typeof email !== "string" || email.trim() === "") {
        return res.status(400).json({
            key: "INVALID_EMAIL",
            message: "email is required",
        });
    }

    if (!password || typeof password !== "string" || password.trim() === "") {
        return res.status(400).json({
            key: "INVALID_PASSWORD",
            message: "password is required",
        });
    }

    next();
}