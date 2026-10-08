import { getCategory } from "../DB/categories-db.js";

// Validate Category ID
export async function validateCategoryId(req, res, next) {
    const id = Number(req.params.categoryId);

    

    // Check ID format
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            key: "INVALID_ID",
            message: "Invalid category ID",
        });
    }

    // Check whether category exists
    const category = await getCategory(id);

    if (!category) {
        return res.status(404).json({
            key: "INVALID_ID",
            message: "Category not found",
        });
    }

    // Store category so the route doesn't need to call getCategory again
    req.category = category;

    next();
}

// Validate Category Input
export function validateCategoryInput(req, res, next) {
    const { name } = req.body;
    // name is required
    if (
        name === undefined ||
        name === null ||
        name.trim() === ""
    ) {
        return res.status(400).json({
            key: "INVALID_NAME",
            message: "name is required",
        });
    }

    const user = req.user;

    if (!user || user.role !== "Manager") {
        return res.status(403).json({
            key: "FORBIDDEN",
            message: "Unauthorized access: Managers only",
        });
    }

    next();
}