import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST() {
    try {
        const openaiResponse = await openai.images.generate({
            model: 'dall-e-3',
            prompt: 'a simple image depicting a scene from The Cask of Amontillado include both Fortunato and Montresor in the catacombs, make it scary and realistic',
            n: 1,
            size: '1024x1024',
        });
        const imageUrl = openaiResponse.data[0].url;
        return NextResponse.json({ imageUrl });
    } catch (error) {
        console.error('Error generating image:', error);
        return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
    }
}
