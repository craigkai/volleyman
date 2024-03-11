import type { PageLoad } from './$types';
import { Event } from '$lib/event';
import { EventSupabaseDatabaseService } from '$lib/database/event';
import { superValidate, type Infer, type SuperValidated } from 'sveltekit-superforms';
import { formSchema as settingsSchema, type FormSchema } from '$schemas/settingsSchema';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageLoad = async ({ params, parent }) => {
	const { supabase } = await parent();

	if (params.slug === 'create') {
		const form: SuperValidated<Infer<FormSchema>> = await superValidate(zod(settingsSchema));

		return { event_id: params.slug, form };
	}

	const eventSupabaseDatabaseService = new EventSupabaseDatabaseService(supabase);
	let tournament = new Event(params.slug as unknown as number, eventSupabaseDatabaseService);
	await tournament.load().catch((error) => {
		console.error('Failed to load event:', error);
	});

	const form: SuperValidated<Infer<FormSchema>> = await superValidate(
		{
			name: tournament.name,
			courts: tournament.courts,
			pools: tournament.pools,
			ref: tournament.refs,
			date: tournament.date,
			scoring: tournament.scoring
		},
		zod(settingsSchema)
	);

	return { event_id: params.slug, form };
};
