// Simple in-memory database for demo/testing
import type { Egg, NewEgg } from "./schema";

// In-memory storage
const memoryStore: Map<string, Egg> = new Map();

export const memoryDb = {
  async insertEgg(data: NewEgg): Promise<void> {
    memoryStore.set(data.id, {
      id: data.id,
      latitude: data.latitude,
      longitude: data.longitude,
      createdAt: new Date(),
    });
  },

  async getEggById(id: string): Promise<Egg | null> {
    const egg = memoryStore.get(id);
    return egg || null;
  },

  getAllEggs(): Egg[] {
    return Array.from(memoryStore.values());
  },

  clear(): void {
    memoryStore.clear();
  },
};

// Try to use PostgreSQL if available, otherwise use memory
let usePostgres = false;

try {
  // This will be set up if PostgreSQL is configured
  usePostgres = !!process.env.DATABASE_URL;
} catch {
  usePostgres = false;
}

// Export the appropriate database
export { usePostgres };
