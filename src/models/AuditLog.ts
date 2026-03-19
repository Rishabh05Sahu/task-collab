import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  taskId: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  previousData: any;
  newData: any;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  taskId: {
    type: Schema.Types.ObjectId,
    ref: "Task",
    required: true,
    index: true,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  previousData: {
    type: Schema.Types.Mixed,
  },
  newData: {
    type: Schema.Types.Mixed,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

export default mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);