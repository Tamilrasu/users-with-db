import express from "express";
import cors from "cors";
import { addCategory, deleteCategory, getCategories, updateCategory } from "../DB/categories-db.js";
import { validateCategoryId, validateCategoryInput } from "../middleware/categoryMiddleware.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const router = express.Router();

// Middleware
router.use(express.json());
router.use(cors());

// Get Categories
router.get("/categories", async (req, res) => {
    try {
        let categories =await getCategories();
        res.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({
            key: "INTERNAL_SERVER_ERROR",
            message: "Internal server error",
            data: null
        });
    }
});

// Get Category By ID   
router.get("/categories/:categoryId", validateCategoryId, async (req, res) => {
    const category = req.category;
    res.json(category);
});

// Create Category
router.post("/categories", authenticateUser, validateCategoryInput, async (req, res) => {
    const body = req.body;
    const category = await addCategory(body);
    res.json({
        key: "CATEGORY_CREATED",    
        message: "Category created successfully",
        data: category
    });
});

// Update Category
router.put("/categories/:categoryId", authenticateUser, validateCategoryId, validateCategoryInput, async (req, res) => {
    const id = Number(req.params.categoryId);
    const body = req.body;
    const category = await updateCategory(id,body);
    res.json({
        key: "CATEGORY_UPDATED",
        message: "Category updated successfully",
        data: category
    });
});

// Delete Category
router.delete("/categories/:categoryId", authenticateUser, validateCategoryId, async (req, res) => {
    const id = Number(req.params.categoryId);
    const category = await deleteCategory(id);
    res.json({
        key: "CATEGORY_DELETED",
        message: "Category deleted successfully"
    });
});



export default router;