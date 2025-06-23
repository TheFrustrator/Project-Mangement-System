import  { z } from "zod";


const registerSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

const resetPasswordScema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(8, "Password must be at least 8 charactres long"),
  confirmPassword:z.string().min(1,"Confirm password is required.")
});


const emailSchema = z.object({
  email: z.string().email("Invalid email address")
});

const workspaceSchema  = z.object({
  name: z.string().min(1, "Name is requred"),
  description: z.string().optional(),
  color: z.string().min(1, "Color is requred"),
});

export {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resetPasswordScema,
  emailSchema,
  workspaceSchema,
};