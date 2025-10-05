import { Context } from 'hono';
import { createAiClient } from 'infra/clients/ai.client';
import { WeatherInsightsInput, WeatherInsightsResult } from 'types/types';

export const createWeatherInsightsService = (
  c: Context<{
    Bindings: Env;
  }>
) => {
  const getInsights = async (
    input: WeatherInsightsInput
  ): Promise<WeatherInsightsResult> => {
    const prompt = `
    You are a weather insight generator. You will receive JSON input containing information about a date, place, and weather data.
    Analyze it and respond ONLY with valid JSON (no explanations, no markdown).
    
    The JSON must contain two fields:
    {
      "description": string, // a natural English sentence summarizing the expected weather and context 
      "insights": string[] // an array of short, useful recommendations related to the event and weather
    }
      
    Be concise, realistic, and natural. Avoid repeating data. Mention temperature, wind, or rain only if relevant to the context. Use the language of the description field (fallback in english).
    Be creative and helpful.
    Return your response as raw JSON. Do not include code blocks or extra text.
    
    Example input:
    {
      "date": "2025-07-14",
      "place": {
        "coordinates": [-23.55, -46.63],
        "address": "São Paulo, Brazil"
      },
      "description": "Outdoor birthday party with 50 guests",
      "temporalAverage": {
        "temperature": 29,
        "windSpeed": 8,
        "precipitationPercentage": 20
      }
    }
        
    Expected output (only JSON, without any other text):
    {
      "description": "Warm and mostly clear afternoon, perfect for an outdoor party. A light breeze may bring some relief from the heat.",
      "insights": [
        "Stay hydrated and wear sunscreen.",
        "Provide shaded areas for guests.",
        "Keep drinks cool to enjoy the sunny weather."
      ]
    }
      
    Now process the following input:

    ${JSON.stringify(input)}}
  `;

    const response = await createAiClient(c).chat(prompt);

    const result = JSON.parse(response) as WeatherInsightsResult;

    return result;
  };

  return {
    getInsights,
  };
};
