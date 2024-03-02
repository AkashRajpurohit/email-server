import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Bindings } from './types';
import { authMiddleware } from './middleware';
import { sendEmail } from './email';
import emailSchema from './zod';

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

	try {
		const response = await sendEmail(email, c.env);
		return c.json(response, response.status || 200);
	} catch (err) {
		return c.json({ success: false, message: err.message }, 400);
	}
});

app.notFound((c) => c.json({ ok: false, message: 'Not Found' }, 404));

app.onError((err, c) => {
	console.error(err);
	return c.json({ success: false, message: err.message }, 500);
});

export default app;
