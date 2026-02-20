import { Router } from "express";
import { verfiyJwt } from "../middleware/verifyJwt.js";
import { userme, followUser, unFollowUser, fetchFollowers, fetchFollowing, checkIfFollowing, getFollowerCount, getFollowingCount, getUserById } from "../controller/user.controller.js";

const router = Router();

router.get('/me', verfiyJwt, userme);
router.post('/follow', verfiyJwt, followUser);
router.post('/unfollow', verfiyJwt, unFollowUser);
router.get('/:id/followers', verfiyJwt, fetchFollowers);
router.get('/:id/following', verfiyJwt, fetchFollowing);
router.post('/check-following', verfiyJwt, checkIfFollowing);
router.get('/follower-count', verfiyJwt, getFollowerCount);
router.get('/following-count', verfiyJwt, getFollowingCount);
router.get('/:id', verfiyJwt, getUserById);

export default router