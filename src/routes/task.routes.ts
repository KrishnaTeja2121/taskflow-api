import { FastifyInstance } from "fastify";

import {
    verifyAuth,
} from "../middleware/auth.middleware";

import {
    createTaskSchema,
    updateTaskSchema,
} from "../schemas/task.schema";

import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
} from "../services/task.service";
import { tr } from "zod/v4/locales/index.js";
import { request } from "express";
import { any } from "zod";


export async function taskRoutes(app: FastifyInstance) {
    app.post(
        "/tasks",
        {
            preHandler:
                verifyAuth,
        },
        async (
            request: any,
            reply
        ) => {
            try {
                const body =
                    createTaskSchema.parse(
                        request.body
                    );

                const task =
                    await createTask(
                        request.user.userId,
                        body
                    );

                return reply
                    .status(201)
                    .send(task);

            } catch (error) {
                return reply
                    .status(400)
                    .send({
                        message:
                            error instanceof Error
                                ? error.message
                                : "Failed",
                    });
            }
        }
    );

    app.get("/task",{
        preHandler:verifyAuth,
    },
    async (request:any)=>{
        const {
            page="1",
            limit="10",
        }=request.query;
        return getTasks(request.user.userId,
            Number(page),Number(limit)
        );
    
    });



    app.get(
  "/tasks/:id",
  {
    preHandler:
      verifyAuth,
  },
  async (
    request: any,
    reply
  ) => {
    const task =
      await getTaskById(
        request.user.userId,
        request.params.id
      );

    if (!task) {
      return reply
        .status(404)
        .send({
          message:
            "Task not found",
        }); 
    }

    return task;
  }
);

app.put(
  "/tasks/:id",
  {
    preHandler:
      verifyAuth,
  },
  async (
    request: any
  ) => {
    const body =
      updateTaskSchema.parse(
        request.body
      );

    return updateTask(
      request.user.userId,
      request.params.id,
      body
    );
  }
);

app.delete(
  "/tasks/:id",
  {
    preHandler:
      verifyAuth,
  },
  async (
    request: any
  ) => {
    return deleteTask(
      request.user.userId,
      request.params.id
    );
  }
);

}


