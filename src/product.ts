import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findMany();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

export default router;
