import { Router } from "express";
import { asc, eq } from "drizzle-orm";
import { db, articlesTable } from "@workspace/db";
import {
  CreateArticleBody, UpdateArticleBody, UpdateArticleParams, DeleteArticleParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/content/articles", async (req, res): Promise<void> => {
  const rows = await db.select().from(articlesTable).orderBy(asc(articlesTable.sortOrder));
  res.json(rows);
});

router.post("/content/articles", async (req, res): Promise<void> => {
  const parsed = CreateArticleBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const inserted = await db.insert(articlesTable).values(parsed.data).returning();
  res.status(201).json(inserted[0]);
});

router.put("/content/articles/:id", async (req, res): Promise<void> => {
  const paramParsed = UpdateArticleParams.safeParse({ id: Number(req.params.id) });
  if (!paramParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateArticleBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const updated = await db.update(articlesTable).set(parsed.data).where(eq(articlesTable.id, paramParsed.data.id)).returning();
  if (updated.length === 0) { res.status(404).json({ error: "Not found" }); return; }
  res.json(updated[0]);
});

router.delete("/content/articles/:id", async (req, res): Promise<void> => {
  const paramParsed = DeleteArticleParams.safeParse({ id: Number(req.params.id) });
  if (!paramParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(articlesTable).where(eq(articlesTable.id, paramParsed.data.id));
  res.status(204).send();
});

export default router;
