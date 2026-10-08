// import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { getSearchUser, getUsers, createUser, updateUser, deleteUser } from "../DB/user-db.js";
import { validateUserId, validateCreateUser } from "../middleware/userMiddleware.js";
const router = express.Router();

// Middleware
router.use(express.json());
router.use(cors());

// Get Users
router.get("/users", async (req, res) => {
    try {
        const search = req.query.search;
        let users;
        if (search !== undefined && search !== null && String(search).trim() !== "") {
            users = await getSearchUser(String(search).trim());
        } else {
            users = await getUsers();
        }
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            key: "INTERNAL_SERVER_ERROR",
            message: "Internal server error",
            data: null
        });             
    }
});

// Get User By Id
router.get("/users/:id", validateUserId, async (req, res) => {
    const user = req.user;
    res.json(user);
});

// Create User
router.post("/users",validateCreateUser, async (req, res) => {
    const body = req.body;
    const user = await createUser(body);
    res.json({
        key: "USER_CREATED",
        message: "User created successfully",
        data: user
    });
});

// Update User
router.put("/users/:id",validateUserId, async (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    const user = await updateUser(id, body);
    res.json({
        key: "USER_UPDATED",
        message: "User updated successfully",
        data: user
    });
});

// Delete User
router.delete("/users/:id",validateUserId, async (req, res) => {
    const id = req.params.id;
    const user = await deleteUser(id);
    res.json({
        key: "USER_DELETED",
        message: "User deleted successfully",
        data: null
    });
});

export default router;