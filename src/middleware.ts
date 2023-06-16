import { Context, MiddlewareHandler } from 'hono';
import { Bindings } from './types';
import emailSchema from './zod';

export const authMiddleware = (): MiddlewareHandler => {
  return async (c: Context<{ Bindings: Bindings }>, next) => {
    const token = c.req.headers.get('Authorization');

    // Strict check for token existence
    if (!c.env.TOKEN || c.env.TOKEN.length === 0) {
      return c.json(
        {
          success: false,
          message: 'You must set the TOKEN environment variable.',
        },
        401,
      );
    }

    if (token !== c.env.TOKEN) {
      return c.json({ success: false, message: 'Missing authorization' }, 401);
    }

    await next();
  };
};

export const emailBodyValidator = (): MiddlewareHandler => {
  return async (c: Context<{ Bindings: Bindings }>, next) => {
    const content = await c.req.json();
    const result = emailSchema.safeParse(content);
    if (!result.success) {
      return c.json({ success: false, issues: result.error.flatten() }, 400);
    }

    await next();
  };
};
