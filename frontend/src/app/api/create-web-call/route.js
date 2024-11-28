// pages/api/create-web-call.js
import axios from "axios";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { agent_id } = req.body;

    try {
        const response = await axios.post("https://api.retellai.com/v2/create-web-call",
            { agent_id },
            {
                headers: {
                    Authorization: `Bearer ${process.env.RETELL_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Failed to create web call" });
    }
}
