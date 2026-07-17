import { Router } from "express";
import { asc, eq } from "drizzle-orm";
import { db, skillsTable, servicesTable } from "@workspace/db";
import {
  CreateSkillBody, UpdateSkillBody, UpdateSkillParams, DeleteSkillParams,
  CreateServiceBody, UpdateServiceBody, UpdateServiceParams, DeleteServiceParams,
} from "@workspace/api-zod";

const router = Router();

// ── Skills ──────────────────────────────────────────────────────────
router.get("/content/skills", async (req, res): Promise<void> => {
  const rows = await db.select().from(skillsTable).orderBy(asc(skillsTable.sortOrder));
  res.json(rows);
});

router.post("/content/skills", async (req, res): Promise<void> => {
  const parsed = CreateSkillBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const inserted = await db.insert(skillsTable).values(parsed.data).returning();
  res.status(201).json(inserted[0]);
});

router.put("/content/skills/:id", async (req, res): Promise<void> => {
  const paramParsed = UpdateSkillParams.safeParse({ id: Number(req.params.id) });
  if (!paramParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateSkillBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const updated = await db.update(skillsTable).set(parsed.data).where(eq(skillsTable.id, paramParsed.data.id)).returning();
  if (updated.length === 0) { res.status(404).json({ error: "Not found" }); return; }
  res.json(updated[0]);
});

router.delete("/content/skills/:id", async (req, res): Promise<void> => {
  const paramParsed = DeleteSkillParams.safeParse({ id: Number(req.params.id) });
  if (!paramParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(skillsTable).where(eq(skillsTable.id, paramParsed.data.id));
  res.status(204).send();
});

// ── Services ─────────────────────────────────────────────────────────
router.get("/content/services", async (req, res): Promise<void> => {
  const rows = await db.select().from(servicesTable).orderBy(asc(servicesTable.sortOrder));
  res.json(rows);
});

router.post("/content/services", async (req, res): Promise<void> => {
  const parsed = CreateServiceBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const inserted = await db.insert(servicesTable).values(parsed.data).returning();
  res.status(201).json(inserted[0]);
});

router.put("/content/services/:id", async (req, res): Promise<void> => {
  const paramParsed = UpdateServiceParams.safeParse({ id: Number(req.params.id) });
  if (!paramParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateServiceBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const updated = await db.update(servicesTable).set(parsed.data).where(eq(servicesTable.id, paramParsed.data.id)).returning();
  if (updated.length === 0) { res.status(404).json({ error: "Not found" }); return; }
  res.json(updated[0]);
});

router.delete("/content/services/:id", async (req, res): Promise<void> => {
  const paramParsed = DeleteServiceParams.safeParse({ id: Number(req.params.id) });
  if (!paramParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(servicesTable).where(eq(servicesTable.id, paramParsed.data.id));
  res.status(204).send();
});

export default router;
