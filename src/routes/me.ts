import { Router } from "express";
import userRoutes from "./user.js";
import { getMeController } from "../controllers/me.controller.js";

const meRoutes: Router = Router();

meRoutes.get("/", getMeController);

export default meRoutes;
