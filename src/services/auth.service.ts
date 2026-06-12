import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

import {
  RegisterInput,
  LoginInput,
} from "../schemas/auth.schema";

import { generateToken } from "../utils/jwt";

export async function registerUser(
  data: RegisterInput
) {
  const existingUser =
    await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

  if (existingUser) {
    throw new Error(
      "User already exists"
    );
  }

  const passwordHash =
    await bcrypt.hash(
      data.password,
      10
    );

  const user =
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
      },
    });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export async function loginUser(
  data: LoginInput
) {
  const user =
    await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

  if (!user) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const passwordValid =
    await bcrypt.compare(
      data.password,
      user.passwordHash
    );

  if (!passwordValid) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const token =
    generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}