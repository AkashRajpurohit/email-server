import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Bindings } from './types';
import { authMiddleware } from './middleware';
import { sendEmail } from './email';
import emailSchema, { Email } from './zod';

const app = new Hono<{ Bindings: Bindings }>();

// Middlewares
app.use('*', cors());

// Routes
app.get('/', (c) => {
  return c.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 302);
});

app.post('/send', authMiddleware(), async (c) => {
  const email = await c.req.json();
  const result = emailSchema.safeParse(email);

  if (!result.success) {
    return c.json({ success: false, issues: result.error.flatten() }, 400);
  }

  const response = await sendEmail(email);
  return c.json(response, response.success ? 200 : 400);
});

app.notFound((c) => c.json({ ok: false, message: 'Not Found' }, 404));

export default app;
