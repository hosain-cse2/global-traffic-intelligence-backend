import { Router } from "express";
import { getMeController } from "../controllers/me.controller.js";
import { logoutController } from "../controllers/logout.controller.js";

const sessionRoutes: Router = Router();

sessionRoutes.get("/me", getMeController);
sessionRoutes.post("/logout", logoutController);

export default sessionRoutes;
