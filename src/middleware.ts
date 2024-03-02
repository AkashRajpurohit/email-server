import { Context, MiddlewareHandler } from 'hono';
import { Bindings } from './types';

export const authMiddleware = (): MiddlewareHandler => {
	return async (c: Context<{ Bindings: Bindings }>, next) => {
		const token = c.req.header('Authorization');

		// Strict check for token existence
		if (!c.env.TOKEN || c.env.TOKEN.length === 0) {
			return c.json(
				{
					success: false,
					message: 'You must set the TOKEN environment variable.',
				},
				500
			);
		}

		if (token !== c.env.TOKEN) {
			return c.json({ success: false, message: 'Missing authorization' }, 401);
		}

		await next();
	};
};
