import { pgTable, varchar, timestamp, decimal, text } from "drizzle-orm/pg-core";

export const eggs = pgTable("eggs", {
  id: varchar("id", { length: 21 }).primaryKey(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  hint1: text("hint1"),
  hint2: text("hint2"),
  hint3: text("hint3"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Egg = typeof eggs.$inferSelect;
export type NewEgg = typeof eggs.$inferInsert;
