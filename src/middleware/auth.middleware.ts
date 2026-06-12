import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET as string;

export async function verifyAuth(
  request: any,
  reply: any
) {
  try {
    const authHeader =
      request.headers.authorization;

    if (!authHeader) {
      return reply.status(401).send({
        message: "Missing token",
      });
    }

    const token =
      authHeader.replace(
        "Bearer ",
        ""
      );

    const payload =
      jwt.verify(
        token,
        JWT_SECRET
      );

    request.user = payload;
  } catch {
    return reply.status(401).send({
      message: "Invalid token",
    });
  }
}