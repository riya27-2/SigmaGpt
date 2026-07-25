import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatroutes from "./routes/chat.js";


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());
app.use("/api",chatroutes);

app.listen(PORT, () => {
    console.log(`app is listening on ${PORT}`);
    connectDB();
});

const connectDB= async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("connected to DB");
    }catch(err){
        console.log("failed to connect with DB.",err);
    }
}

