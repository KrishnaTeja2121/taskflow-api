import { FastifyInstance } from "fastify";

import { verifyAuth } from "../middleware/auth.middleware";

export async function userRoutes(
  app: FastifyInstance
) {
  app.get(
    "/me",
    {
      preHandler:
        verifyAuth,
    },
    async (
      request: any
    ) => {
      return {
        user:
          request.user,
      };
    }
  );
}