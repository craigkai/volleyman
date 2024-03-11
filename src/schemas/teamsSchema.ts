import { z } from 'zod';

export const formSchema = z.object({
	name: z.string().refine((v) => v, { message: 'A team name is required.' }),
	event_id: z.coerce.number().refine((v) => v, { message: 'An event id is required.' }),
	id: z.coerce.number().optional()
});

export type FormSchema = typeof formSchema;
