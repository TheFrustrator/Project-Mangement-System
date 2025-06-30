import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Review", "Done"],
      default: "To Do",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    assignees: [{ type: Schema.Types.ObjectId, ref: "User" }], // Fixed typo: changed 'assigness' to 'assignees'
    watchers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    startDate: { type: Date },
    dueDate: { type: Date },
    completedAt: { type: Date },
    estimateHours: { type: Number, min: 0 },
    actualHours: { type: String },
    tags: [{ type: String }],
    subtasks: [
      {
        title: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    Comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    attachments: [
      {
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileType: { type: String },
        fileSize: { type: Number },
        uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
