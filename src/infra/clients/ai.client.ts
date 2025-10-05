import axios, { AxiosError } from 'axios';
import { Context } from 'hono';
import { sleep } from 'utils/sleep';

const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions';
const OPENROUTER_CHAT_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const createAiClient = (c: Context<{ Bindings: Env }>) => {
  const callGroq = async (prompt: string): Promise<string> => {
    const headers = {
      Authorization: `Bearer ${c.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const payload = {
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    };

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await axios.post(GROQ_CHAT_URL, payload, {
          headers,
        });
        return response.data.choices[0].message?.content?.trim();
      } catch (error: any) {
        const message =
          error instanceof AxiosError
            ? error.response?.data?.error?.message || error.message
            : error.message;

        if (message.includes('TPM')) {
          const wait = parseFloat(
            message.match(/try again in (\d+(\.\d+)?)s/)?.[1] || '10'
          );
          console.log(`TPM limit reached. Waiting ${wait}s...`);

          await sleep(wait * 1000);
          continue;
        }

        if (message.includes('TPD') || message.includes('daily limit')) {
          throw new Error('GROQ daily limit reached');
        }

        console.error(`Groq error: ${message}`);
        throw new Error(`Groq error: ${message}`);
      }
    }

    throw new Error('Failed to get Groq response after multiple attempts.');
  };

  const callOpenRouter = async (prompt: string): Promise<string> => {
    const headers = {
      Authorization: `Bearer ${c.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const payload = {
      model: 'meta-llama/llama-3-70b-instruct',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    };

    const response = await axios.post(OPENROUTER_CHAT_URL, payload, {
      headers,
    });

    return response.data.choices[0].message?.content?.trim();
  };

  const chat = async (prompt: string): Promise<string> => {
    try {
      return await callGroq(prompt);
    } catch (err: any) {
      if (err.message.includes('daily limit')) {
        console.warn('Switching to OpenRouter...');
        return await callOpenRouter(prompt);
      }
      throw err;
    }
  };

  return {
    chat,
  };
};
