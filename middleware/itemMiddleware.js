import { getItemById } from "../DB/items-db.js";

// Validate Item ID
export async function validateItemId(req, res, next) {
    const categoryId = Number(req.params.categoryId);
    const id = Number(req.params.id);

    // Check ID format
    if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(categoryId) || categoryId <= 0) {
        return res.status(400).json({
            key: "INVALID_ID",
            message: "Invalid category or item ID",
        });
    }

    // Check whether item exists
    const item = await getItemById(categoryId, id);

    if (!item) {
        return res.status(404).json({
            key: "INVALID_ID",
            message: "Item not found",
        });
    }

    // Store user so the route doesn't need to call getItemById again
    req.item = item;

    next();
}

// Validate Create Item
export function validateCreateItem(req, res, next) {
    const { name, price, stock } = req.body;
    const categoryId = Number(req.params.categoryId);
    if (
        categoryId === undefined ||
        categoryId === null ||
        !Number.isInteger(categoryId) ||
        categoryId <= 0
    ) {
        return res.status(400).json({
            key: "INVALID_CATEGORY_ID",
            message: "categoryId is required",
        });
    }

    if (!Number.isInteger(parseInt(price))) {
        return res.status(400).json({
            key: "INVALID_PRICE",
            message: "Only Integers are allowed",
        });
    }

    if (!Number.isInteger(parseInt(stock))) {
        return res.status(400).json({
            key: "INVALID_STOCK",
            message: "Only Integers are allowed",
        });
    }


    // name validation
    if (name !== undefined) {
        if (name.trim() === "") {
            return res.status(400).json({
                key: "INVALID_NAME",
                message: "name is required",
            });
        }
    }

    next();
}
