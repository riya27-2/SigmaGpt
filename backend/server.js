import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatroutes from "./routes/chat.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", chatroutes);

// DB connection — reuse across serverless invocations
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected = true;
        console.log("Connected to DB");
    } catch (err) {
        console.log("Failed to connect with DB.", err);
    }
};

// Connect DB on every request (serverless-safe)
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Local dev ke liye normal listen
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
}

export default app;