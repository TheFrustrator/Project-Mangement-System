import express from "express";
import { validateRequest } from "zod-express-middleware";
import {
  loginSchema,
  registerSchema,
  resetPasswordScema,
  verifyEmailSchema,
  emailSchema
} from "../libs/validate-schema.js";
import {
  loginUser,
  registerUser,
  resetPasswordRequest,
  verifyEmail,
  verifyResetPasswordTokenAndResetPassword,
} from "../controllers/auth-controller.js";




const router = express.Router();

router.post(
  "/register",
  validateRequest({
    body: registerSchema,
  }),
  registerUser
);
router.post(
  "/login",
  validateRequest({
    body: loginSchema,
  }),
  loginUser
);

router.post(
  "/verify-email",
  validateRequest({
    body: verifyEmailSchema,
  }),
  verifyEmail
);

router.post(
  "/reset-password-request",
  validateRequest({
    body: emailSchema,
  }),
  resetPasswordRequest
);

router.post(
  "/reset-password",
  validateRequest({
    body: resetPasswordScema,
  }),
  verifyResetPasswordTokenAndResetPassword
);



export default router;