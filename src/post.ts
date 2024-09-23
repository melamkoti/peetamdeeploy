import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();
router.get("/", async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        date: "desc",
      },
      take: 3,
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching posts." });
  }
});
export default router;
