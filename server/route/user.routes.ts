import { Router } from "express";
import { verfiyJwt } from "../middleware/verifyJwt.js";
import { userme } from "../controller/user.controller.js";

const router = Router();

router.get('/me', verfiyJwt, userme);

export default router