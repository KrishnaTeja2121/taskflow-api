import id from "zod/v4/locales/id.cjs";
import { prisma } from "../lib/prisma";

import {
  CreateTaskInput,
  UpdateTaskInput,
} from "../schemas/task.schema";


export async function createTask(userId:string, data:CreateTaskInput){
    return prisma.task.create({
        data:{
            title: data.title,
            description: data.description,
            userId,
        },
    });
}


export async function getTasks(userId:string){
    return prisma.task.findMany({
        where:{
            userId,
        },
        orderBy:{
            createdAt:"desc",
        },
    });
}


export async function getTaskById(
    userId:string,
    taskId:string
){
    return prisma.task.findFirst({
        where:{
            id:taskId,
            userId
        },
    });
}


export async function updateTask(
    userId:string,
    taskId:string,
    data:UpdateTaskInput
){
    const task= await.prisma.findFirst({
        where:{
            id:taskId,
            userId,
        },
    });

    if(!task){
        throw new Error("Task not found");
    }
    return prisma.task.update({
        where:{
            id:taskId,
        },
        data,
    });
}


export async function deleteTask(userId:string,taskId:string){
    const task= await prisma.task.findFirst({
        where:{
            id:taskId,
            userId
        },
    });

    if (!task) {
    throw new Error(
      "Task not found"
    );
  }

  await prisma.task.delete({
    where:{
        id:taskId,
    },
  });

   return {
    message:
      "Task deleted successfully",
  };
}