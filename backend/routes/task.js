import express from 'express';
import { validateRequest } from 'zod-express-middleware';
import { taskSchema } from '../libs/validate-schema.js';
import { createTask, getMyTasks, getTaskById,  } from '../controllers/task.js';
import AuthMiddleWare from './../middleware/authMiddleware.js';
import { z } from 'zod';

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

router.get("/my-tasks", AuthMiddleWare, getMyTasks);

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
