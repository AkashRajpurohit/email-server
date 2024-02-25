import { z } from 'zod';

const contactSchema = z.union([
	z.string(),
	z.object({
		email: z.string(),
		name: z.union([z.string(), z.undefined()]),
	}),
]);

const emailSchema = z.object({
	to: z.union([contactSchema, z.array(contactSchema)]),
	replyTo: z.union([contactSchema, z.array(contactSchema)]).optional(),
	cc: z.union([contactSchema, z.array(contactSchema)]).optional(),
	bcc: z.union([contactSchema, z.array(contactSchema)]).optional(),
	from: contactSchema,
	subject: z.string(),
	text: z.union([z.string(), z.undefined()]),
	html: z.union([z.string(), z.undefined()]),
});

export type Contact = z.infer<typeof contactSchema>;
export type Email = z.infer<typeof emailSchema>;

export default emailSchema;
