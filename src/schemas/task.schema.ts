import { z } from "zod";

export const createTaskSchema = z.object({
    title:z.string().min(3),
    description:z.string().optional(),
});


export const updateTaskSchema =z.object({
    title:z.string().min(3).optional(),
    description: z.string().optional(),

    status: z.enum(["TODO","IN_PROGRESS","DONE",]).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput =
  z.infer<typeof updateTaskSchema>;