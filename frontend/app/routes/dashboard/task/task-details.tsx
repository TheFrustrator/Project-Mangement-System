import { BackButton } from "@/components/back-button";
import { Button } from "@/components/ui/button";
import {
  useAchievedTaskMutation,
  useDeleteTaskMutation,
  useTaskByIdQuery,
  useWatchTaskMutation,
} from "@/hooks/use-task";
import { useAuth } from "@/provider/auth-context";
import type { Project, Task } from "@/types";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { Loader } from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff } from "lucide-react";
import { TaskTitle } from "@/components/task/task-title";
import { formatDistanceToNow } from "date-fns";
import { TaskStatusSelector } from "@/components/task/task-status-selector";
import { TaskDescription } from "@/components/task/task-description";
import { TaskAssineesSelector } from "@/components/task/task-assignees-selector";
import { TaskPrioritySelector } from "@/components/task/task-priority-selector";
import { SubTaskDetails } from "@/components/task/sub-task";
import { Watchers } from "@/components/task/watchers";
import { TaskActivity } from "@/components/task/task-activity";
import { CommenSection } from "@/components/task/comment-section";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const TaskDetails = () => {
  const { user } = useAuth();
  const { taskId, projectId, workspaceId } = useParams<{
    taskId: string;
    projectId: string;
    workspaceId: string;
  }>();

  const navigate = useNavigate();

  const { data, isLoading } = useTaskByIdQuery(taskId!) as {
    data: {
      task: Task;
      project: Project;
    };
    isLoading: boolean;
  };

  const { mutate: watchTask, isPending: isWatching } = useWatchTaskMutation();
  const { mutate: achievedTask, isPending: isAchieved } =
    useAchievedTaskMutation();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTaskMutation();

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold">Task not found</div>
      </div>
    );
  }

  const { task, project } = data;

  const isUserWatching = task?.watchers?.some(
    (watcher) => watcher._id.toString() === user?._id.toString()
  );

  const goBack = () => navigate(-1);

  const members = task?.assignees || [];

  const handleWatchTask = () => {
    watchTask(
      { taskId: task._id },
      {
        onSuccess: () => {
          toast.success("Task Watched");
        },
        onError: () => {
          toast.error("Failed to watch task");
        },
      }
    );
  };

  const handleAchievedTask = () => {
    achievedTask(
      { taskId: task._id },
      {
        onSuccess: () => {
          toast.success("Task achieved");
        },
        onError: () => {
          toast.error("Failed to achieve task");
        },
      }
    );
  };

  const handleDeleteTask = () => {
  if (!confirm("Are you sure you want to delete this task?")) return;

  deleteTask(
    { taskId: task._id },
    {
      onSuccess: () => {
        toast.success("Task deleted");
        navigate(`/workspaces/${workspaceId}/projects/${projectId}`);
      },
      onError: () => {
        toast.error("Failed to delete task");
      },
    }
  );
};


  return (
    <div className="container mx-auto p-0 py-4 mx:px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex flex-col md:flex-row md:items-center">
          <BackButton />

          <h1 className="text-xl md:text-2xl font-bold">{task.title}</h1>
          {task.isArchived && (
            <Badge className="ml-2" variant={"outline"}>
              Archived
            </Badge>
          )}
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0 ">
          <Button
            className="w-fit"
            variant={"outline"}
            size={"sm"}
            onClick={handleWatchTask}
            disabled={isWatching}
          >
            {isUserWatching ? (
              <>
                <EyeOff className="mr-2 size-4" />
                Unwatch
              </>
            ) : (
              <>
                <Eye className="mr-2 size-4" />
                Watch
              </>
            )}
          </Button>

          <Button
            className="w-fit"
            variant={"outline"}
            size={"sm"}
            onClick={handleAchievedTask}
            disabled={isAchieved}
          >
            {task.isArchived ? "Unarchive" : "Archive"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg p-6 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start mb-4">
              <div>
                <Badge
                  variant={
                    task.priority === "High"
                      ? "destructive"
                      : task.priority === "Medium"
                      ? "default"
                      : "outline"
                  }
                  className="mb-2 capitalize"
                >
                  {task.priority} Priority
                </Badge>

                <TaskTitle title={task.title} taskId={task._id} />
                <div className="text-sm md:text-base text-muted-foreground">
                  Created at:{" "}
                  {formatDistanceToNow(new Date(task.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <TaskStatusSelector status={task.status} taskId={task._id} />
                <Button
                  variant={"destructive"}
                  size="sm"
                  onClick={handleDeleteTask}
                  disabled={isDeleting}
                  className="md:block"
                >
                  {isDeleting ? "Deleting..." : "Delete Task"}
                </Button>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-0">
                Description
              </h3>
              <TaskDescription
                description={task.description || ""}
                taskId={task._id}
              />
            </div>

            <TaskAssineesSelector
              task={task}
              assignees={task.assignees}
              projectMembers={project.members as any}
            />

            <TaskPrioritySelector priority={task.priority} taskId={task._id} />

            <SubTaskDetails subTasks={task.subtasks || []} taskId={task._id} />
          </div>

          <CommenSection taskId={task._id} members={project.members as any} />
        </div>

        {/* right side  */}
        <div className="w-full">
          <Watchers watchers={task.watchers || []} />

          <TaskActivity resourceId={task._id} />
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
