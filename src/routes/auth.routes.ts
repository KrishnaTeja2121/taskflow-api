import { FastifyInstance } from "fastify";

import {
  registerSchema,
  loginSchema,
} from "../schemas/auth.schema";

import {
  registerUser,
  loginUser,
} from "../services/auth.service";

export async function authRoutes(
  app: FastifyInstance
) {
  app.post(
    "/auth/register",
    async (
      request,
      reply
    ) => {
      try {
        const body =
          registerSchema.parse(
            request.body
          );

        const user =
          await registerUser(
            body
          );

        return reply
          .status(201)
          .send(user);
      } catch (error) {
        return reply
          .status(400)
          .send({
            message:
              error instanceof Error
                ? error.message
                : "Registration failed",
          });
      }
    }
  );

  app.post(
    "/auth/login",
    async (
      request,
      reply
    ) => {
      try {
        const body =
          loginSchema.parse(
            request.body
          );

        const result =
          await loginUser(
            body
          );

        return reply.send(
          result
        );
      } catch (error) {
        return reply
          .status(401)
          .send({
            message:
              error instanceof Error
                ? error.message
                : "Login failed",
          });
      }
    }
  );
}