import Project from "../models/project.js";
import Task from "../models/task.js"; // Ensure Task model is imported
import Workspace from "../models/workspace.js";

// Existing createTask and getTaskById from your original input
const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, priority, dueDate, assignees } =
      req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const workspace = await Workspace.findById(project.workspace);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignees, // This will now correctly map to the 'assignees' field in the Task model
      project: projectId,
      createdBy: req.user._id,
    });

    project.tasks.push(newTask._id);
    await project.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId)
      .populate("assignees", "name profilePicture")
      .populate("watchers", "name profilePicture");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findById(task.project).populate(
      "members.user",
      "name profilePicture"
    );

    res.status(200).json({ task, project });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// NEW: Controller function to get all tasks for a specific project
const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate({
        path: "tasks", // Populate the 'tasks' array in the Project model
        model: "Task", // Specify the model to populate from
        populate: {
          path: "assignees", // Populate 'assignees' within each task
          model: "User", // Specify the User model for assignees
          select: "name profilePicture", // Select specific fields for assignees
        },
      })
      .populate("members.user", "name profilePicture"); // Also populate project members if needed by frontend

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // You might want to add authorization checks here, similar to createTask
    // e.g., check if req.user._id is a member of the workspace/project

    res.status(200).json({ project, tasks: project.tasks });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { createTask, getTaskById, getProjectTasks };
