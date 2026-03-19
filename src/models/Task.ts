import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true,
    },
    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    dueDate: {
      type: Date,
      index: true,
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Text search index
TaskSchema.index({ title: "text", description: "text" });

export default mongoose.models.Task ||
  mongoose.model("Task", TaskSchema);