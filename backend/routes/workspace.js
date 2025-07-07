import express from "express";
import { workspaceSchema } from "../libs/validate-schema.js";
import { validateRequest } from "zod-express-middleware";
import AuthMiddleWare from "../middleware/authMiddleware.js";
import {
  createWorkspace,
  getWorkspaceDetails,
  getWorkspaceProject,
  getWorkspaces,
  getWorkspaceStats,
} from "../controllers/workSpace.js";

const router = express.Router();

router.post(
  "/",
  AuthMiddleWare,
  validateRequest(workspaceSchema),
  createWorkspace
);



router.get("/", AuthMiddleWare, getWorkspaces);
router.get("/:workspaceId", AuthMiddleWare, getWorkspaceDetails);
router.get("/:workspaceId/projects", AuthMiddleWare, getWorkspaceProject);

router.get("/:workspaceId/stats", AuthMiddleWare, getWorkspaceStats);

export default router;
