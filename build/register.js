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
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "vlacksolutions";
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "User already exits" });
        }
        const hashedpassword = yield bcrypt.hash(password, 10);
        const user = yield prisma.user.create({
            data: { name, email, password: hashedpassword },
        });
        res.status(201).json({ message: "User Created", user });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ error: "User not found" });
        }
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: "Invalid Credentials" });
        }
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ message: "Singin Successfully ", token });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.get("/me", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decode = jwt.verify(token, JWT_SECRET);
        const user = yield prisma.user.findUnique({ where: { id: decode.userId } });
        res.json({ user });
    }
    catch (error) {
        res.status(401).json({ error: "invalid token" });
    }
}));
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const generateOTP = () => {
    return crypto.randomBytes(3).toString("hex");
};
router.post("/sendotp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);
    yield prisma.user.update({
        where: { email },
        data: { otp, otpExpiry: expiry },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your password Reset OTP",
        text: `Your OTP is ${otp}. It will expire in 15 minutes`,
    };
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            return res.status(500).json({ error: "Failed to send email" });
        }
        res.status(200).json({ message: "OTP sent to email" });
    });
}));
router.post("/verifyotp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    try {
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }
        res.status(200).json({ message: "OTP verified successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.post("/resetpassword", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, newpassword, reenterpassword } = req.body;
    try {
        if (newpassword !== reenterpassword) {
            return res.status(400).json({ error: "passwords do not match" });
        }
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({ error: "Invalid or Expired OTP" });
        }
        const hashedpassword = yield bcrypt.hash(newpassword, 10);
        yield prisma.user.update({
            where: { email },
            data: { password: hashedpassword, otp: null, otpExpiry: null },
        });
        res.status(200).json({ message: "Password Reset successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));
module.exports = router;
