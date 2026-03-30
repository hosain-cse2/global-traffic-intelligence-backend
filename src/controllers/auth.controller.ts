import type { Request, Response } from "express";
import {
  login,
  type AuthenticatedUser,
} from "../services/auth.service.js";

interface LoginRequestBody {
  email: string;
  password: string;
}

const ONE_HOUR_MS = 60 * 60 * 1000;

export async function loginController(
  req: Request<unknown, unknown, LoginRequestBody>,
  res: Response<{ user: AuthenticatedUser } | { message: string }>,
): Promise<void> {
  try {
    const { email, password } = req.body;
    const { user, token } = await login(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ONE_HOUR_MS,
      path: "/",
    });

    res.json({ user });
  } catch (error) {
    res.status(401).json({
      message: "Invalid email or password",
    });
  }
}
