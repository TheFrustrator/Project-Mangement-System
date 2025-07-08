import express from "express";
import {
  inviteMemberSchema,
  tokenSchema,
  workspaceSchema,
} from "../libs/validate-schema.js";
import { validateRequest } from "zod-express-middleware";
import AuthMiddleWare from "../middleware/authMiddleware.js";
import {
  acceptGenerateInvite,
  acceptInviteByToken,
  createWorkspace,
  getWorkspaceDetails,
  getWorkspaceProject,
  getWorkspaces,
  getWorkspaceStats,
  inviteUserToWorkspace,
} from "../controllers/workSpace.js";
import { z } from "zod";

const router = express.Router();

router.post(
  "/",
  AuthMiddleWare,
  validateRequest(workspaceSchema),
  createWorkspace
);

router.post(
  "/accept-invite-token",
  AuthMiddleWare,
  validateRequest({ body: tokenSchema }),
  acceptInviteByToken
);

router.post(
  "/:workspaceId/invite-member",
  AuthMiddleWare,
  validateRequest({
    params: z.object({workspaceId: z.string() }),
    body: inviteMemberSchema,
  }),
  inviteUserToWorkspace
);

router.post(
  "/:workspaceId/accept-generate-invite",
  AuthMiddleWare,
  validateRequest({ params: z.object({ workspaceId: z.string() })}),
  acceptGenerateInvite
)

router.get("/", AuthMiddleWare, getWorkspaces);
router.get("/:workspaceId", AuthMiddleWare, getWorkspaceDetails);
router.get("/:workspaceId/projects", AuthMiddleWare, getWorkspaceProject);

router.get("/:workspaceId/stats", AuthMiddleWare, getWorkspaceStats);

export default router;
