import { Request, Response } from "express";
import { prisma } from "../db/prisma.js";

export const userme = async(req: Request, res: Response) => {
    const user = req.user;

    if(!user){
        return res.status(401).json({message: "Invalid access"});
    }

    try {
        const id = user.userId;

        const existingUser = await prisma.user.findUnique({where: {id: id}});

        if(!existingUser){
            return res.status(401).json({message: "No user found!"});
        }

        if(existingUser.isVerified === 0){
            return res.status(400).json({message: "Email, is not verified, please verify your mail"});
        }

        return res.status(200).json({
            message: "User details fetched successfully",
            data: {
                name: existingUser.name,
                email: existingUser.email,
                id: existingUser.id
            }
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({message: "Error fetching user details"});
    }
}