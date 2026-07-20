import express from "express";
import "dotenv/config";
import cors from"cors";


const app= express();
const PORT=8080;

app.use(express.json());
app.use(cors());

app.listen(PORT,()=>{
    console.log(`app is listening on ${PORT}`);
})

app.post("/test", async (req, res) => {
    const userMessage = req.body.messages || "Hello!";

    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
            contents: [
                {
                    role: "user",
                    parts: [{ text: userMessage }]
                }
            ]
        })
    };

    try {
        
        const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
    options
);
        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response";
         //console.log(reply);

        return res.send({ reply });

    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err.message });
    }
});