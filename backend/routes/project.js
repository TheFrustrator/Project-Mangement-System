import express from "express";
import { validateRequest } from "zod-express-middleware";
import AuthMiddleWare from "./../middleware/authMiddleware.js";
import { projectSchema } from "../libs/validate-schema.js";
import { createProject, getProjectDetails, getProjectTasks } from "../controllers/project.js";
import { z } from "zod";

const router = express.Router();

router.post(
  "/:workspaceId/create-project",
  AuthMiddleWare,
  validateRequest({
    params: z.object({
      workspaceId: z.string(),
    }),
    body: projectSchema,
  }),
  createProject
);

router.get(
  "/:projectId",
  AuthMiddleWare,
  validateRequest({
    params: z.object({projectId: z.string()}),
  }),
  getProjectDetails
);

router.get(
  "/:projectId/tasks",
  AuthMiddleWare,
  validateRequest({params: z.object({projectId: z.string()}) 
  }),
  getProjectTasks
);



export default router;
