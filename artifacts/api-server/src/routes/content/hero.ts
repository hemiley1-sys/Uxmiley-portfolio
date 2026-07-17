import { Router } from "express";
import { db, heroContentTable } from "@workspace/db";
import { UpdateHeroBody } from "@workspace/api-zod";

const router = Router();

router.get("/content/hero", async (req, res): Promise<void> => {
  const rows = await db.select().from(heroContentTable).limit(1);
  if (rows.length === 0) {
    const inserted = await db.insert(heroContentTable).values({ id: 1 }).returning();
    res.json(inserted[0]);
    return;
  }
  res.json(rows[0]);
});

router.put("/content/hero", async (req, res): Promise<void> => {
  const parsed = UpdateHeroBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { name, role, tagline, location, availabilityStatus, ctaLabel, resumeUrl } = parsed.data;
  const rows = await db.select().from(heroContentTable).limit(1);
  if (rows.length === 0) {
    const inserted = await db.insert(heroContentTable)
      .values({ id: 1, name, role, tagline, location, availabilityStatus, ctaLabel, resumeUrl })
      .returning();
    res.json(inserted[0]);
    return;
  }
  const updated = await db.update(heroContentTable)
    .set({ name, role, tagline, location, availabilityStatus, ctaLabel, resumeUrl })
    .returning();
  res.json(updated[0]);
});

export default router;
