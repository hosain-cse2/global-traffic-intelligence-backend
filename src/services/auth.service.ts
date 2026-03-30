import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import { prisma } from "../db/prisma.js";

const JWT_SECRET: string = process.env.JWT_SECRET ?? "supersecret";

export interface AuthenticatedUser {
  id: User["id"];
  email: User["email"];
  firstName: User["firstName"];
  lastName: User["lastName"];
}

/** Internal result: token is set as httpOnly cookie by the controller, not sent in JSON. */
export interface LoginWithSession {
  user: AuthenticatedUser;
  token: string;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginWithSession> {
  const user: User | null = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const passwordValid: boolean = await bcrypt.compare(
    password,
    user.passwordHash,
  );

  if (!passwordValid) {
    throw new Error("Invalid credentials");
  }

  const token: string = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "1h" },
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  };
}
