import { pgTable, text, integer } from "drizzle-orm/pg-core";

export const heroContentTable = pgTable("hero_content", {
  id: integer("id").primaryKey().default(1),
  name: text("name").notNull().default("UXMiley"),
  role: text("role").notNull().default("UI/UX Designer & Web Developer"),
  tagline: text("tagline").notNull().default("Designing experiences that feel inevitable."),
  location: text("location").notNull().default("San Francisco, CA"),
  availabilityStatus: text("availability_status").notNull().default("Available for new opportunities"),
  ctaLabel: text("cta_label").notNull().default("View My Work"),
  resumeUrl: text("resume_url").notNull().default("/resume.pdf"),
});

export type HeroContent = typeof heroContentTable.$inferSelect;
export type InsertHeroContent = typeof heroContentTable.$inferInsert;
