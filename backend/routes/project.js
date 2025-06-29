import express from "express";
import { validateRequest } from "zod-express-middleware";
import AuthMiddleWare from "./../middleware/authMiddleware.js";
import { projectSchema } from "../libs/validate-schema.js";
import { createProject } from "../controllers/project.js";
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

export default router;
