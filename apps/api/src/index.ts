import "dotenv/config"
import { Hono } from "hono";
// import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { v4 as uuid } from "uuid";
const app = new Hono();
import { db } from "./db/index.js";
import { tasks } from "./db/schema.js";
import { eq } from "drizzle-orm";
import { CreateTaskSchema, ParamSchema, TaskSchema, UpdateTaskSchema } from "./schemas.js";
import { describeRoute, openAPIRouteHandler, resolver, validator } from "hono-openapi"
import z from "zod";
// In-memory database
// type Task = {
//   id: string;
//   title: string;
//   description: string;
// };
// let items: Task[] = []
type bodyType = {
  title: string;
  description: string
}
app.use("*", cors());

app.get("/",describeRoute({
    responses: {
      200: {
        description: "Successful response",
        content: {
          "application/json": {
            schema: resolver(z.array(TaskSchema)),
          },
        },
      },
    },
  }),
  async (c) => {
  const allTasks = await db.select().from(tasks);
  return c.json(allTasks);
});

app.post(
  "/",
  describeRoute({
    description: "Create a new task",
    responses: {
      201: {
        description: "Task created",
        content: {
          "application/json": { schema: resolver(TaskSchema) },
        },
      },
    },
  }),
  validator("json", CreateTaskSchema),
  async (c) => {
    const body = c.req.valid("json")
    const [newTask] = await db.insert(tasks).values(body).returning()
    return c.json({ success: true, task: newTask }, 201)
  }
)

app.put("/:id",describeRoute({
    description: "Update a task",
    responses: {
      200: {
        description: "Task updated",
        content: {
          "application/json": { schema: resolver(TaskSchema) },
        },
      },
    },
  }),
  validator("param", ParamSchema),
  validator("json", UpdateTaskSchema),
   async (c) => {
    const { id } = c.req.valid("param")
    const body = c.req.valid("json")
    const [updated] = await db
      .update(tasks)
      .set({ title: body.title, description: body.description })
      .where(eq(tasks.id, id))
      .returning()
    return c.json({ success: true, task: updated }, 200)
  }
)

app.delete(
  "/:id",
  describeRoute({
    description: "Delete a task",
    responses: {
      200: {
        description: "Task deleted",
        content: {
          "application/json": {
            schema: resolver(z.object({ success: z.boolean() })),
          },
        },
      },
    },
  }),
  validator("param", ParamSchema),
  async (c) => {
    const { id } = c.req.valid("param")
    await db.delete(tasks).where(eq(tasks.id, id))
    return c.json({ success: true }, 200)
  }
)


app.get(
  '/openapi',
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: 'Task Management API',
        version: '1.0.0',
        description: 'Task Management System API',
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Local Server' },
      ],
    },
  })
)

// serve({
//   fetch: app.fetch,
//   port: 3000
// })

// console.log('Backend running on http://localhost:3000')

export default app;
