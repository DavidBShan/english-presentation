import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Define the `POST` method handler
export async function POST(req) {
    try {
        // Parse JSON body from the request
        const body = await req.json();
        const { agent_id, metadata, retell_llm_dynamic_variables } = body;

        // Prepare the payload
        const payload = { agent_id };
        if (metadata) payload.metadata = metadata;
        if (retell_llm_dynamic_variables) payload.retell_llm_dynamic_variables = retell_llm_dynamic_variables;

        // Make the API request
        const response = await axios.post(
            'https://api.retellai.com/v2/create-web-call',
            payload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.RETELL_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return new Response(JSON.stringify(response.data), { status: 201 });
    } catch (error) {
        console.error('Error creating web call:', error.response?.data || error.message);

        return new Response(
            JSON.stringify({ error: 'Failed to create web call' }),
            { status: 500 }
        );
    }
}
