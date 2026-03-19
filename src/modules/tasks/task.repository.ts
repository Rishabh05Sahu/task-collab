import Task from "@/models/Task";

export async function createTaskInDB(data: any) {
  return await Task.create(data);
}

export async function findTaskById(taskId: string) {
  return await Task.findById(taskId);
}

export async function updateTaskInDB(
  taskId: string,
  data: any,
  version: number
) {
  return await Task.findOneAndUpdate(
    { _id: taskId, version },
    {
      $set: data,
      $inc: { version: 1 },
    },
    { new: true }
  );
}

export async function deleteTaskFromDB(taskId: string) {
  return await Task.findByIdAndDelete(taskId);
}

export async function getTasksFromDB(
  filters: any,
  limit: number,
  cursor?: string
) {
  const query: any = {};

  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.assignedUser)
    query.assignedUser = filters.assignedUser;

  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  if (cursor) {
    query._id = { $lt: cursor };
  }

  return await Task.find(query)
    .sort({ _id: -1 })
    .limit(limit);
}