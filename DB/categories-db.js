import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise()

// Get Categories
export async function getCategories() {
    const [rows] = await pool.query("SELECT * FROM categories")
    return rows;
}

// Get Category by ID
export async function getCategory(id) {
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [id])
    return rows[0];
}


// Add Category
export async function addCategory(body) {
    
    if (body.name === undefined || body.name === null || body.name.trim() === "") {
        throw new Error("name is required");
    }

    const fields = [];
    const values = [];
    const placeholders = [];

    if (body.name !== undefined) {
        fields.push("name");
        placeholders.push("?");
        values.push(body.name);
    }

    if (body.description !== undefined) {
        fields.push("description");
        placeholders.push("?");
        values.push(body.description);
    }

    const [result] = await pool.query(
        `INSERT INTO categories (${fields.join(", ")})
         VALUES (${placeholders.join(", ")})`,
        values
    );

    const id = result.insertId
    return getCategory(id);
}

// Update Category
export async function updateCategory(id,body) {

     if (id === undefined) {
        throw new Error("id is required");
    }
    
    if (body.name === undefined || body.name === null || body.name.trim() === "") {
        throw new Error("name is required",body);
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

    values.push(id);

    const [result] = await pool.query(
        `UPDATE categories
         SET ${fields.join(", ")}
         WHERE id = ?`,
        values
    );

    return getCategory(id);
}

// Delete Category
export async function deleteCategory(id) {
    const result = await pool.query(`
        DELETE FROM categories WHERE id = ?`,[id]
    )
    return result
}