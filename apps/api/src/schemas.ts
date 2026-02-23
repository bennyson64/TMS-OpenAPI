import { z } from "zod"
export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
})


export const CreateTaskSchema = z.object({
  title: z.string().min(5).max(32),
  description: z.string().min(20).max(100),
})


export const UpdateTaskSchema = CreateTaskSchema


export const ParamSchema = z.object({
  id: z.string().uuid(),
})