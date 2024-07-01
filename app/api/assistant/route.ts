import { OpenAI } from 'openai';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const assistant = await openai.beta.assistants.create({
        name: "Painting Description Assistant",
        instructions: `You are an expert in describing paintings. When given a theme or short description, provide a detailed description of a painting, including its elements, style, details, and colors. Focus solely on painting descriptions without engaging in other topics. Be creative and vivid in your descriptions.`,
        model: "gpt-4-1106-preview",
      });

      res.status(200).json({ assistantId: assistant.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}