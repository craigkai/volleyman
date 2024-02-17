// Generated by ts-to-zod
import { z } from "zod";
import type { Json } from "./supabase";

export const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
  z
    .union([
      z.string(),
      z.number(),
      z.boolean(),
      z.record(z.union([jsonSchema, z.undefined()])),
      z.array(jsonSchema),
    ])
    .nullable(),
);

export const bracketsRowSchema = z.object({
  court: z.number().nullable(),
  created_at: z.string(),
  event_id: z.number(),
  id: z.number(),
  parent_id: z.number().nullable(),
  round: z.number().nullable(),
  team1: z.number(),
  team1_score: z.number().nullable(),
  team2: z.number(),
  team2_score: z.number().nullable(),
});

export const bracketsInsertSchema = z.object({
  court: z.number().optional().nullable(),
  created_at: z.string().optional(),
  event_id: z.number(),
  id: z.number().optional(),
  parent_id: z.number().optional().nullable(),
  round: z.number().optional().nullable(),
  team1: z.number(),
  team1_score: z.number().optional().nullable(),
  team2: z.number(),
  team2_score: z.number().optional().nullable(),
});

export const bracketsUpdateSchema = z.object({
  court: z.number().optional().nullable(),
  created_at: z.string().optional(),
  event_id: z.number().optional(),
  id: z.number().optional(),
  parent_id: z.number().optional().nullable(),
  round: z.number().optional().nullable(),
  team1: z.number().optional(),
  team1_score: z.number().optional().nullable(),
  team2: z.number().optional(),
  team2_score: z.number().optional().nullable(),
});

export const eventsRowSchema = z.object({
  courts: z.number().nullable(),
  created_at: z.string(),
  date: z.string().nullable(),
  id: z.number(),
  name: z.string(),
  owner: z.string(),
  pools: z.number().nullable(),
  refs: z.string().nullable(),
  scoring: z.string().nullable(),
});

export const eventsInsertSchema = z.object({
  courts: z.number().optional().nullable(),
  created_at: z.string().optional(),
  date: z.string().optional().nullable(),
  id: z.number().optional(),
  name: z.string(),
  owner: z.string(),
  pools: z.number().optional().nullable(),
  refs: z.string().optional().nullable(),
  scoring: z.string().optional().nullable(),
});

export const eventsUpdateSchema = z.object({
  courts: z.number().optional().nullable(),
  created_at: z.string().optional(),
  date: z.string().optional().nullable(),
  id: z.number().optional(),
  name: z.string().optional(),
  owner: z.string().optional(),
  pools: z.number().optional().nullable(),
  refs: z.string().optional().nullable(),
  scoring: z.string().optional().nullable(),
});

export const matchesRowSchema = z.object({
  court: z.number(),
  created_at: z.string(),
  event_id: z.number(),
  id: z.number(),
  ref: z.number().nullable(),
  round: z.number(),
  team1: z.number(),
  team1_score: z.number().nullable(),
  team2: z.number(),
  team2_score: z.number().nullable(),
  type: z.string(),
});

export const matchesInsertSchema = z.object({
  court: z.number().optional(),
  created_at: z.string().optional(),
  event_id: z.number(),
  id: z.number().optional(),
  ref: z.number().optional().nullable(),
  round: z.number().optional(),
  team1: z.number(),
  team1_score: z.number().optional().nullable(),
  team2: z.number(),
  team2_score: z.number().optional().nullable(),
  type: z.string().optional(),
});

export const matchesUpdateSchema = z.object({
  court: z.number().optional(),
  created_at: z.string().optional(),
  event_id: z.number().optional(),
  id: z.number().optional(),
  ref: z.number().optional().nullable(),
  round: z.number().optional(),
  team1: z.number().optional(),
  team1_score: z.number().optional().nullable(),
  team2: z.number().optional(),
  team2_score: z.number().optional().nullable(),
  type: z.string().optional(),
});

export const teamsRowSchema = z.object({
  created_at: z.string().nullable(),
  event_id: z.number().nullable(),
  id: z.number(),
  name: z.string(),
  state: z.string().nullable(),
});

export const teamsInsertSchema = z.object({
  created_at: z.string().optional().nullable(),
  event_id: z.number().optional().nullable(),
  id: z.number().optional(),
  name: z.string(),
  state: z.string().optional().nullable(),
});

export const teamsUpdateSchema = z.object({
  created_at: z.string().optional().nullable(),
  event_id: z.number().optional().nullable(),
  id: z.number().optional(),
  name: z.string().optional(),
  state: z.string().optional().nullable(),
});
