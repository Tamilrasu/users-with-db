import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/users.js";
import categoriesRouter from "./routes/categories.js";
import itemsRouter from "./routes/items.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Authentication Routes
app.use(authRouter);

// User Routes
app.use(userRouter);

// Categories Routes
app.use(categoriesRouter);

// Items Routes
app.use(itemsRouter);

// Error handling middleware
// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Root Route
app.get("/",  (req, res) => {
    res.send("Hello World!");
});

// Server Listen
app.listen(3000, () => {
    console.log('Server started on port 3000');
});