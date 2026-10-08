import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise()

// Get Items From Category
export async function getItemsFromCategory(categoryId) {    
    const [rows] = await pool.query("SELECT * FROM items WHERE categoryId = ?", [categoryId])
    return rows;
}

// Get Item By ID
export async function getItemById(categoryId, id) {
    const [rows] = await pool.query("SELECT * FROM items WHERE categoryId = ? AND id = ?", [categoryId, id])
    return rows[0];
}

// Add Item
export async function addItem(params, body) {
    const { name, price, stock, description } = body;
    const categoryId = params.categoryId;

    if (name === undefined || name === null || name.trim() === "") {
        throw new Error("name is required");
    }

    const fields = [];
    const values = [];
    const placeholders = [];

    if (categoryId !== undefined) {
        fields.push("categoryId");
        placeholders.push("?");
        values.push(categoryId);
    }

    if (name !== undefined) {
        fields.push("name");
        placeholders.push("?");
        values.push(name);
    }

    if (description !== undefined) {
        fields.push("description");
        placeholders.push("?");
        values.push(description);
    }

    if (price !== undefined) {
        fields.push("price");
        placeholders.push("?");
        values.push(price);
    }

    if (stock !== undefined) {
        fields.push("stock");
        placeholders.push("?");
        values.push(stock);
    }

    const [result] = await pool.query(
        `INSERT INTO items (${fields.join(", ")})
         VALUES (${placeholders.join(", ")})`,
        values
    );

    const id = result.insertId
    return getItemById(categoryId, id);
}


// Update Item
export async function updateItem(categoryId, id, body) {

    const { name, price, stock } = body;

    if (id === undefined) {
        throw new Error("id is required");
    }

    if (name === undefined || name === null || name.trim() === "") {
        throw new Error("name is required", body);
    }

    const fields = [];
    const values = [];

    if (body.name !== undefined) {
        fields.push("name = ?");
        values.push(body.name);
    }

    if (body.description !== undefined) {
        fields.push("description = ?");
        values.push(body.description);
    }

    if (price !== undefined) {
        fields.push("price = ?");
        values.push(price);
    }

    if (stock !== undefined) {
        fields.push("stock = ?");
        values.push(stock);
    }

    values.push(categoryId);
    values.push(id);

    const [result] = await pool.query(
        `UPDATE items
         SET ${fields.join(", ")}
         WHERE categoryId = ? AND id = ?`,
        values
    );

    return getItemById(categoryId, id);
}

// Delete Item
export async function deleteItem(categoryId,id) {
    const result = await pool.query(`
        DELETE FROM items WHERE categoryId = ? AND id = ?`, [categoryId,id]
    )
    return result
}