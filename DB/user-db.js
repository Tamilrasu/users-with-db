import mysql from "mysql2";
import bcrypt from "bcryptjs";

import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise()

// Sanitize User
export function sanitizeUser(user) {
    if (!user) return user;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

// Get Users
export async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM users")
    return rows.map(sanitizeUser)
}

// Get User
export async function getUser(id) {
    const [rows] = await pool.query(`SELECT * FROM users where id = ?`, [id])
    return sanitizeUser(rows[0])
}

// Get User By Email
export async function getUserByEmail(email) {
    const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email])
    return rows[0]
}

// Get Search User
export async function getSearchUser(search) {
    const searchPattern = `%${search}%`;
    const [rows] = await pool.query(
        `SELECT * FROM users WHERE firstName LIKE ? OR lastName LIKE ? OR email LIKE ?`,
        [searchPattern, searchPattern, searchPattern]
    );
    return rows.map(sanitizeUser);
}

// Create User
export async function createUser(body) {

    const fields = [];
    const values = [];
    const placeholders = [];

    if (body.firstName !== undefined) {
        fields.push("firstName");
        placeholders.push("?");
        values.push(body.firstName);
    }

    if (body.lastName !== undefined) {
        fields.push("lastName");
        placeholders.push("?");
        values.push(body.lastName);
    }

    if (body.age !== undefined) {
        fields.push("age");
        placeholders.push("?");
        values.push(body.age);
    }

    if (body.email !== undefined) {
        fields.push("email");
        placeholders.push("?");
        values.push(body.email);
    }

    if (body.password !== undefined) {
        fields.push("password");
        placeholders.push("?");
        const hashedPassword = await bcrypt.hash(body.password, 10);
        values.push(hashedPassword);
    }

    const [result] = await pool.query(
        `INSERT INTO users (${fields.join(", ")})
         VALUES (${placeholders.join(", ")})`,
        values
    );

    const id = result.insertId
    return getUser(id);
}

// Update User
export async function updateUser(id, updates) {

    if (id === undefined) {
        throw new Error("id is required");
    }

    if (updates.firstName && updates?.firstName === undefined ||updates?.firstName === null ||updates?.firstName?.trim() === "") {
        throw new Error("firstName is required");
    }

    const fields = [];
    const values = [];

    if (updates.firstName !== undefined) {
        fields.push("firstName = ?");
        values.push(updates.firstName);
    }

    if (updates.lastName !== undefined) {
        fields.push("lastName = ?");
        values.push(updates.lastName);
    }

    if (updates.age !== undefined) {
        fields.push("age = ?");
        values.push(updates.age);
    }

    if (updates.email !== undefined) {
        fields.push("email = ?");
        values.push(updates.email);
    }

    if (updates.password !== undefined) {
        fields.push("password = ?");
        const hashedPassword = await bcrypt.hash(updates.password, 10);
        values.push(hashedPassword);
    }

    if (updates.role !== undefined) {
        fields.push("role = ?");
        values.push(updates.role);
    }

    values.push(id);

    const [result] = await pool.query(
        `UPDATE users
         SET ${fields.join(", ")}
         WHERE id = ?`,
        values
    );

    return getUser(id);
}

// Delete User
export async function deleteUser(id) {
    const result = await pool.query(`
        DELETE FROM users WHERE id = ?`,[id]
    )
    return result
}


