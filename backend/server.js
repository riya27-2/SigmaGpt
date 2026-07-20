import express from "express";
import "dotenv/config";
import cors from "cors";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
    console.log(`app is listening on ${PORT}`);
});

app.post("/test", async (req, res) => {
    // FIX 1: was req.body.messages (plural) — client sends "message" (singular)
    const userMessage = req.body.message || "Hello!";

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
        // Confirmed via ListModels: gemini-3.5-flash is available and
        // supports generateContent for this account
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
            options
        );

        const data = await response.json();

        // FIX 3: fail loudly on bad model name / API errors instead of
        // silently returning "No response"
        if (!response.ok) {
            console.error("Gemini API error:", data);
            return res.status(response.status).send({
                error: data.error?.message || "Gemini API request failed",
            });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!reply) {
            console.error("Unexpected Gemini response shape:", JSON.stringify(data));
            return res.status(502).send({ error: "No reply returned from Gemini" });
        }

        return res.send({ reply });

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
});