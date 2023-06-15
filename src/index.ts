import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Middlewares
app.use('*', cors());

// Routes
app.get('/', (c) => {
  return c.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 302);
});

app.post('/send', (c) => {
  const { TOKEN } = c.env;
  const authToken = c.req.headers.get('Authorization');

  if (authToken !== TOKEN) {
    return c.json({ success: false, message: 'Missing authorization' });
  }

  return c.json({ success: true });
});

app.notFound((c) => c.json({ ok: false, message: 'Not Found' }, 404));

export default app;
