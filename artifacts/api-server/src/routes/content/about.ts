import { Router } from "express";
import { db, aboutContentTable } from "@workspace/db";
import { UpdateAboutBody } from "@workspace/api-zod";

const router = Router();

router.get("/content/about", async (req, res): Promise<void> => {
  const rows = await db.select().from(aboutContentTable).limit(1);
  if (rows.length === 0) {
    const inserted = await db.insert(aboutContentTable).values({ id: 1 }).returning();
    res.json(inserted[0]);
    return;
  }
  res.json(rows[0]);
});

router.put("/content/about", async (req, res): Promise<void> => {
  const parsed = UpdateAboutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { bio1, bio2, stats } = parsed.data;
  const rows = await db.select().from(aboutContentTable).limit(1);
  if (rows.length === 0) {
    const inserted = await db.insert(aboutContentTable)
      .values({ id: 1, bio1, bio2, stats })
      .returning();
    res.json(inserted[0]);
    return;
  }
  const updated = await db.update(aboutContentTable)
    .set({ bio1, bio2, stats })
    .returning();
  res.json(updated[0]);
});

export default router;
