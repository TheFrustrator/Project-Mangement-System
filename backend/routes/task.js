import express from "express";
import { validateRequest } from "zod-express-middleware";
import { taskSchema } from "../libs/validate-schema.js"; 
import { createTask, getMyTasks, getTaskById, updateTaskAssignees, updateTaskDescription, updateTaskStatus, updateTaskTitle, } from "../controllers/task.js";
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
    body: z.object({title: z.string()}),
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
    params: z.object({taskId: z.string()}),
    body: z.object({status: z.string()}),
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

export default router;
