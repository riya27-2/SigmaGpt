import "dotenv/config";

const getGeminiAPIResponse = async (message) => {
    const userMessage = message || "Hello!";

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

    // Confirmed via ListModels: gemini-3.5-flash is available and
    // supports generateContent for this account
    const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
        options
    );

    const data = await response.json();

    // Fail loudly on bad model name / API errors instead of
    // silently returning "No response"
    if (!response.ok) {
        console.error("Gemini API error:", data);
        throw new Error(data.error?.message || "Gemini API request failed");
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
        console.error("Unexpected Gemini response shape:", JSON.stringify(data));
        throw new Error("No reply returned from Gemini");
    }

    return reply;
};

export default getGeminiAPIResponse;