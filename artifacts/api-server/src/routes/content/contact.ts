import { Router } from "express";
import { db, contactContentTable } from "@workspace/db";
import { UpdateContactBody } from "@workspace/api-zod";

const router = Router();

router.get("/content/contact", async (req, res): Promise<void> => {
  const rows = await db.select().from(contactContentTable).limit(1);
  if (rows.length === 0) {
    const inserted = await db.insert(contactContentTable).values({ id: 1 }).returning();
    res.json(inserted[0]);
    return;
  }
  res.json(rows[0]);
});

router.put("/content/contact", async (req, res): Promise<void> => {
  const parsed = UpdateContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email, location, timezone, twitter, linkedin, github, dribbble } = parsed.data;
  const rows = await db.select().from(contactContentTable).limit(1);
  if (rows.length === 0) {
    const inserted = await db.insert(contactContentTable)
      .values({ id: 1, email, location, timezone, twitter, linkedin, github, dribbble })
      .returning();
    res.json(inserted[0]);
    return;
  }
  const updated = await db.update(contactContentTable)
    .set({ email, location, timezone, twitter, linkedin, github, dribbble })
    .returning();
  res.json(updated[0]);
});

export default router;
