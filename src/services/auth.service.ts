import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { RegisterInput } from "@/schemas/auth.schema";

export async function registerUser(
  data: RegisterInput
) {
  const existingUser =
    await prisma.user.findUnique({ // Find Existing User
      where: {
        email: data.email,
      },
    });
    /*Prisma generates SQL similar to:
    SELECT *
FROM users
WHERE email = ?*/

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
    await prisma.user.create({ // Create User
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
      },
    });

     /*Prisma generates SQL similar to:
    INSERT INTO users (...)*/

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}