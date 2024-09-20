import express, { Request, Response } from "express";

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const addToWishlist = async (req: Request, res: Response) => {
  const { userId, productId } = req.body;

  try {
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: { products: true },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { user: { connect: { id: userId } } },
      });
    }

    // Check if the product is already in the wishlist
    const existingProduct = await prisma.wishlistProduct.findFirst({
      where: { wishlistId: wishlist.id, productId },
    });

    if (existingProduct) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    await prisma.wishlistProduct.create({
      data: { wishlistId: wishlist.id, productId },
    });

    res.status(200).json({ message: "Product added to wishlist" });
  } catch (error) {
    res.status(500).json({ message: "it gettin an error" });
  }
};
module.exports = addToWishlist;
