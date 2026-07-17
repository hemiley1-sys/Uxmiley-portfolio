import { Router } from "express";
import { asc, eq } from "drizzle-orm";
import { db, experiencesTable } from "@workspace/db";
import {
  CreateExperienceBody, UpdateExperienceBody, UpdateExperienceParams, DeleteExperienceParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/content/experiences", async (req, res): Promise<void> => {
  const rows = await db.select().from(experiencesTable).orderBy(asc(experiencesTable.sortOrder));
  res.json(rows);
});

router.post("/content/experiences", async (req, res): Promise<void> => {
  const parsed = CreateExperienceBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const inserted = await db.insert(experiencesTable).values(parsed.data).returning();
  res.status(201).json(inserted[0]);
});

router.put("/content/experiences/:id", async (req, res): Promise<void> => {
  const paramParsed = UpdateExperienceParams.safeParse({ id: Number(req.params.id) });
  if (!paramParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateExperienceBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const updated = await db.update(experiencesTable).set(parsed.data).where(eq(experiencesTable.id, paramParsed.data.id)).returning();
  if (updated.length === 0) { res.status(404).json({ error: "Not found" }); return; }
  res.json(updated[0]);
});

router.delete("/content/experiences/:id", async (req, res): Promise<void> => {
  const paramParsed = DeleteExperienceParams.safeParse({ id: Number(req.params.id) });
  if (!paramParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(experiencesTable).where(eq(experiencesTable.id, paramParsed.data.id));
  res.status(204).send();
});

export default router;
