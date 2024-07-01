import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Add this line to get the ASSISTANT_ID
const ASSISTANT_ID = process.env.ASSISTANT_ID;

export async function POST(request: Request) {
  const { theme } = await request.json();

  // Add this check
  if (!ASSISTANT_ID) {
    console.error('ASSISTANT_ID is not set');
    return NextResponse.json({ error: 'ASSISTANT_ID is not configured' }, { status: 500 });
  }

  try {
    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `Describe a painting with the theme: ${theme}`,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID,  // Use the ASSISTANT_ID here
    });

    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    const messages = await openai.beta.threads.messages.list(thread.id);
    const description = messages.data[0].content[0].text.value;

    return NextResponse.json({ description });
  } catch (error) {
    console.error('Error generating description:', error);
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 });
  }
}