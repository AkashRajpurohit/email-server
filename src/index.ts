import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// Middlewares
app.use('*', cors());

// Routes
app.get('/', (c) => {
  return c.redirect(
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    302
  );
});

app.notFound((c) => c.json({ ok: false, message: 'Not Found' }, 404));

export default app;
