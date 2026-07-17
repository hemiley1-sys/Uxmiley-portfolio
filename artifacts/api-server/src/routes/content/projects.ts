import { Router } from "express";
import { asc, eq } from "drizzle-orm";
import { db, projectsTable } from "@workspace/db";
import {
  CreateProjectBody, UpdateProjectBody, UpdateProjectParams, DeleteProjectParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/content/projects", async (req, res): Promise<void> => {
  const rows = await db.select().from(projectsTable).orderBy(asc(projectsTable.sortOrder));
  res.json(rows);
});

router.post("/content/projects", async (req, res): Promise<void> => {
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const inserted = await db.insert(projectsTable).values(parsed.data).returning();
  res.status(201).json(inserted[0]);
});

router.put("/content/projects/:id", async (req, res): Promise<void> => {
  const paramParsed = UpdateProjectParams.safeParse({ id: Number(req.params.id) });
  if (!paramParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateProjectBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const updated = await db.update(projectsTable).set(parsed.data).where(eq(projectsTable.id, paramParsed.data.id)).returning();
  if (updated.length === 0) { res.status(404).json({ error: "Not found" }); return; }
  res.json(updated[0]);
});

router.delete("/content/projects/:id", async (req, res): Promise<void> => {
  const paramParsed = DeleteProjectParams.safeParse({ id: Number(req.params.id) });
  if (!paramParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(projectsTable).where(eq(projectsTable.id, paramParsed.data.id));
  res.status(204).send();
});

export default router;
