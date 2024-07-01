import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

export async function POST(request: Request) {
  try {
    const { description, size, quality, style } = await request.json();

    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: description,
      n: 1,
      size: size,
      quality: quality,
      style: style,
    });

    return NextResponse.json({ imageUrl: response.data[0].url });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}