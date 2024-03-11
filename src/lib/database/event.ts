import { SupabaseDatabaseService } from '$lib/database/supabaseDatabaseService';
import type { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import { z } from 'zod';
import { eventsRowSchema, eventsUpdateSchema } from '$schemas/supabase';
import type { Infer } from 'sveltekit-superforms';
import type { FormSchema } from '$schemas/settingsSchema';

const EventsRowSchemaArray = z.array(eventsRowSchema);

export class EventSupabaseDatabaseService extends SupabaseDatabaseService {
	/**
	 * Create a new event in the database.
	 * @param {EventRow} input - The data for the new event.
	 * @returns {Promise<EventRow>} - Returns a promise that resolves to the newly created event.
	 * @throws {Error} - Throws an error if there's an issue creating the event.
	 */
	async createEvent(input: Infer<FormSchema>): Promise<EventRow | null> {
		try {
			const parsedEvent = eventsRowSchema.partial().parse(input);

			// Insert the new event into the 'events' table
			const res: PostgrestSingleResponse<EventRow> = await this.supabaseClient
				.from('events')
				.insert(parsedEvent)
				.select()
				.single();

			this.validateAndHandleErrors(res, eventsRowSchema);

			// Return the newly created event
			return res.data;
		} catch (error) {
			// If an error occurs while creating the event, log it and rethrow it
			console.error('An error occurred while creating the event:', error);
			throw error;
		}
	}

	/**
	 * Load an event from the database.
	 * @param {string} event_id - The ID of the event to load.
	 * @returns {Promise<EventRow>} - Returns a promise that resolves to the loaded event.
	 * @throws {Error} - Throws an error if there's an issue loading the event.
	 */
	async loadEvent(event_id: number): Promise<EventRow | null> {
		try {
			// Load the event from the 'events' table
			const res: PostgrestSingleResponse<EventRow> = await this.supabaseClient
				.from('events')
				.select('*')
				.eq('id', event_id)
				.single();

			this.validateAndHandleErrors(res, eventsRowSchema);

			// Return the loaded event
			return res.data;
		} catch (error) {
			// If an error occurs while loading the event, log it and rethrow it
			console.error('An error occurred while loading the event:', error);
			throw error;
		}
	}

	/**
	 * Update the details of a tournament in the database.
	 * @param {EventRow} input - The new data for the tournament.
	 * @returns {Promise<EventRow>} - Returns a promise that resolves to the updated tournament.
	 * @throws {Error} - Throws an error if there's an issue updating the tournament.
	 */
	async updateEvent(id: number, input: Infer<FormSchema>): Promise<EventRow | null> {
		try {
			const parsedEvent = eventsUpdateSchema.parse(input);

			// Update the tournament in the 'events' table
			const res: PostgrestResponse<EventRow> = await this.supabaseClient
				.from('events')
				.update(parsedEvent)
				.eq('id', id)
				.select()
				.single();

			this.validateAndHandleErrors(res, eventsRowSchema);

			// Return the updated tournament
			return res.data;
		} catch (error) {
			// If an error occurs while updating the tournament, log it and rethrow it
			console.error('An error occurred while updating the tournament:', error);
			throw error;
		}
	}

	/**
	 * Delete an event from the database.
	 * @param {string} event_id - The ID of the event to delete.
	 * @returns {Promise<void>} - Returns a promise that resolves when the event has been deleted.
	 * @throws {Error} - Throws an error if there's an issue deleting the event.
	 */
	async deleteEvent(event_id: number): Promise<void> {
		try {
			// Delete the event from the 'events' table
			const res: PostgrestSingleResponse<EventRow | null> = await this.supabaseClient
				.from('events')
				.delete()
				.eq('id', event_id);

			// Handle any errors that may have occurred during the database operation
			this.handleDatabaseError(res);
		} catch (error) {
			// If an error occurs while deleting the event, log it and rethrow it
			console.error('An error occurred while deleting the event:', error);
			throw error;
		}
	}

	/**
	 * Load all events owned by a specific user from the database.
	 * @param {string} ownerId - The ID of the owner whose events to load.
	 * @returns {Promise<EventRow[]>} - Returns a promise that resolves to an array of the loaded events.
	 * @throws {Error} - Throws an error if there's an issue loading the events.
	 */
	async loadEvents(ownerId: string): Promise<EventRow[]> {
		// Load the events from the 'events' table
		const res = await this.supabaseClient.from('events').select('*').eq('owner', ownerId);

		this.validateAndHandleErrors(res, EventsRowSchemaArray);

		// Return the loaded events or an empty array if no events were found
		return res.data ?? [];
	}

	async getEvents(): Promise<EventRow[] | null> {
		const res = await this.supabaseClient
			.from('events')
			.select('*')
			.gte('date', new Date().toISOString());

		this.validateAndHandleErrors(res, EventsRowSchemaArray);

		return res.data;
	}
}
