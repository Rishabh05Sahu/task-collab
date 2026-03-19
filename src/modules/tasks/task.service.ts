import { redis } from "@/lib/redis";
import {
  createTaskInDB,
  updateTaskInDB,
  deleteTaskFromDB,
  findTaskById,
  getTasksFromDB,
} from "./task.repository";

/**
 * CREATE TASK
 */
export async function createTask(
  data: any,
  userId: string
) {
  if (!userId) {
    const error: any = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }

  const task = await createTaskInDB({
    ...data,
    createdBy: userId,
    version: 1,
  });

  await redis.rpush(
    "task_events",
    JSON.stringify({
      type: "task:created",
      taskId: task._id.toString(),
    })
  );
  await redis.ltrim("task_events", -100, -1);

  return task;
}

/**
 * UPDATE TASK (RBAC + Optimistic Locking)
 */
export async function updateTask(
  taskId: string,
  data: any,
  version: number,
  userId: string,
  role: "user" | "admin"
) {
  const existing = await findTaskById(taskId);

  if (!existing) {
    const error: any = new Error("Task not found");
    error.status = 404;
    throw error;
  }

  // RBAC: admin can edit any task; user only own tasks
  const isOwner = existing.createdBy.toString() === userId;
  const isAdmin = role === "admin";

  if (!isAdmin && !isOwner) {
    const error: any = new Error("Forbidden");
    error.status = 403;
    throw error;
  }

  const updatedTask = await updateTaskInDB(
    taskId,
    data,
    version
  );

  if (!updatedTask) {
    const error: any = new Error(
      "Conflict: Task was updated by another user"
    );
    error.status = 409;
    throw error;
  }

  await redis.rpush(
    "task_events",
    JSON.stringify({
      type: "task:updated",
      taskId: taskId.toString(),
    })
  );
  await redis.ltrim("task_events", -100, -1);

  return updatedTask;
}

/**
 * DELETE TASK (RBAC)
 */
export async function deleteTask(
  taskId: string,
  userId: string,
  role: "user" | "admin"
) {
  const existing = await findTaskById(taskId);

  if (!existing) {
    const error: any = new Error("Task not found");
    error.status = 404;
    throw error;
  }

  const isOwner = existing.createdBy.toString() === userId;
  const isAdmin = role === "admin";

  if (!isAdmin && !isOwner) {
    const error: any = new Error("Forbidden");
    error.status = 403;
    throw error;
  }

  await deleteTaskFromDB(taskId);

  await redis.rpush(
    "task_events",
    JSON.stringify({
      type: "task:deleted",
      taskId: taskId.toString(),
    })
  );
  await redis.ltrim("task_events", -100, -1);

  return { success: true };
}

/**
 * GET TASKS / GET BY ID
 * (no role filter here; any logged-in user can view)
 */
export async function getTasks(
  filters: any,
  limit: number,
  cursor?: string
) {
  return await getTasksFromDB(filters, limit, cursor);
}

export async function getTaskById(taskId: string) {
  const task = await findTaskById(taskId);

  if (!task) {
    const error: any = new Error("Task not found");
    error.status = 404;
    throw error;
  }

  return task;
}