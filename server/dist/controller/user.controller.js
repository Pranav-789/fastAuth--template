import { prisma } from "../db/prisma.js";
export const getUserById = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "Valid user ID is required" });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                name: true,
                email: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                    }
                }
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        return res.status(200).json({
            message: "User fetched successfully",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                _count: {
                    followers: user._count.following, // users following this user
                    following: user._count.followers // users this user follows
                }
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching user details" });
    }
};
export const userme = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Invalid access" });
    }
    try {
        const id = user.userId;
        const existingUser = await prisma.user.findUnique({ where: { id: id } });
        if (!existingUser) {
            return res.status(401).json({ message: "No user found!" });
        }
        if (existingUser.isVerified === 0) {
            return res
                .status(400)
                .json({ message: "Email, is not verified, please verify your mail" });
        }
        return res.status(200).json({
            message: "User details fetched successfully",
            data: {
                name: existingUser.name,
                email: existingUser.email,
                id: existingUser.id,
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ message: "Error fetching user details" });
    }
};
export const followUser = async (req, res) => {
    const user = req.user;
    const { accountId } = req.body;
    if (!user) {
        return res.status(401).json({ message: "user not found!" });
    }
    if (!accountId) {
        return res.status(400).json({ message: "follow id is required!" });
    }
    if (user.userId == accountId) {
        return res.status(400).json({ message: "can't follow self account!!" });
    }
    try {
        const userId = user.userId;
        const followingId = await prisma.user.findUnique({
            where: { id: accountId },
        });
        if (!followingId) {
            return res.status(404).json({ message: "account not found!!" });
        }
        await prisma.follows.create({
            data: {
                followerId: userId,
                followingId: accountId,
            },
        });
        return res.status(201).json({ message: "Followed successfully!" });
    }
    catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({ message: "Already following this user" });
        }
        return res.status(500).json({ message: "Error occured while following!" });
    }
};
export const unFollowUser = async (req, res) => {
    const user = req.user;
    const { accountId } = req.body;
    if (!user) {
        return res.status(401).json({ message: "user not found!" });
    }
    if (!accountId) {
        return res.status(400).json({ message: "follow id is required!" });
    }
    if (user.userId == accountId) {
        return res.status(400).json({ message: "can't perform action!!" });
    }
    try {
        const userId = user.userId;
        const followingId = await prisma.user.findUnique({
            where: { id: accountId },
            select: { id: true },
        });
        if (!followingId) {
            return res.status(404).json({ message: "account not found!!" });
        }
        await prisma.follows.delete({
            where: {
                followerId_followingId: { followerId: userId, followingId: accountId },
            },
        });
        return res.status(200).json({ message: "Unfollowed successfully!" });
    }
    catch (error) {
        if (error.code === "P2025") {
            return res
                .status(409)
                .json({ message: "Already not following this user" });
        }
        return res
            .status(500)
            .json({ message: "Error occured while unfollowing!" });
    }
};
export const fetchFollowers = async (req, res) => {
    const targetId = Number(req.params.id);
    if (!targetId || isNaN(targetId)) {
        return res.status(400).json({ message: "Valid user ID is required" });
    }
    const limit = Number(req.query.limit) || 20;
    const cursor = req.query.cursor ? Number(req.query.cursor) : null;
    try {
        const followers = await prisma.follows.findMany({
            where: {
                followingId: targetId,
            },
            take: limit + 1,
            ...(cursor && {
                skip: 1,
                cursor: {
                    followerId_followingId: {
                        followerId: cursor,
                        followingId: targetId,
                    },
                },
            }),
            include: {
                follower: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                followerId: "asc",
            },
        });
        const hasNextPage = followers.length > limit;
        if (hasNextPage)
            followers.pop();
        return res.status(200).json({
            followers,
            nextCursor: hasNextPage
                ? followers[followers.length - 1].followerId
                : null,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Error occurred while fetching followers" });
    }
};
export const fetchFollowing = async (req, res) => {
    const targetId = Number(req.params.id);
    if (!targetId || isNaN(targetId)) {
        return res.status(400).json({ message: "Valid user ID is required" });
    }
    const limit = Number(req.query.limit) || 20;
    const cursor = req.query.cursor
        ? Number(req.query.cursor)
        : null;
    try {
        const following = await prisma.follows.findMany({
            where: {
                followerId: targetId,
            },
            take: limit + 1,
            ...(cursor && {
                skip: 1,
                cursor: {
                    followerId_followingId: {
                        followerId: targetId,
                        followingId: cursor,
                    },
                },
            }),
            orderBy: {
                followingId: "asc",
            },
            include: {
                following: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        const hasNextPage = following.length > limit;
        if (hasNextPage)
            following.pop();
        return res.status(200).json({
            following,
            nextCursor: hasNextPage
                ? following[following.length - 1].followingId
                : null,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Error occurred while fetching following" });
    }
};
export const checkIfFollowing = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { accountId } = req.body;
    if (!accountId) {
        return res.status(400).json({ message: "Account id is required!" });
    }
    try {
        const following = await prisma.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId: user.userId,
                    followingId: accountId,
                },
            },
        });
        return res.status(200).json({
            following,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Error occurred while checking following" });
    }
};
export const getFollowerCount = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const followerCount = await prisma.follows.count({
            where: {
                followingId: user.userId,
            },
        });
        return res.status(200).json({
            followerCount,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Error occurred while fetching follower count" });
    }
};
export const getFollowingCount = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const followingCount = await prisma.follows.count({
            where: {
                followerId: user.userId,
            },
        });
        return res.status(200).json({
            followingCount,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Error occurred while fetching following count" });
    }
};
