// Fallback database using simple file-based storage for testing
// This allows the app to work without PostgreSQL for development

import * as schema from "./schema";
import type { Egg, NewEgg } from "./schema";

// In-memory storage for testing
const memoryStore: Map<string, Egg> = new Map();

export const db = {
  insert: (table: typeof schema.eggs) => ({
    values: async (data: NewEgg) => {
      memoryStore.set(data.id, {
        id: data.id,
        latitude: data.latitude,
        longitude: data.longitude,
        createdAt: new Date(),
      });
      return { rowCount: 1 };
    },
  }),
  select: () => ({
    from: (table: typeof schema.eggs) => ({
      where: (condition: { id: string }) => {
        const egg = memoryStore.get(condition.id);
        return egg ? [egg] : [];
      },
    }),
  }),
};

// Helper to get egg by ID
export async function getEggById(id: string): Promise<Egg | null> {
  const egg = memoryStore.get(id);
  return egg || null;
}

// Helper to create egg
export async function createEgg(data: NewEgg): Promise<void> {
  memoryStore.set(data.id, {
    id: data.id,
    latitude: data.latitude,
    longitude: data.longitude,
    createdAt: new Date(),
  });
}
