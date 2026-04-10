// api/chat.js
export default async function handler(req, res) {
    // Sirf POST request allow karenge (Security ke liye)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { messages } = req.body;

    // Innovation Hub ka System Prompt (Brand Identity)
    const systemPrompt = {
        role: "system",
        content: `You are the exclusive AI Tech Consultant for 'Innovation Hub'. 
        Tone: Ultra-professional, modern, and tech-driven. 
        Mission: Give precise, high-value tech and software advice. Do not act like a generic AI.`
    };

    // System prompt ko user ke messages ke sath jodna
    const payloadMessages = [systemPrompt, ...messages];

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "nvidia/nemotron-3-super-120b-a12b:free", // Aapka Nemotron Model
                messages: payloadMessages,
                temperature: 0.7,
                max_tokens: 800
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const reply = data.choices[0].message.content;

        // Frontend ko reply wapas bhejna
        res.status(200).json({ reply });
        
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: "API connection failed" });
    }
}
