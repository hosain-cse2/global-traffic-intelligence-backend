import { Router } from "express";
import authRoutes from "./auth.routes.js";
import healthRoutes from "./health.js";
import userRoutes from "./user.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import sessionRoutes from "./session.js";

const router: Router = Router();
const protectedRouter: Router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);

protectedRouter.use(authMiddleware);
protectedRouter.use("/users", userRoutes);
protectedRouter.use("/session", sessionRoutes);

router.use(protectedRouter);

export default router;
