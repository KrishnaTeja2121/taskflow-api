import { FastifyInstance } from "fastify";

import { registerSchema } from "@/schemas/auth.schema";

import { registerUser } from "@/services/auth.service";

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
          registerSchema.parse( //Parse Body
            request.body
          );

        const user =
          await registerUser( //Call Service
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
}
