import type { Request, Response } from "express";
import { login } from "../services/auth.service.js";

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);

    res.json(result);
  } catch (error) {
    res.status(401).json({
      message: "Invalid email or password",
    });
  }
}
