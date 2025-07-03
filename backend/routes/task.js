import express from "express";
import { validateRequest } from "zod-express-middleware";
import { taskSchema } from "../libs/validate-schema.js";
import {
  createTask,
  getMyTasks,
  getTaskById,
  updateTaskAssignees,
  updateTaskDescription,
  updateTaskStatus,
  updateTaskTitle,
  updateTaskPriority,
  addSubTask,
  updateSubTask,
  getActivityByResourceId,
  getCommentByTaskId,
  addComment,
  achievedTask,
  watchTask,
} from "../controllers/task.js";
import AuthMiddleWare from "./../middleware/authMiddleware.js";
import { z } from "zod";

const router = express.Router();

router.post(
  "/:projectId/create-task",
  AuthMiddleWare,
  validateRequest({
    params: z.object({
      projectId: z.string(),
    }),
    body: taskSchema,
  }),
  createTask
);

// router.get("/my-tasks", AuthMiddleWare, getMyTasks);

router.put(
  "/:taskId/title",
  AuthMiddleWare,
  validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ title: z.string() }),
  }),
  updateTaskTitle
);

router.put(
  "/:taskId/description",
  AuthMiddleWare,
  validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ description: z.string() }),
  }),
  updateTaskDescription
);

router.put(
  "/:taskId/status",
  AuthMiddleWare,
  validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ status: z.string() }),
  }),
  updateTaskStatus
);

router.put(
  "/:taskId/assignees",
  AuthMiddleWare,
  validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ assignees: z.array(z.string()) }),
  }),
  updateTaskAssignees
);

router.put(
  "/:taskId/priority",
  AuthMiddleWare,
  validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ priority: z.string() }),
  }),
  updateTaskPriority
);

router.get(
  "/:taskId",
  AuthMiddleWare,
  validateRequest({
    params: z.object({
      taskId: z.string(),
    }),
  }),
  getTaskById
);

router.post(
  "/:taskId/add-subtask",
  AuthMiddleWare,
  validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ title: z.string() }),
  }),
  addSubTask
);

router.put(
  "/:taskId/update-subtask/:subTaskId",
  AuthMiddleWare,
  validateRequest({
    params: z.object({ taskId: z.string(), subTaskId: z.string() }),
    body: z.object({ completed: z.boolean() }),
  }),
  updateSubTask
);

router.get(
  "/:resourceId/activity",
  AuthMiddleWare,
  validateRequest({
    params: z.object({ resourceId: z.string() }),
  }),
  getActivityByResourceId
);

router.get(
  "/:taskId/comments",
  AuthMiddleWare,
  validateRequest({
    params: z.object({ taskId: z.string() })
  }),
  getCommentByTaskId
);

router.post(
  "/:taskId/add-comment",
  AuthMiddleWare,
  validateRequest({
    params: z.object({ taskId: z.string() }),
    body: z.object({ text: z.string() }),
  }),
  addComment
);

router.post(
  "/:taskId/watch",
  AuthMiddleWare,
  validateRequest({
    params: z.object({ taskId: z.string() }),
  }),
  watchTask
);

router.post(
  "/:taskId/achieved",
  AuthMiddleWare,
  validateRequest({
    params: z.object({ taskId: z.string() }),
  }),
  achievedTask
)


export default router;
