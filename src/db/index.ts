import type { Egg, NewEgg } from "./schema";
import { promises as fs } from "fs";
import { existsSync } from "fs";
import path from "path";

// JSON file database for permanent storage
// Stores data in a file that persists across restarts
const DB_FILE = path.join(process.cwd(), "easter_egg_hunt_data.json");

interface Database {
  eggs: Egg[];
}

let dbCache: Database | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 1000; // 1 second cache

async function loadDatabase(): Promise<Database> {
  const now = Date.now();
  
  // Use cache if fresh
  if (dbCache && (now - cacheTimestamp) < CACHE_TTL) {
    return dbCache;
  }
  
  try {
    if (existsSync(DB_FILE)) {
      const data = await fs.readFile(DB_FILE, "utf-8");
      dbCache = JSON.parse(data);
    } else {
      dbCache = { eggs: [] };
    }
  } catch (error) {
    console.error("Error loading database:", error);
    dbCache = { eggs: [] };
  }
  
  cacheTimestamp = now;
  return dbCache;
}

async function saveDatabase(db: Database): Promise<void> {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
    dbCache = db;
    cacheTimestamp = Date.now();
  } catch (error) {
    console.error("Error saving database:", error);
    throw error;
  }
}

// Database operations
export const db = {
  async select(): Promise<{ from: (table: any) => { where: (condition: any) => Promise<Egg[]> } }> {
    return {
      from: () => ({
        where: async (condition: { id: string }) => {
          const database = await loadDatabase();
          const egg = database.eggs.find((e) => e.id === condition.id);
          return egg ? [egg] : [];
        },
      }),
    };
  },

  async insert(table: any) {
    return {
      values: async (eggData: NewEgg) => {
        const database = await loadDatabase();
        
        const newEgg: Egg = {
          id: eggData.id,
          latitude: eggData.latitude?.toString() || "0",
          longitude: eggData.longitude?.toString() || "0",
          hint1: eggData.hint1 || null,
          hint2: eggData.hint2 || null,
          hint3: eggData.hint3 || null,
          createdAt: new Date().toISOString(),
        };
        
        database.eggs.push(newEgg);
        await saveDatabase(database);
        return { rowCount: 1 };
      },
    };
  },

  // Direct access methods
  async getEggById(id: string): Promise<Egg | null> {
    const database = await loadDatabase();
    return database.eggs.find((e) => e.id === id) || null;
  },

  async createEgg(eggData: NewEgg): Promise<void> {
    const database = await loadDatabase();
    
    const newEgg: Egg = {
      id: eggData.id,
      latitude: eggData.latitude?.toString() || "0",
      longitude: eggData.longitude?.toString() || "0",
      hint1: eggData.hint1 || null,
      hint2: eggData.hint2 || null,
      hint3: eggData.hint3 || null,
      createdAt: new Date().toISOString(),
    };
    
    database.eggs.push(newEgg);
    await saveDatabase(database);
  },

  async listAllEggs(): Promise<Egg[]> {
    const database = await loadDatabase();
    return database.eggs;
  },

  async clearAll(): Promise<void> {
    await saveDatabase({ eggs: [] });
  },
};
