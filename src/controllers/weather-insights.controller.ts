import { Hono } from 'hono';
import { createWeatherInsightsService } from 'services/weather-insights.service';

export const createWeatherInsightsController = (
  app: Hono<{ Bindings: Env }>
) => {
  app.post('/insights', async (c) => {
    const body = await c.req.json();

    try {
      const result = await createWeatherInsightsService(c).getInsights(body);
      return c.json(result);
    } catch (err: any) {
      return c.json({ error: err.message || 'Unexpected error' }, 500);
    }
  });

  return app;
};
