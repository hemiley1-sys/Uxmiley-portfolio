import { pgTable, text, integer, jsonb } from "drizzle-orm/pg-core";

export const aboutContentTable = pgTable("about_content", {
  id: integer("id").primaryKey().default(1),
  bio1: text("bio1").notNull().default("I am a hybrid UI/UX Designer and Web Developer based in San Francisco, crafting digital products at the intersection of beauty and logic. With 7+ years of experience, I turn complex problems into elegant, intuitive solutions."),
  bio2: text("bio2").notNull().default("My approach bridges design thinking and engineering precision — I prototype ideas rapidly, validate them with users, and ship with the same care that went into designing them."),
  stats: jsonb("stats").notNull().default([
    { value: "7+", label: "Years Experience" },
    { value: "50+", label: "Projects Shipped" },
    { value: "30+", label: "Happy Clients" },
    { value: "12+", label: "Design Awards" },
  ]),
});

export type AboutContent = typeof aboutContentTable.$inferSelect;
export type InsertAboutContent = typeof aboutContentTable.$inferInsert;
