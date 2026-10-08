import express from "express";
import cors from "cors";
import { addItem, deleteItem, getItemsFromCategory, updateItem } from "../DB/items-db.js";
import { validateCreateItem, validateItemId } from "../middleware/itemMiddleware.js";
import { validateCategoryId } from "../middleware/categoryMiddleware.js";
const router = express.Router();

// Middleware
router.use(express.json());
router.use(cors());


// Get Items
router.get("/categories/:categoryId/items",validateCategoryId, async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        let categories = await getItemsFromCategory(categoryId);
        res.json(categories);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({
            key: "INTERNAL_SERVER_ERROR",
            message: "Internal server error",
            data: null
        });
    }
});

// Get Item
router.get("/categories/:categoryId/items/:id",validateCategoryId, validateItemId, async (req, res) => {
    const item = req.item;
    res.json(item);
});

// Create Item
router.post("/categories/:categoryId/items",validateCategoryId,validateCreateItem,  async (req, res) => {
    const params = req.params;
    const body = req.body;
    const item = await addItem(params,body);
    
    res.json({
        key: "ITEM_CREATED",    
        message: "Item created successfully",
        data: item
    });
});

// Update Item
router.put("/categories/:categoryId/items/:id",validateCategoryId,validateCreateItem,validateItemId,  async (req, res) => {
    const params = req.params;
    const body = req.body;
    const item = await updateItem(params.categoryId,params.id,body);
    res.json({
        key: "ITEM_UPDATED",    
        message: "Item updated successfully",
        data: item
    });
});

// Delete Item
router.delete("/categories/:categoryId/items/:id",validateCategoryId,validateItemId,  async (req, res) => {
    const params = req.params;
    const item = await deleteItem(params.categoryId,params.id);
    res.json({
        key: "ITEM_DELETED",    
        message: "Item deleted successfully",
    });
});

export default router;