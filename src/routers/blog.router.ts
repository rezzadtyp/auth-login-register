import { Router } from "express";
import { createBlogController } from "../controllers/blog.controller";
import { verifyToken } from "../middlewares/verifyToken";

const router = Router();

router.post("/", verifyToken, createBlogController);

export default router;
