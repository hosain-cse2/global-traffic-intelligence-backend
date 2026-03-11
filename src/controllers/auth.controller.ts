import type { Request, Response } from "express";
import { login, type LoginResult } from "../services/auth.service.js";

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function loginController(
  req: Request<unknown, unknown, LoginRequestBody>,
  res: Response<LoginResult | { message: string }>,
): Promise<void> {
  try {
    const { email, password } = req.body;
    const result: LoginResult = await login(email, password);

    res.json(result);
  } catch (error) {
    res.status(401).json({
      message: "Invalid email or password",
    });
  }
}
