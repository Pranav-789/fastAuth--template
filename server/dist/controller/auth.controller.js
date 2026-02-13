import { prisma } from "../db/prisma.js";
import bcrypt from "bcryptjs";
export const registerUser = async (req, res) => {
    const { email, name, password } = req.body;
    try {
        if (!email?.trim() || !name?.trim() || !password?.trim()) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const normEmail = email.toLowerCase().trim();
        const existingUser = await prisma.user.findUnique({ where: { email: normEmail }, });
        if (existingUser) {
            return res.status(400).json({ message: "The user with this email already exists, failed to register" });
        }
        // const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email: normEmail,
                name: name,
                password: hashedPassword
            },
        });
        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name
            }
        });
    }
    catch (error) {
        console.log("Error occured in creating a user");
        res.status(500).json({ message: "Failed to create a new user!!" });
        return res;
    }
};
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email?.trim() || !password?.trim()) {
            return res.status(400).json({ message: "All fields are required!!" });
        }
        const normEmail = email.trim();
        const user = await prisma.user.findUnique({
            where: { email: normEmail },
        });
        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        return res.status(201).json({
            message: "Login successfull!!",
            data: {
                email: user.email,
                name: user.name,
                id: user.id
            }
        });
    }
    catch (error) {
    }
};
