import express from "express";
import authenticateUser from "../middleware/authMiddleware.js";
import {
  changePassword,
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  //   uploadAvatar,
} from "../controllers/user.js";

import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/profile", authenticateUser, getUserProfile);

router.put(
  "/profile",
  authenticateUser,
  validateRequest({
    body: z.object({
      name: z.string(),
      profilePicture: z.string().optional(),
    }),
  }),
  updateUserProfile
);

router.put(
  "/change-password",
  authenticateUser,
  validateRequest({
    body: z.object({
      currentPassword: z.string(),
      newPassword: z.string(),
      confirmPassword: z.string(),
    }),
  }),
  changePassword
);

router.post(
  "/upload-avatar",
  authenticateUser,
  upload.single("avatar"),
  uploadAvatar
);

// router.post(
//   "/upload-avatar",
//   authenticateUser,
//   upload.single("avatar"), // from multer
//   uploadAvatar
// );

export default router;
