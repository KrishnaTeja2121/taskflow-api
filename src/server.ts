import Fastify from "fastify";

import { authRoutes } from "./routes/auth.routes";
import { userRoutes } from "./routes/user.routes";

const app = Fastify({
  logger: true,
});

app.register(
  authRoutes
);

app.register(
  userRoutes
);

app.listen({
  port: 3001,
})
.then(() => {
  console.log(
    "Server running on port 3001"
  );
})
.catch((error) => {
  console.error(error);
  process.exit(1);
});