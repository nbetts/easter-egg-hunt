// Simple file-based database for permanent storage
// Uses JSON file for persistence across restarts

import * as schema from "./schema";
import type { Egg, NewEgg } from "./schema";
import { promises as fs } from "fs";
import { existsSync } from "fs";

const DB_FILE = "./easter_egg_hunt_data.json";

interface Database {
  eggs: Egg[];
}

let dbCache: Database | null = null;

async function loadDatabase(): Promise<Database> {
  if (dbCache) return dbCache;
  
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
  
  return dbCache;
}

async function saveDatabase(db: Database): Promise<void> {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
    dbCache = db;
  } catch (error) {
    console.error("Error saving database:", error);
    throw error;
  }
}

// Database operations
export const fileDb = {
  async getEggById(id: string): Promise<Egg | null> {
    const db = await loadDatabase();
    return db.eggs.find((egg) => egg.id === id) || null;
  },

  async insertEgg(eggData: NewEgg): Promise<void> {
    const db = await loadDatabase();
    
    const newEgg: Egg = {
      id: eggData.id,
      latitude: eggData.latitude?.toString() || "0",
      longitude: eggData.longitude?.toString() || "0",
      hint1: eggData.hint1 || null,
      hint2: eggData.hint2 || null,
      hint3: eggData.hint3 || null,
      createdAt: new Date(),
    };
    
    db.eggs.push(newEgg);
    await saveDatabase(db);
  },

  async deleteEgg(id: string): Promise<void> {
    const db = await loadDatabase();
    db.eggs = db.eggs.filter((egg) => egg.id !== id);
    await saveDatabase(db);
  },

  async listAllEggs(): Promise<Egg[]> {
    const db = await loadDatabase();
    return db.eggs;
  },
};

// Re-export schema types
export type { Egg, NewEgg };
export { schema };
