import { createWeatherInsightsController } from 'controllers/weather-insights.controller';
import { Hono } from 'hono';

const app = new Hono<{ Bindings: Env }>();

const requireApiKey = async (c: any, next: any) => {
  const apiKey = c.req.query('apikey') || c.req.header('x-api-key');
  const expectedKey = c.env.API_KEY;

  if (!apiKey || apiKey !== expectedKey) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  await next();
};

// app.use('/weather/*', requireApiKey);
app.route('/weather', createWeatherInsightsController(app));

export default app;
