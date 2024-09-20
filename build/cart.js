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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, productId, qty } = req.body;
    try {
        const existingCartItem = yield prisma.cartProduct.findFirst({
            where: { userId, productId },
        });
        if (existingCartItem) {
            const updatedCartItem = yield prisma.cartProduct.update({
                where: { id: existingCartItem.id },
                data: { qty: existingCartItem.qty + qty },
            });
            return res.json(updatedCartItem);
        }
        else {
            const newCartItem = yield prisma.cartProduct.create({
                data: { userId, productId, qty },
            });
            return res.json(newCartItem);
        }
        const cartItems = yield prisma.cartProduct.findMany({
            where: { userId },
        });
        const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
        res.json({ totalItems });
    }
    catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ error: "Failed to add product to cart" });
    }
}));
router.get("/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const cartItems = yield prisma.cartProduct.findMany({
            where: { userId: Number(userId) },
            include: { product: true },
        });
        res.status(200).json(cartItems);
    }
    catch (error) {
        console.error("Error fetching  items:", error);
        res.status(500).json({ error: "Failed to fetch  items" });
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartItems = yield prisma.cartProduct.findMany();
        res.json(cartItems);
    }
    catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ error: "Failed to fetch cart items" });
    }
}));
router.get("/item/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const count = yield prisma.cartProduct.count({
            where: { userId: Number(userId) },
        });
        res.json({ productCount: count });
    }
    catch (error) {
        console.error("Error fetching product count:", error);
        res.status(500).json({ error: "Failed to fetch product count" });
    }
}));
router.put("/update/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartProductId = parseInt(req.params.id, 10);
    const { qty } = req.body;
    if (!qty || qty < 0) {
        return res.status(400).json({ message: "Invalid quantity" });
    }
    try {
        const cartItem = yield prisma.cartProduct.findUnique({
            where: { id: cartProductId },
        });
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }
        const updatedCartItem = yield prisma.cartProduct.update({
            where: { id: cartProductId },
            data: { qty },
        });
        res.status(200).json({ message: "Cart item updated", updatedCartItem });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating cart item", error });
    }
}));
router.delete("/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartProductId = parseInt(req.params.id, 10);
    try {
        const cartItem = yield prisma.cartProduct.findUnique({
            where: {
                id: cartProductId,
            },
        });
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }
        yield prisma.cartProduct.delete({
            where: {
                id: cartProductId,
            },
        });
        return res.status(200).json({ message: "Cart item deleted successfully" });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "An error occurred while deleting the item" });
    }
}));
module.exports = router;
