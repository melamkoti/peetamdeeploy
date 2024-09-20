"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const addToWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, productId } = req.body;
    try {
        let wishlist = yield prisma.wishlist.findUnique({
            where: { userId },
            include: { products: true },
        });
        if (!wishlist) {
            wishlist = yield prisma.wishlist.create({
                data: { user: { connect: { id: userId } } },
            });
        }
        // Check if the product is already in the wishlist
        const existingProduct = yield prisma.wishlistProduct.findFirst({
            where: { wishlistId: wishlist.id, productId },
        });
        if (existingProduct) {
            return res.status(400).json({ message: "Product already in wishlist" });
        }
        yield prisma.wishlistProduct.create({
            data: { wishlistId: wishlist.id, productId },
        });
        res.status(200).json({ message: "Product added to wishlist" });
    }
    catch (error) {
        res.status(500).json({ message: "it gettin an error" });
    }
});
module.exports = addToWishlist;
