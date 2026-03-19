import Task from "@/models/Task";

export async function getAnalyticsSummaryFromDB() {
  const now = new Date();

  const result = await Task.aggregate([
    {
      $facet: {
        totalTasks: [{ $count: "count" }],

        byStatus: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ],

        byPriority: [
          {
            $group: {
              _id: "$priority",
              count: { $sum: 1 },
            },
          },
        ],

        overdue: [
          {
            $match: {
              dueDate: { $lt: now },
              status: { $ne: "done" },
            },
          },
          { $count: "count" },
        ],

        completed: [
          {
            $match: { status: "done" },
          },
          { $count: "count" },
        ],
      },
    },
  ]);

  return result[0];
}