# Taskflow API

Taskflow API is a small learning-focused REST API for managing personal tasks. It uses Fastify for HTTP routing, Prisma for database access, PostgreSQL for persistence, Zod for request validation, bcrypt for password hashing, and JWTs for authentication.

The project is organized around a common backend pattern:

1. Routes receive HTTP requests.
2. Zod schemas validate incoming request bodies.
3. Services contain business logic and Prisma database calls.
4. Middleware protects private routes with JWT authentication.
5. Prisma models define the database structure.

## Tech Stack

- Node.js with TypeScript
- Fastify
- Prisma ORM
- PostgreSQL
- Zod
- bcrypt
- jsonwebtoken
- tsx for local development

## Project Structure

```text
taskflow-api/
  prisma/
    migrations/                 # Database migration history
    schema.prisma               # User, Task, and TaskStatus models
  src/
    lib/
      prisma.ts                 # Shared Prisma client
    middleware/
      auth.middleware.ts        # JWT verification for protected routes
    routes/
      auth.routes.ts            # Register and login endpoints
      task.routes.ts            # Protected task endpoints
      user.routes.ts            # Current-user endpoint
    schemas/
      auth.schema.ts            # Zod validation for auth payloads
      task.schema.ts            # Zod validation for task payloads
    services/
      auth.service.ts           # User registration and login logic
      task.service.ts           # Task CRUD logic
    types/
      bcrypt.d.ts               # Local bcrypt type declaration
    utils/
      jwt.ts                    # JWT signing helper
    server.ts                   # Fastify app entry point
  package.json
  prisma.config.ts
  tsconfig.json
```

## Data Model Summary

The API has two main entities.

`User`

- `id`: UUID primary key
- `name`: user display name
- `email`: unique login email
- `passwordHash`: hashed password, never returned by auth responses
- `tasks`: one-to-many relation with tasks
- `createdAt` and `updatedAt`: timestamps managed by Prisma

`Task`

- `id`: UUID primary key
- `title`: required task title
- `description`: optional task details
- `status`: one of `TODO`, `IN_PROGRESS`, or `DONE`
- `userId`: owner of the task
- `createdAt` and `updatedAt`: timestamps managed by Prisma

Every task belongs to a user. Task queries are scoped by `userId`, so authenticated users should only see and modify their own tasks.

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="replace-with-a-long-random-secret"
```

Do not commit `.env`. It is already ignored by `.gitignore`.

## Install and Run

Install dependencies:

```bash
npm install
```

Generate the Prisma client:

```bash
npm run prisma:generate
```

Run database migrations:

```bash
npm run prisma:migrate
```

Start the development server:

```bash
npm run dev
```

The server listens on:

```text
http://localhost:3001
```

Open Prisma Studio:

```bash
npm run studio
```

## Available Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Starts the Fastify server with `tsx watch src/server.ts` |
| `npm run prisma:generate` | Generates Prisma Client from `prisma/schema.prisma` |
| `npm run prisma:migrate` | Runs Prisma development migrations |
| `npm run studio` | Opens Prisma Studio for browsing database records |

## API Overview

### Auth Routes

#### Register

```http
POST /auth/register
```

Request body:

```json
{
  "name": "Krish",
  "email": "krish@example.com",
  "password": "secret123"
}
```

Validation:

- `name` must be at least 2 characters.
- `email` must be a valid email.
- `password` must be at least 6 characters.

Success response:

```json
{
  "id": "user-id",
  "name": "Krish",
  "email": "krish@example.com"
}
```

#### Login

```http
POST /auth/login
```

Request body:

```json
{
  "email": "krish@example.com",
  "password": "secret123"
}
```

Success response:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "Krish",
    "email": "krish@example.com"
  }
}
```

Use the returned token in protected requests:

```http
Authorization: Bearer jwt-token
```

### User Routes

#### Get Current User Payload

```http
GET /me
```

Requires:

```http
Authorization: Bearer jwt-token
```

Returns the decoded JWT payload attached by `verifyAuth`.

### Task Routes

All task routes require:

```http
Authorization: Bearer jwt-token
```

#### Create Task

```http
POST /tasks
```

Request body:

```json
{
  "title": "Build README",
  "description": "Document the API for quick learning"
}
```

Validation:

- `title` must be at least 3 characters.
- `description` is optional.

#### List Tasks

```http
GET /task?page=1&limit=10
```

Returns tasks for the authenticated user, ordered newest first.

Query parameters:

- `page`: page number, defaults to `1`
- `limit`: number of tasks per page, defaults to `10`

Note: this route is currently singular (`/task`) in the code.

#### Get Task by ID

```http
GET /tasks/:id
```

Returns one task if it belongs to the authenticated user.

#### Update Task

```http
PUT /tasks/:id
```

Request body:

```json
{
  "title": "Build better README",
  "description": "Add endpoint examples and architecture notes",
  "status": "IN_PROGRESS"
}
```

All fields are optional, but when present:

- `title` must be at least 3 characters.
- `status` must be `TODO`, `IN_PROGRESS`, or `DONE`.

#### Delete Task

```http
DELETE /tasks/:id
```

Deletes a task owned by the authenticated user.

Success response:

```json
{
  "message": "Task deleted successfully"
}
```

## Example Flow with cURL

Register a user:

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Krish\",\"email\":\"krish@example.com\",\"password\":\"secret123\"}"
```

Login:

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"krish@example.com\",\"password\":\"secret123\"}"
```

Create a task:

```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"title\":\"Learn Fastify\",\"description\":\"Understand routes, services, and middleware\"}"
```

List tasks:

```bash
curl "http://localhost:3001/task?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Quick Learning Guide

Start with `src/server.ts`. This file creates the Fastify app, enables logging, registers all route modules, and starts the server on port `3001`.

Then read `src/routes/auth.routes.ts`. It shows the request lifecycle clearly: parse the request with Zod, call a service function, return a response, and catch errors.

Next, open `src/services/auth.service.ts`. This is where user registration and login happen. Registration checks for an existing email, hashes the password with bcrypt, creates the user, and returns safe user fields. Login checks the email and password, then creates a JWT.

After auth, read `src/middleware/auth.middleware.ts` and `src/utils/jwt.ts`. These files explain how private routes work. The token stores `userId`, and `verifyAuth` attaches the decoded payload to `request.user`.

Finally, study the task files:

- `src/schemas/task.schema.ts` defines valid create and update payloads.
- `src/routes/task.routes.ts` maps HTTP endpoints to task actions.
- `src/services/task.service.ts` uses Prisma to create, list, read, update, and delete tasks for the authenticated user.

The Prisma model in `prisma/schema.prisma` is the best place to understand the database. It shows that users own tasks and that task status is controlled by the `TaskStatus` enum.

## Current Implementation Notes

This repository is useful for learning the structure of a TypeScript API, but a few files need cleanup before the app is fully production-ready:

- `src/routes/task.routes.ts` imports `express`, `tr`, and `any`, but those imports are not needed.
- `src/services/task.service.ts` has an invalid `await.prisma.findFirst` call in `updateTask`; it should query through `prisma.task.findFirst`.
- The list route is named `GET /task`, while the rest of the task routes use `/tasks`.
- Error handling is simple and can be improved with shared error helpers or Fastify error hooks.
- `JWT_SECRET` is read from the environment, but the app does not currently validate that it exists before startup.

These are good next improvements if you want to continue learning backend API development.

## Learning Goals Covered by This Repo

By studying and improving this project, you can practice:

- Building an API with Fastify route modules
- Validating input with Zod
- Separating routes from service logic
- Creating relational models with Prisma
- Running migrations against PostgreSQL
- Hashing passwords with bcrypt
- Issuing and verifying JWTs
- Protecting user-owned resources
- Implementing paginated list endpoints
- Keeping project configuration in `package.json`, `tsconfig.json`, and `prisma.config.ts`
