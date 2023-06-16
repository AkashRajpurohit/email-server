import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Bindings } from './types';
import { authMiddleware, emailBodyValidator } from './middleware';
import { sendEmail } from './email';
import { Email } from './zod';

const app = new Hono<{ Bindings: Bindings }>();

// Middlewares
app.use('*', cors());

// Routes
app.get('/', (c) => {
  return c.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 302);
});

app.post('/send', authMiddleware(), emailBodyValidator(), async (c) => {
  const email = (await c.req.json()) as Email;
  const response = await sendEmail(email);
  return c.json(response);
});

app.notFound((c) => c.json({ ok: false, message: 'Not Found' }, 404));

export default app;
