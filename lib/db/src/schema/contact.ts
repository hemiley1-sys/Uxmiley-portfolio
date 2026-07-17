import { pgTable, text, integer } from "drizzle-orm/pg-core";

export const contactContentTable = pgTable("contact_content", {
  id: integer("id").primaryKey().default(1),
  email: text("email").notNull().default("hello@uxmiley.com"),
  location: text("location").notNull().default("San Francisco, CA"),
  timezone: text("timezone").notNull().default("PST (UTC-8)"),
  twitter: text("twitter"),
  linkedin: text("linkedin"),
  github: text("github"),
  dribbble: text("dribbble"),
});

export type ContactContent = typeof contactContentTable.$inferSelect;
export type InsertContactContent = typeof contactContentTable.$inferInsert;
