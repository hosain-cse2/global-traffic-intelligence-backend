import { Router } from "express";
import authRoutes from "./auth.routes.js";
import healthRoutes from "./health.js";
import userRoutes from "./user.js";
import meRoutes from "./me.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router: Router = Router();
const protectedRouter: Router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);

protectedRouter.use(authMiddleware);
protectedRouter.use("/users", userRoutes);
protectedRouter.use("/me", meRoutes);

router.use(protectedRouter);

export default router;
