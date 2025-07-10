import express from 'express';

import authRoutes from './auth.js';
import workspaceRoutes from "./workspace.js" 
import projectRoutes from "./project.js"
import taskRoutes from "./task.js"
import useRoutes from "./user.js"
import avtarRoutes from "./user.js"


const router = express.Router();

router.use('/auth', authRoutes);
router.use('/workspaces', workspaceRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/users", useRoutes)
router.use("/uploads/avatars", avtarRoutes);


export default router;