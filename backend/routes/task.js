import express from 'express';
import { validateRequest } from 'zod-express-middleware';
import { z } from 'zod';
import AuthMiddleWare from './../middleware/authMiddleware.js';
// Assuming you have a project controller file, e.g., ../controllers/project.js
import { getProjectTasks } from '../controllers/project.js'; // Import the new controller function
// You might have other project-related controllers here too, e.g., createProject, getProjectById

const router = express.Router();

// NEW: Route to get all tasks for a specific project
router.get(
  "/:projectId/tasks",
  AuthMiddleWare, // Apply authentication middleware
  validateRequest({
    params: z.object({
      projectId: z.string(),
    }),
  }),
  getProjectTasks // Use the new controller function
);

// Your existing project routes would go here.
// For example, if you have a route to get a single project:
// router.get(
//   "/:projectId",
//   AuthMiddleWare,
//   validateRequest({
//     params: z.object({
//       projectId: z.string(),
//     }),
//   }),
//   getProjectById // Assuming you have this controller function
// );

export default router;
