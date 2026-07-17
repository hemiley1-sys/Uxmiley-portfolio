import { Router } from "express";
import { asc, eq } from "drizzle-orm";
import { db, testimonialsTable } from "@workspace/db";
import {
  CreateTestimonialBody, UpdateTestimonialBody, UpdateTestimonialParams, DeleteTestimonialParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/content/testimonials", async (req, res): Promise<void> => {
  const rows = await db.select().from(testimonialsTable).orderBy(asc(testimonialsTable.sortOrder));
  res.json(rows);
});

router.post("/content/testimonials", async (req, res): Promise<void> => {
  const parsed = CreateTestimonialBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const inserted = await db.insert(testimonialsTable).values(parsed.data).returning();
  res.status(201).json(inserted[0]);
});

router.put("/content/testimonials/:id", async (req, res): Promise<void> => {
  const paramParsed = UpdateTestimonialParams.safeParse({ id: Number(req.params.id) });
  if (!paramParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateTestimonialBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const updated = await db.update(testimonialsTable).set(parsed.data).where(eq(testimonialsTable.id, paramParsed.data.id)).returning();
  if (updated.length === 0) { res.status(404).json({ error: "Not found" }); return; }
  res.json(updated[0]);
});

router.delete("/content/testimonials/:id", async (req, res): Promise<void> => {
  const paramParsed = DeleteTestimonialParams.safeParse({ id: Number(req.params.id) });
  if (!paramParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(testimonialsTable).where(eq(testimonialsTable.id, paramParsed.data.id));
  res.status(204).send();
});

export default router;
