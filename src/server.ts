import Fastify from "fastify";

import { authRoutes } from "./routes/auth.routes";

const app =
  Fastify({
    logger: true,
  });
const port =
  Number(process.env.PORT ?? 3001);

app.register(
  authRoutes
);

app.listen({ port });
